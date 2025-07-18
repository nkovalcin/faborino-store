-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name JSONB NOT NULL,
  description JSONB,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name JSONB NOT NULL,
  description JSONB,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE NOT NULL,
  inventory_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2) DEFAULT 0,
  dimensions JSONB,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  material TEXT,
  safety_certifications TEXT[],
  images TEXT[],
  category_id UUID REFERENCES categories(id),
  subcategory TEXT,
  is_active BOOLEAN DEFAULT true,
  assembly_required BOOLEAN DEFAULT false,
  care_instructions TEXT,
  shipping_cost_eu DECIMAL(8,2) DEFAULT 0,
  shipping_time TEXT,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  accepts_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  status order_status DEFAULT 'pending',
  currency VARCHAR(3) DEFAULT 'EUR',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  customer_name VARCHAR(200) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions table
CREATE TABLE newsletters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  language VARCHAR(10) DEFAULT 'sk',
  source VARCHAR(100),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title JSONB NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt JSONB,
  content JSONB NOT NULL,
  cover_image TEXT,
  author_name VARCHAR(100) NOT NULL,
  author_bio TEXT,
  author_avatar TEXT,
  tags TEXT[],
  category VARCHAR(100),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_age_range ON products(age_min, age_max);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Full-text search indexes
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name::text || ' ' || description::text));
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title::text || ' ' || content::text));

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (id, name, description, slug, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 
   '{"sk": "Prvé kroky", "en": "First Steps", "de": "Erste Schritte", "fr": "Premiers pas"}',
   '{"sk": "Perfektné pre bábätká a batoľatá", "en": "Perfect for babies and toddlers", "de": "Perfekt für Babys und Kleinkinder", "fr": "Parfait pour les bébés et les tout-petits"}',
   'first-steps', 1),
  ('22222222-2222-2222-2222-222222222222',
   '{"sk": "Odvážni prieskumníci", "en": "Brave Explorers", "de": "Mutige Entdecker", "fr": "Explorateurs courageux"}',
   '{"sk": "Pre batoľatá pripravené liezť a objavovať", "en": "For toddlers ready to climb and explore", "de": "Für Kleinkinder, die bereit sind zu klettern und zu erforschen", "fr": "Pour les tout-petits prêts à grimper et explorer"}',
   'brave-explorers', 2),
  ('33333333-3333-3333-3333-333333333333',
   '{"sk": "Sebavedomí lezci", "en": "Confident Climbers", "de": "Selbstbewusste Kletterer", "fr": "Grimpeurs confiants"}',
   '{"sk": "Pokročilé lezecké vybavenie", "en": "Advanced climbing equipment", "de": "Fortgeschrittene Kletterausrüstung", "fr": "Équipement d\'escalade avancé"}',
   'confident-climbers', 3),
  ('44444444-4444-4444-4444-444444444444',
   '{"sk": "Kreatívne priestory", "en": "Creative Spaces", "de": "Kreative Räume", "fr": "Espaces créatifs"}',
   '{"sk": "Nábytok a doplnky pre tvorivú hru", "en": "Furniture and accessories for creative play", "de": "Möbel und Zubehör für kreatives Spiel", "fr": "Meubles et accessoires pour le jeu créatif"}',
   'creative-spaces', 4),
  ('55555555-5555-5555-5555-555555555555',
   '{"sk": "Spoločný rast", "en": "Growing Together", "de": "Gemeinsam wachsen", "fr": "Grandir ensemble"}',
   '{"sk": "Modulárne sady rastúce s dieťaťom", "en": "Modular sets that grow with your child", "de": "Modulare Sets, die mit Ihrem Kind mitwachsen", "fr": "Ensembles modulaires qui grandissent avec votre enfant"}',
   'growing-together', 5);

-- RLS (Row Level Security) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users for public data
CREATE POLICY "Allow public read access to active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow public read access to reviews" ON reviews FOR SELECT USING (true);

-- Allow authenticated users to manage their own data
CREATE POLICY "Allow users to view their own orders" ON orders FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
CREATE POLICY "Allow users to insert their own orders" ON orders FOR INSERT WITH CHECK (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Allow users to view their own profile" ON customers FOR SELECT USING (email = auth.jwt() ->> 'email');
CREATE POLICY "Allow users to update their own profile" ON customers FOR UPDATE USING (email = auth.jwt() ->> 'email');
CREATE POLICY "Allow users to insert their own profile" ON customers FOR INSERT WITH CHECK (email = auth.jwt() ->> 'email');

-- Allow insert for newsletter subscriptions
CREATE POLICY "Allow newsletter subscriptions" ON newsletters FOR INSERT WITH CHECK (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Allow authenticated users to insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a function to get products with search and filters
CREATE OR REPLACE FUNCTION get_products_with_filters(
  search_term TEXT DEFAULT NULL,
  category_id UUID DEFAULT NULL,
  age_min INTEGER DEFAULT NULL,
  age_max INTEGER DEFAULT NULL,
  price_min DECIMAL DEFAULT NULL,
  price_max DECIMAL DEFAULT NULL,
  sort_by TEXT DEFAULT 'name',
  sort_order TEXT DEFAULT 'asc',
  page_limit INTEGER DEFAULT 20,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name JSONB,
  description JSONB,
  slug VARCHAR,
  price DECIMAL,
  compare_price DECIMAL,
  sku VARCHAR,
  images TEXT[],
  category_id UUID,
  subcategory TEXT,
  age_min INTEGER,
  age_max INTEGER,
  material TEXT,
  safety_certifications TEXT[],
  assembly_required BOOLEAN,
  care_instructions TEXT,
  shipping_cost_eu DECIMAL,
  shipping_time TEXT,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.slug,
    p.price,
    p.compare_price,
    p.sku,
    p.images,
    p.category_id,
    p.subcategory,
    p.age_min,
    p.age_max,
    p.material,
    p.safety_certifications,
    p.assembly_required,
    p.care_instructions,
    p.shipping_cost_eu,
    p.shipping_time,
    p.specifications,
    p.created_at
  FROM products p
  WHERE 
    p.is_active = true
    AND (search_term IS NULL OR to_tsvector('english', p.name::text || ' ' || p.description::text) @@ plainto_tsquery('english', search_term))
    AND (category_id IS NULL OR p.category_id = category_id)
    AND (age_min IS NULL OR p.age_max >= age_min)
    AND (age_max IS NULL OR p.age_min <= age_max)
    AND (price_min IS NULL OR p.price >= price_min)
    AND (price_max IS NULL OR p.price <= price_max)
  ORDER BY
    CASE WHEN sort_by = 'name' AND sort_order = 'asc' THEN p.name::text END ASC,
    CASE WHEN sort_by = 'name' AND sort_order = 'desc' THEN p.name::text END DESC,
    CASE WHEN sort_by = 'price' AND sort_order = 'asc' THEN p.price END ASC,
    CASE WHEN sort_by = 'price' AND sort_order = 'desc' THEN p.price END DESC,
    CASE WHEN sort_by = 'age' AND sort_order = 'asc' THEN p.age_min END ASC,
    CASE WHEN sort_by = 'age' AND sort_order = 'desc' THEN p.age_min END DESC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'asc' THEN p.created_at END ASC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN p.created_at END DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;