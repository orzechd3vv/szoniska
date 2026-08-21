'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaShieldAlt, FaQrcode, FaCheckCircle, FaTimesCircle, FaCopy, FaKey, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import Image from 'next/image';

export default function SecuritySettings() {
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await fetch('/api/user/2fa-status');
        const data = await response.json();
        if (response.ok) {
          setTwoFactorEnabled(data.twoFactorEnabled);
        }
      } catch (error) {
        console.error('Błąd pobierania statusu 2FA:', error);
      }
    };

    fetch2FAStatus();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Nowe hasła nie pasują do siebie' });
      return;
    }

    if (changePasswordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Hasło musi mieć minimum 6 znaków' });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: changePasswordForm.currentPassword,
          newPassword: changePasswordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({ type: 'error', text: data.error });
      } else {
        setPasswordMessage({ type: 'success', text: data.message });
        setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleStartTwoFactorSetup = async () => {
    setTwoFactorMessage(null);
    setTwoFactorLoading(true);

    try {
      const response = await fetch('/api/user/2fa');
      const data = await response.json();

      if (!response.ok) {
        setTwoFactorMessage({ type: 'error', text: data.error });
      } else {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowTwoFactorSetup(true);
      }
    } catch (error) {
      setTwoFactorMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      setTwoFactorMessage({ type: 'error', text: 'Kod musi mieć 6 cyfr' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode,
          secret,
          action: 'enable',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTwoFactorMessage({ type: 'error', text: data.error });
      } else {
        setTwoFactorMessage({ type: 'success', text: data.message });
        setTwoFactorEnabled(true);
        setShowTwoFactorSetup(false);
        setVerificationCode('');
      }
    } catch (error) {
      setTwoFactorMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (verificationCode.length !== 6) {
      setTwoFactorMessage({ type: 'error', text: 'Kod musi mieć 6 cyfr' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationCode,
          action: 'disable',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTwoFactorMessage({ type: 'error', text: data.error });
      } else {
        setTwoFactorMessage({ type: 'success', text: data.message });
        setTwoFactorEnabled(false);
        setVerificationCode('');
      }
    } catch (error) {
      setTwoFactorMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Password Change Section */}
      <section className="glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <FaLock size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Autoryzacja</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Zmiana klucza dostępu do Twojego profilu</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-8 max-w-2xl relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">Obecne hasło</label>
            <input
              type="password"
              value={changePasswordForm.currentPassword}
              onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
              className="input-field w-full py-5 px-8 text-sm"
              placeholder="Wprowadź aktualne hasło dla weryfikacji"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">Nowy klucz</label>
              <input
                type="password"
                value={changePasswordForm.newPassword}
                onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                className="input-field w-full py-5 px-8 text-sm"
                placeholder="Minimum 6 znaków"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">Powtórz klucz</label>
              <input
                type="password"
                value={changePasswordForm.confirmPassword}
                onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                className="input-field w-full py-5 px-8 text-sm"
                placeholder="Zgodne z nowym hasłem"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {passwordMessage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-6 rounded-2xl border flex items-center gap-4 text-[11px] font-black uppercase tracking-wider ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-500/5 border-green-500/20 text-green-400'
                    : 'bg-red-500/5 border-red-500/20 text-red-400'
                }`}
              >
                {passwordMessage.type === 'success' ? <FaCheckCircle size={16} /> : <FaTimesCircle size={16} />}
                {passwordMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={passwordLoading}
            className="btn-primary w-full md:w-auto py-5 px-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-600/20"
          >
            {passwordLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : 'Aktualizuj zabezpieczenia'}
          </button>
        </form>

        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
      </section>

      {/* 2FA Section */}
      <section className="glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20">
            <FaShieldAlt size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Ochrona 2FA</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Weryfikacja dwupoziomowa dla maksymalnego bezpieczeństwa</p>
          </div>
        </div>

        <div className="max-w-2xl relative z-10">
          <div className="flex items-start gap-4 mb-10 p-6 glass-dark rounded-3xl border-white/5">
            <FaInfoCircle className="text-primary-400 shrink-0 mt-1" size={16} />
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed uppercase tracking-widest opacity-80">
              Włączenie 2FA wymaga podania unikalnego, generowanego co 30 sekund kodu przy każdym logowaniu. Drastycznie zwiększa to bezpieczeństwo przed nieautoryzowanym dostępem do Twoich danych i postów.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!twoFactorEnabled && !showTwoFactorSetup ? (
              <motion.button
                key="enable-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleStartTwoFactorSetup}
                disabled={twoFactorLoading}
                className="group w-full flex items-center justify-between glass py-8 px-10 rounded-[2.5rem] text-white font-black hover:bg-white/5 transition-all border-white/10 active:scale-[0.98]"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform shadow-inner">
                    <FaQrcode size={28} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm uppercase tracking-[0.2em] mb-1">Inicjuj procedurę 2FA</span>
                    <span className="block text-[9px] text-gray-600 font-black uppercase">Zeskanuj kod aby zabezpieczyć konto</span>
                  </div>
                </div>
                <FaChevronRight className="text-gray-700 group-hover:text-primary-400 transition-colors" />
              </motion.button>
            ) : showTwoFactorSetup && !twoFactorEnabled ? (
              <motion.div
                key="setup-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-dark rounded-[3rem] p-10 border-primary-500/20 shadow-2xl space-y-10"
              >
                <div className="flex flex-col items-center gap-10">
                  <div className="relative group">
                    <div className="absolute -inset-3 bg-primary-500/25 blur-3xl group-hover:bg-primary-500/40 transition-all duration-700" />
                    <div className="bg-white p-8 rounded-[2.5rem] relative shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                      <Image src={qrCode} alt="QR Code" width={300} height={300} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 w-full max-w-md">
                    <h4 className="text-white font-black text-lg uppercase tracking-widest italic text-center">Kroki konfiguracji:</h4>
                    <div className="space-y-4">
                      {[
                        'Otwórz Google Authenticator lub podobną aplikację.',
                        'Zeskanuj widoczny kod QR telefonem.',
                        'Lub wprowadź klucz ręcznie w aplikacji:'
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] text-primary-400 border border-white/5">{i+1}</span>
                          {step}
                        </div>
                      ))}
                    </div>
                    <div className="group relative">
                      <div className="flex items-center gap-3 p-3 bg-black/60 rounded-2xl border border-white/5 group-hover:border-primary-500/30 transition-colors">
                        <span className="flex-1 font-mono text-[11px] text-primary-400 px-3 truncate tracking-widest uppercase">{secret}</span>
                        <button onClick={copySecretToClipboard} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-500 hover:text-white">
                          {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] block text-center">Wprowadź 6-cyfrowy kod autoryzacji</label>
                  <div className="relative max-w-sm mx-auto">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full bg-black/60 border-2 border-white/10 focus:border-primary-500 rounded-[2rem] py-6 text-center text-4xl font-black text-white tracking-[0.8em] focus:outline-none transition-all placeholder:text-white/5 shadow-inner"
                      placeholder="000000"
                      maxLength={6}
                    />
                    {verificationCode.length === 6 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <FaCheckCircle size={18} />
                      </motion.div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <button onClick={() => setShowTwoFactorSetup(false)} className="glass py-5 rounded-[1.5rem] font-black text-[10px] text-gray-600 hover:text-white uppercase tracking-[0.2em] transition-all">Poniechaj</button>
                    <button 
                      onClick={handleEnable2FA} 
                      disabled={verificationCode.length !== 6 || twoFactorLoading} 
                      className="btn-primary py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
                    >
                      {twoFactorLoading ? 'Aktywacja...' : 'Aktywuj ochronę'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : twoFactorEnabled ? (
              <motion.div
                key="enabled-info"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="p-10 bg-green-500/5 border border-green-500/20 rounded-[3rem] flex items-center gap-8 relative overflow-hidden group shadow-2xl">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 rounded-full blur-[80px]" />
                  <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.1)] group-hover:rotate-6 transition-transform">
                    <FaShieldAlt size={40} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-1 italic">Status: Secure</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] opacity-80">Twoje konto jest pod pełną ochroną 2FA.</p>
                  </div>
                </div>

                <div className="p-10 glass rounded-[3rem] border-red-500/20 bg-red-500/5 space-y-8 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-black flex items-center gap-3 text-sm uppercase tracking-widest italic">
                      <FaTimesCircle className="text-red-500" /> Procedura wyłączenia
                    </h4>
                  </div>
                  <p className="text-[10px] text-gray-500 font-black leading-relaxed uppercase tracking-[0.2em] max-w-md opacity-80">
                    Operacja ta drastycznie obniży odporność Twojego profilu na ataki. Wymaga aktualnego tokena w celu autoryzacji usunięcia ochrony.
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-center text-2xl font-black text-white tracking-[0.4em] focus:outline-none focus:border-red-500/50 transition-all shadow-inner"
                      placeholder="TOKEN"
                      maxLength={6}
                    />
                    <button 
                      onClick={handleDisable2FA} 
                      disabled={verificationCode.length !== 6 || twoFactorLoading} 
                      className="bg-red-600 hover:bg-red-700 text-white font-black px-10 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                    >
                      Dezaktywuj
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {twoFactorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-6 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-4 ${
                twoFactorMessage.type === 'success'
                  ? 'bg-green-500/5 border-green-500/20 text-green-400'
                  : 'bg-red-500/5 border-red-500/20 text-red-400'
              }`}
            >
              <FaKey className="text-primary-400" />
              {twoFactorMessage.text}
            </motion.div>
          )}
        </div>

        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[120px]" />
      </section>
    </div>
  );
}


