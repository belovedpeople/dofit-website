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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_content ENABLE ROW LEVEL SECURITY;

-- 5. Allow public access
DROP POLICY IF EXISTS "Public access for products" ON public.products;
CREATE POLICY "Public access for products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for orders" ON public.orders;
CREATE POLICY "Public access for orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for showcase" ON public.showcase_content;
CREATE POLICY "Public access for showcase" ON public.showcase_content
  FOR ALL USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
