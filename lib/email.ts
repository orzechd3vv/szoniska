import { Resend } from 'resend';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY || 're_dummy_key_for_build';
  return new Resend(apiKey);
}

const fromEmail = process.env.EMAIL_FROM || 'verify@szoniska.xyz';

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const resend = getResend();
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weryfikacja konta - Szoniska</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #020202; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020202; padding: 60px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #0a0a0a; border-radius: 48px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.8);">
              
              <!-- Header with Glowing Accent -->
              <tr>
                <td style="padding: 60px 40px 20px 40px; text-align: center;">
                   <div style="display: inline-block; padding: 2px; background: linear-gradient(to right, #8b5cf6, #ec4899); border-radius: 20px; margin-bottom: 24px;">
                    <div style="background: #000; padding: 12px 24px; border-radius: 18px;">
                      <span style="color: #fff; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Szoniska</span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 0 60px 60px 60px;">
                  <h1 style="color: #ffffff; font-size: 40px; margin: 0 0 16px 0; font-weight: 900; letter-spacing: -2px; text-align: center; line-height: 1.1;">
                    WITAJ NA <br/> <span style="color: #8b5cf6;">POKŁADZIE</span>
                  </h1>
                  
                  <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0; text-align: center; font-weight: 500;">
                    ${name ? `${name}, d` : 'D'}ziękujemy za dołączenie do największej polskiej społeczności szonów. <br/> Zweryfikuj swoje konto, aby uzyskać pełny dostęp.
                  </p>

                  <!-- Verification Code Box -->
                  <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 32px; padding: 40px; margin-bottom: 40px; text-align: center;">
                    <p style="color: #6366f1; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; margin: 0 0 16px 0;">TWÓJ KOD DOSTĘPU</p>
                    <div style="font-size: 48px; font-weight: 900; color: #fff; letter-spacing: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
                      ${token}
                    </div>
                  </div>

                  <!-- Action Button -->
                  <div style="text-align: center;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 24px 60px; background: #fff; color: #000; text-decoration: none; border-radius: 24px; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 20px 40px rgba(255,255,255,0.1);">
                      POTWIERDŹ EMAIL
                    </a>
                  </div>

                  <p style="color: #475569; font-size: 12px; margin: 40px 0 0 0; text-align: center; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    Lub wprowadź kod ręcznie na stronie weryfikacji.
                  </p>
                </td>
              </tr>

              <!-- Footer Banner -->
              <tr>
                <td style="padding: 40px; background: #111; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                  <p style="color: #475569; font-size: 11px; margin: 0; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                    © ${new Date().getFullYear()} szoniska.xyz • ZYVALIS GROUP
                  </p>
                </td>
              </tr>
            </table>
            
            <p style="color: #334155; font-size: 11px; margin-top: 30px; text-align: center;">
              Wiadomość wygenerowana automatycznie. Link wygasa po 24 godzinach.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: `Szoniska <${fromEmail}>`,
    to: email,
    subject: 'Klucz do Twojego konta - Szoniska',
    html: htmlContent,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resend = getResend();
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset hasła - Szoniska</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #020202; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020202; padding: 60px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: #0a0a0a; border-radius: 48px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden;">
              
              <tr>
                <td style="padding: 60px 40px 20px 40px; text-align: center;">
                   <div style="display: inline-block; padding: 2px; background: linear-gradient(to right, #ef4444, #f97316); border-radius: 20px;">
                    <div style="background: #000; padding: 12px 24px; border-radius: 18px;">
                      <span style="color: #fff; font-size: 20px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Szoniska Security</span>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 60px 60px 60px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 40px; margin: 24px 0 16px 0; font-weight: 900; letter-spacing: -2px; line-height: 1.1;">
                    RESET <br/> <span style="color: #ef4444;">HASŁA</span>
                  </h1>
                  
                  <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0; font-weight: 500;">
                    Otrzymaliśmy prośbę o zresetowanie hasła dla Twojego konta. <br/> Jeśli to nie Ty, zignoruj tę wiadomość.
                  </p>

                  <div style="text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 24px 60px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 24px; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
                      USTAW NOWE HASŁO
                    </a>
                  </div>

                  <p style="color: #475569; font-size: 11px; margin: 40px 0 0 0; font-weight: 600; word-break: break-all;">
                    ${resetUrl}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px; background: #111; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                  <p style="color: #475569; font-size: 11px; margin: 0; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                    © ${new Date().getFullYear()} szoniska.xyz
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: `Szoniska <${fromEmail}>`,
    to: email,
    subject: 'Odzyskiwanie dostępu - Szoniska',
    html: htmlContent,
  });
}
