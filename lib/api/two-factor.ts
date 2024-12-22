import { authenticator } from '@otplib/preset-default';
import { supabase } from "@/lib/auth/auth-config";
import { sendTwoFactorCode } from "./email";

export async function setupTwoFactor(userId: string, type: '2fa' | 'sms' | 'email') {
  const secret = authenticator.generateSecret();
  
  const { error } = await supabase
    .from('two_factor_auth')
    .insert({
      user_id: userId,
      type,
      secret,
      enabled: false
    });

  if (error) throw error;

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () => 
    Math.random().toString(36).slice(2, 10).toUpperCase()
  );

  await supabase
    .from('backup_codes')
    .insert(
      backupCodes.map(code => ({
        user_id: userId,
        code
      }))
    );

  return {
    secret,
    backupCodes
  };
}

export async function verifyTwoFactor(userId: string, code: string): Promise<boolean> {
  const { data: twoFactor } = await supabase
    .from('two_factor_auth')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!twoFactor) return false;

  // Check if it's a backup code
  const { data: backupCode } = await supabase
    .from('backup_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('code', code)
    .eq('used', false)
    .single();

  if (backupCode) {
    await supabase
      .from('backup_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', backupCode.id);
    return true;
  }

  // Verify TOTP code
  return authenticator.verify({
    token: code,
    secret: twoFactor.secret
  });
}