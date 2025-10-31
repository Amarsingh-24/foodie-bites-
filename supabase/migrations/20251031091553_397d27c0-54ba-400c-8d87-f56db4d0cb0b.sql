-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create foods table
CREATE TABLE IF NOT EXISTS public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  rating DECIMAL(2, 1) DEFAULT 4.0,
  discount_percent INTEGER DEFAULT 0,
  gst_percent INTEGER DEFAULT 5,
  delivery_charge DECIMAL(10, 2) DEFAULT 40.00,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, food_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  gst DECIMAL(10, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_mode TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Foods policies (public read access)
CREATE POLICY "Anyone can view available foods"
  ON public.foods FOR SELECT
  USING (is_available = true);

-- Cart policies
CREATE POLICY "Users can view their own cart"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their cart"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert sample food data
INSERT INTO public.foods (name, description, category, base_price, rating, discount_percent, image_url) VALUES
('Margherita Pizza', 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil', 'Pizza', 299.00, 4.5, 10, ''),
('Chicken Biryani', 'Aromatic basmati rice with tender chicken and exotic spices', 'Indian', 249.00, 4.7, 15, ''),
('Veggie Burger', 'Healthy burger with grilled vegetables, lettuce, and special sauce', 'Burger', 179.00, 4.3, 5, ''),
('Pad Thai', 'Traditional Thai stir-fried noodles with peanuts and lime', 'Thai', 219.00, 4.6, 10, ''),
('Caesar Salad', 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing', 'Salad', 159.00, 4.4, 0, ''),
('Sushi Platter', 'Assorted fresh sushi rolls with wasabi and pickled ginger', 'Japanese', 499.00, 4.8, 20, ''),
('Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces', 'Indian', 289.00, 4.7, 10, ''),
('Greek Salad', 'Mediterranean salad with feta, olives, cucumber, and tomatoes', 'Salad', 189.00, 4.5, 5, '');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();