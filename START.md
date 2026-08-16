# Szoniska - Instrukcje uruchomienia

## ✅ Projekt został pomyślnie utworzony!

Wszystkie pliki zostały wygenerowane. Teraz czas na konfigurację i uruchomienie.

## 📦 Krok 1: Instalacja zależności

Otwórz terminal PowerShell i wykonaj:

```powershell
cd "c:\Users\orzec\Documents\77 orzech\Szoniska"
npm install
```

To zainstaluje wszystkie wymagane pakiety (Next.js, React, Prisma, NextAuth, Framer Motion, itd.)

## 🗄️ Krok 2: Konfiguracja bazy danych

### Opcja A: MongoDB lokalnie (szybsze dla testów)

1. Pobierz MongoDB: https://www.mongodb.com/try/download/community
2. Zainstaluj i uruchom
3. W `.env` ustaw: `DATABASE_URL="mongodb://localhost:27017/szoniska"`

### Opcja B: MongoDB Atlas (zalecane dla produkcji)

1. Zarejestruj się: https://www.mongodb.com/cloud/atlas
2. Stwórz darmowy klaster (Free Tier - M0)
3. Utwórz użytkownika bazy danych
4. Dodaj IP: 0.0.0.0/0 (dla testów)
5. Skopiuj connection string i wklej do `.env` jako `DATABASE_URL`

## 🔐 Krok 3: Konfiguracja OAuth

### Google OAuth:

1. Przejdź do: https://console.cloud.google.com/
2. Stwórz nowy projekt lub wybierz istniejący
3. W menu: APIs & Services → Credentials
4. Kliknij "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized redirect URIs: `https://www.szoniska.pl/api/auth/callback/google`
7. Skopiuj Client ID i Client Secret do `.env`

## ⚙️ Krok 4: Konfiguracja pliku .env

Skopiuj `.env.example` do `.env`:

```powershell
Copy-Item .env.example .env
```

Edytuj `.env` (np. w Notatniku):

```env
DATABASE_URL="mongodb://localhost:27017/szoniska"
# LUB dla MongoDB Atlas:
# DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/szoniska"

NEXTAUTH_URL="https://www.szoniska.pl"
NEXTAUTH_SECRET="WYGENERUJ_TUTAJ_LOSOWY_SECRET"

GOOGLE_CLIENT_ID="twoj-google-client-id"
GOOGLE_CLIENT_SECRET="twoj-google-client-secret"

ADMIN_EMAILS="twoj-admin-email@gmail.com"
```

**Wygeneruj NEXTAUTH_SECRET:**
```powershell
# W PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## 🚀 Krok 5: Inicjalizacja bazy danych

```powershell
npx prisma generate
npx prisma db push
```

## ▶️ Krok 6: Uruchomienie aplikacji

```powershell
npm run dev
```

Otwórz przeglądarkę: https://www.szoniska.pl

## 🎉 Gotowe!

Aplikacja powinna działać. Możesz:

1. **Zalogować się** - kliknij "Zaloguj się" w prawym górnym rogu
2. **Stworzyć post** - przejdź do Profil → Posty → Utwórz post
3. **Zatwierdzić post** - jeśli jesteś adminem, przejdź do Profil → Panel → Weryfikowanie

## 🐛 Rozwiązywanie problemów

### "Cannot connect to database"
- Sprawdź czy MongoDB jest uruchomiony
- Zweryfikuj DATABASE_URL w .env

### "OAuth error"
- Sprawdź czy redirect URLs są poprawnie skonfigurowane
- Upewnij się że Client ID i Secret są prawidłowe
- Zrestartuj serwer dev po zmianie .env

### "Module not found"
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Port 3000 zajęty
```powershell
# Uruchom na innym porcie:
$env:PORT=3001; npm run dev
# Pamiętaj aby zaktualizować NEXTAUTH_URL i OAuth redirect URLs!
```

## 📚 Dodatkowe informacje

- **Dokumentacja Next.js:** https://nextjs.org/docs
- **Dokumentacja Prisma:** https://www.prisma.io/docs
- **Dokumentacja NextAuth:** https://next-auth.js.org/
- **Dokumentacja Framer Motion:** https://www.framer.com/motion/

## 🎨 Funkcje aplikacji

✅ Czarno-fioletowa kolorystyka
✅ Płynne animacje (Framer Motion)
✅ Logowanie przez Google
✅ Tworzenie postów z max 10 zdjęciami
✅ Linki do social media (Facebook, Instagram, TikTok)
✅ System weryfikacji postów przez admina
✅ Galeria zdjęć z nawigacją strzałkami
✅ System komentarzy
✅ Panel użytkownika ze statystykami
✅ Panel administracji z zarządzaniem użytkownikami
✅ System ostrzeżeń

Powodzenia! 🚀
