# 🚀 Poradnik: Wdrożenie aplikacji Szoniska na VPS

Ten przewodnik krok po kroku przeprowadzi Cię przez proces instalacji i konfiguracji Twojej aplikacji na własnym serwerze VPS z systemem Ubuntu, podłączenia domeny oraz zabezpieczenia jej darmowym certyfikatem SSL.

---

## 🛠️ Wymagania wstępne

1. **Serwer VPS:** Z zainstalowanym systemem **Ubuntu 20.04 LTS lub 22.04 LTS**.
2. **Domena:** Wykupiona własna domena (np. `szoniska.pl`).
3. **Dostęp do serwera:** Klient SSH (np. PuTTY na Windowsie lub wbudowany terminal).
4. **Baza danych:** Zewnętrzna baza danych MongoDB (np. MongoDB Atlas) skonfigurowana do przyjmowania połączeń produkcyjnych (z wybranymi IP lub `0.0.0.0/0` dla wygody).

---

## ⚙️ Krok 1: Konfiguracja domeny (DNS)

Zanim zaczniesz konfigurację na serwerze, musisz skierować swoją domenę na adres IP Twojego VPS.

1. Zaloguj się do panelu dostawcy swojej domeny (np. nazwa.pl, home.pl, OVH, Cloudflare).
2. Przejdź do konfiguracji rekordów DNS.
3. Dodaj rekord typu **A**:
   - **Nazwa:** `@` (lub pozostaw puste, oznacza to domenę główną np. `szoniska.pl`)
   - **Adres IP:** Adres IP Twojego serwera VPS.
4. (Opcjonalnie) Dodaj rekord typu **A** lub **CNAME** dla subdomeny "www":
   - **Nazwa:** `www`
   - **Adres IP / Wartość:** Ten sam adres IP lub nazwa głównej domeny.

> [!NOTE]
> Propagacja DNS może zająć od kilku minut do nawet 24 godzin.

---

## 💻 Krok 2: Instalacja niezbędnego oprogramowania na VPS

Zaloguj się na swój serwer przez SSH:
```bash
ssh root@twoj_adres_ip
```

Zaktualizuj pakiety systemowe:
```bash
sudo apt update && sudo apt upgrade -y
```

Zainstaluj **Node.js** (w wersji 18+ lub nowszej, rekomendowana wersja 20 LTS):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Sprawdź, czy instalacja przebiegła pomyślnie:
```bash
node -v
npm -v
```

Zainstaluj menedżer procesów **PM2** (pozwoli na działanie aplikacji w tle) oraz **Nginx**:
```bash
sudo npm install -g pm2
sudo apt install -y nginx
```

---

## 📂 Krok 3: Umieszczenie kodu na serwerze

Najlepszą metodą na wrzucenie kodu z lokalnego komputera na VPS jest użycie Git.

Zainstaluj gita:
```bash
sudo apt install git -y
```

Sklonuj swoje repozytorium (upewnij się, że kod jest np. na GitHubie lub GitLabie):
```bash
cd /var/www
# Klonowanie projektu (zmień na swój link)
git clone https://github.com/TwojLogin/Szoniska.git szoniska
cd szoniska
```

*Zamiast Gita, możesz użyć programu takiego jak **FileZilla** lub **WinSCP** (przez protokół SFTP), by przerzucić cały folder projektu (bez folderu `node_modules` i folderu `.next`!) do `/var/www/szoniska`.*

---

## 🏗️ Krok 4: Instalacja pakietów, środowisko i budowanie

Wewnątrz folderu projektu (`/var/www/szoniska`) zainstaluj zależności:
```bash
npm install
```

Utwórz plik konfiguracyjny środowiska `.env`:
```bash
nano .env
```
Wklej do niego zawartość produkcyjną. Ważne zmiany w `.env` względem testów lokalnych:
- `NEXTAUTH_URL="https://szoniska.pl"` (Twoja domena produkcyjna ze https)
- Zaktualizuj ścieżki Redirect URI w ustawieniach konsoli Google, aby kierowały na Twoją domenę (np. `https://szoniska.pl/api/auth/callback/google`).

