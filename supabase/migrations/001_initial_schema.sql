-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PRODUCTS
create type public.product_category as enum ('rudraksha', 'crystal', 'combo');

create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price integer not null,
  compare_price integer,
  category product_category not null,
  images text[] default '{}',
  in_stock boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select using (true);

create policy "Only admins can modify products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- PRODUCT VARIANTS
create table public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  name text not null,
  price_modifier integer default 0,
  stock_quantity integer default 0,
  created_at timestamptz default now()
);

alter table public.product_variants enable row level security;

create policy "Anyone can view variants"
  on public.product_variants for select using (true);

create policy "Only admins can modify variants"
  on public.product_variants for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ORDERS
create type public.order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
);

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null unique,
  status order_status default 'pending',
  total_amount integer not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  shipping_address jsonb not null,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Authenticated users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null,
  price_at_purchase integer not null
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Authenticated users can create order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

-- COUPONS
create type public.discount_type as enum ('percent', 'flat');

create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  discount_type discount_type not null,
  discount_value integer not null,
  min_order integer default 0,
  max_uses integer,
  used_count integer default 0,
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.coupons enable row level security;

create policy "Anyone can view active coupons"
  on public.coupons for select using (is_active = true);

create policy "Only admins can manage coupons"
  on public.coupons for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ORDER NUMBER SEQUENCE
create sequence order_number_seq start 1001;

create or replace function generate_order_number()
returns text as $$
begin
  return 'SNS-' || nextval('order_number_seq')::text;
end;
$$ language plpgsql;
