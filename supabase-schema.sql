-- ====================================================================
-- DOFIT WEARS: SUPABASE DATABASE INITIALIZATION SCRIPT
-- Paste this entire block into Supabase SQL Editor and click "Run"
-- ====================================================================

-- 1. Create PRODUCTS table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('dofit', 'asa')),
  price NUMERIC NOT NULL,
  formatted_price TEXT NOT NULL,
  category TEXT NOT NULL,
  tag TEXT,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  fabric TEXT DEFAULT '',
  care JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  size_prices JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create ORDERS table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  payment_method TEXT DEFAULT 'WhatsApp Transfer',
  brand TEXT DEFAULT 'dofit',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create SHOWCASE_CONTENT table (Landing page hero & gallery images)
CREATE TABLE IF NOT EXISTS public.showcase_content (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create VOUCHERS table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  max_uses INTEGER DEFAULT 0,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create ADMIN_USERS table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Store Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 6. Create PWA_BROADCASTS table
CREATE TABLE IF NOT EXISTS public.pwa_broadcasts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT DEFAULT '/shop',
  tag TEXT,
  category TEXT DEFAULT 'Drop Alert',
  sender_name TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_broadcasts ENABLE ROW LEVEL SECURITY;

-- 8. Allow public access
DROP POLICY IF EXISTS "Public access for products" ON public.products;
CREATE POLICY "Public access for products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for orders" ON public.orders;
CREATE POLICY "Public access for orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for showcase" ON public.showcase_content;
CREATE POLICY "Public access for showcase" ON public.showcase_content
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for vouchers" ON public.vouchers;
CREATE POLICY "Public access for vouchers" ON public.vouchers
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for admin_users" ON public.admin_users;
CREATE POLICY "Public access for admin_users" ON public.admin_users
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for pwa_broadcasts" ON public.pwa_broadcasts;
CREATE POLICY "Public access for pwa_broadcasts" ON public.pwa_broadcasts
  FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS size_prices JSONB DEFAULT '{}'::jsonb;

-- Seed default master admins
INSERT INTO public.admin_users (id, email, password, name, role)
VALUES 
  ('admin-master', 'brainwerkin@gmail.com', 'dofit2026admin', 'Lead Administrator', 'Super Admin'),
  ('admin-dolapo', 'dolapo@dofit.fit', 'dofit2026admin', 'Dolapo', 'Super Admin')
ON CONFLICT (email) DO NOTHING;

NOTIFY pgrst, 'reload schema';