Zapisz plik (`Ctrl+O`, `Enter`, następnie `Ctrl+X`).

Wygeneruj schematy Prisma i sformatuj bazę (baza musi być pusta lub użyj `db push` z ostrożnością):
```bash
npx prisma generate
npx prisma db push
```

Zbuduj aplikację w wersję produkcyjną:
```bash
npm run build
```

---

## 🔄 Krok 5: Uruchomienie aplikacji w PM2

PM2 zadba o to, by aplikacja nie wyłączyła się, gdy wyjdziesz z konsoli, a także samodzielnie zrestartuje ją w przypadku błędu.

```bash
# Uruchamianie aplikacji Next.js przez PM2 na domyślnym porcie 3000
pm2 start npm --name "szoniska" -- start
```

Upewnij się, że PM2 uruchomi się automatycznie po zresetowaniu całego serwera VPS:
```bash
pm2 startup
# Wykonaj polecenie, które wygeneruje się w konsoli!
pm2 save
```

---

## 🌐 Krok 6: Konfiguracja serwera Nginx (Reverse Proxy)

Teraz powiemy serwerowi, aby ruch przychodzący do domeny na porcie 80 kierował bezpośrednio do naszej aplikacji na port 3000.

Otwórz plik konfiguracji nowej strony w Nginx:
```bash
sudo nano /etc/nginx/sites-available/szoniska
```

Wklej poniższą konfigurację (pamiętaj, aby podmienić adres domeny!):
```nginx
server {
    listen 80;
    server_name szoniska.pl www.szoniska.pl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Zapisz plik (`Ctrl+O`, `Enter`, `Ctrl+X`).

Aktywuj nową konfigurację tworząc dowiązanie symboliczne:
```bash
sudo ln -s /etc/nginx/sites-available/szoniska /etc/nginx/sites-enabled/
```

Sprawdź, czy składnia Nginx jest poprawna:
```bash
sudo nginx -t
```
Jeśli dostaniesz odpowiedź "syntax is ok", zrestartuj Nginx:
```bash
sudo systemctl restart nginx
```

Aplikacja powinna już działać pod Twoją domeną w przeglądarce, na razie na połączeniu niezabezpieczonym `http://`.

---

## 🔒 Krok 7: Zabezpieczenie certyfikatem SSL (HTTPS)

Użyjemy darmowego certyfikatu od **Let's Encrypt** konfigurowanego przez bota **Certbot**.

Zainstaluj narzędzie:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

Uruchom kreator generowania certyfikatów SSL:
```bash
sudo certbot --nginx -d szoniska.pl -d www.szoniska.pl
```
- Podaj swój adres e-mail (do powiadomień o odnowieniu).
- Zaakceptuj regulamin usług ("A").
- Jeśli zapyta, czy przekierowywać cały ruch z HTTP do HTTPS – **wybierz opcję numer 2 (Redirect)** (wymuszaj).

> [!TIP]
> Certyfikaty od Let's Encrypt są ważne przez 90 dni, jednak certbot instaluje proces, który odnawia je automatycznie! Twoja domena jest chroniona, a w przeglądarce od teraz będzie widniała kłódka.

---

## 🎉 Gotowe!

Aplikacja **Szoniska** powinna już bezbłędnie działać i obsługiwać ruch produkcyjny.

**Przydatne komendy do zapamiętania na przyszłość:**
- Restartowanie aplikacji po wrzuceniu nowego kodu lub aktualizacji:
  `npm run build` -> `pm2 restart szoniska`
- Sprawdzanie logów z konsoli pod kątem błędów produkcyjnych:
  `pm2 logs szoniska`
- Wyświetlanie aktualnego statusu włączonej aplikacji:
  `pm2 status`
