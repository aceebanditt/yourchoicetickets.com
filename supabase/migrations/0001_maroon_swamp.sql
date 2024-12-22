/*
  # Initial Database Schema

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - email (text)
      - name (text)
      - avatar_url (text)
      - preferences (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - events
      - id (uuid)
      - title (text)
      - description (text)
      - venue_id (uuid)
      - date (timestamptz)
      - category (text)
      - subcategory (text)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - tickets
      - id (uuid)
      - event_id (uuid)
      - section (text)
      - row (text)
      - seat (text)
      - price (decimal)
      - status (text)
      - user_id (uuid, nullable)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - orders
      - id (uuid)
      - user_id (uuid)
      - status (text)
      - total (decimal)
      - created_at (timestamptz)
      - expires_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  venue_id uuid NOT NULL,
  date timestamptz NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'cancelled', 'completed'))
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Create tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id),
  section text NOT NULL,
  row text NOT NULL,
  seat text NOT NULL,
  price decimal NOT NULL,
  status text NOT NULL DEFAULT 'available',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('available', 'reserved', 'sold'))
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read available tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (status = 'available' OR user_id = auth.uid());

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  total decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create order_tickets junction table
CREATE TABLE order_tickets (
  order_id uuid REFERENCES orders(id),
  ticket_id uuid REFERENCES tickets(id),
  PRIMARY KEY (order_id, ticket_id)
);

ALTER TABLE order_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order tickets"
  ON order_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_tickets.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);