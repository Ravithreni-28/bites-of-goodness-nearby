
-- Function to delete all cart items for a user
CREATE OR REPLACE FUNCTION public.delete_user_cart_items(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.cart_items
  WHERE user_id = user_id_param;
END;
$$;

-- Function to insert cart items
CREATE OR REPLACE FUNCTION public.insert_cart_items(items_param JSONB[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  FOR i IN 1..array_length(items_param, 1) LOOP
    INSERT INTO public.cart_items (user_id, listing_id, quantity)
    VALUES (
      (items_param[i]->>'user_id')::UUID,
      (items_param[i]->>'listing_id')::UUID,
      (items_param[i]->>'quantity')::INTEGER
    )
    ON CONFLICT (user_id, listing_id) 
    DO UPDATE SET 
      quantity = (items_param[i]->>'quantity')::INTEGER,
      updated_at = NOW();
  END LOOP;
END;
$$;

-- Function to get cart with listing details
CREATE OR REPLACE FUNCTION public.get_cart_with_listings(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  listing_id UUID,
  title TEXT,
  price NUMERIC,
  quantity INTEGER,
  image_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    fl.id AS listing_id,
    fl.title,
    fl.price,
    ci.quantity,
    fl.image_url
  FROM 
    public.cart_items ci
    JOIN public.food_listings fl ON ci.listing_id = fl.id
  WHERE 
    ci.user_id = user_id_param;
END;
$$;

-- Function to create an order and order items
CREATE OR REPLACE FUNCTION public.create_order(
  user_id_input UUID,
  total_amount_input NUMERIC,
  order_items_input JSONB[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_order_id UUID;
BEGIN
  -- Create the order
  INSERT INTO public.orders (user_id, total_amount)
  VALUES (user_id_input, total_amount_input)
  RETURNING id INTO new_order_id;
  
  -- Insert order items
  FOR i IN 1..array_length(order_items_input, 1) LOOP
    INSERT INTO public.order_items (
      order_id, 
      listing_id, 
      quantity, 
      price_per_unit
    ) VALUES (
      new_order_id,
      (order_items_input[i]->>'listing_id')::UUID,
      (order_items_input[i]->>'quantity')::INTEGER,
      (order_items_input[i]->>'price_per_unit')::NUMERIC
    );
  END LOOP;
  
  -- Clear the user's cart
  DELETE FROM public.cart_items WHERE user_id = user_id_input;
  
  RETURN new_order_id;
END;
$$;

-- Ensure the handle_new_user function handles username conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  username_val TEXT;
  fullname_val TEXT;
  username_exists BOOLEAN;
BEGIN
  -- Extract username from user metadata
  username_val := NEW.raw_user_meta_data->>'username';
  
  -- Use full_name or fallback to name
  fullname_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name'
  );
  
  -- Check if username exists
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = username_val
  ) INTO username_exists;
  
  -- If username exists, append a random string to make it unique
  IF username_exists THEN
    username_val := username_val || '_' || substring(md5(random()::text), 1, 6);
  END IF;

  -- Insert new profile with unique username
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    username_val,
    fullname_val,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger to ensure it's up to date
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
