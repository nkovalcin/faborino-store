-- Step 2: Create tables
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
  revolut_payment_id VARCHAR(255),
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