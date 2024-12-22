/*
  # Add Audit Logging and 2FA Support

  1. New Tables
    - `audit_logs`: Stores all system audit events
    - `two_factor_auth`: Stores 2FA configurations
    - `backup_codes`: Stores 2FA backup codes
    
  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Audit Logging
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Two-Factor Authentication
CREATE TABLE two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  type text NOT NULL,
  secret text NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('authenticator', 'sms', 'email'))
);

ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own 2FA"
  ON two_factor_auth FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- 2FA Backup Codes
CREATE TABLE backup_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  code text NOT NULL,
  used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE backup_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own backup codes"
  ON backup_codes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_backup_codes_user_id ON backup_codes(user_id);