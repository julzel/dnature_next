-- DNAture Stage 1 customer-account foundation.
-- Customer identity remains in auth.users. Public tables contain only
-- application data and are protected by explicit Row Level Security policies.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name varchar(80) not null default '',
  last_name varchar(120) not null default '',
  phone varchar(32),
  age_confirmed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint customer_profiles_first_name_length check (char_length(first_name) <= 80),
  constraint customer_profiles_last_name_length check (char_length(last_name) <= 120),
  constraint customer_profiles_phone_length check (phone is null or char_length(phone) between 8 and 32)
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label varchar(60) not null default 'Principal',
  province varchar(80) not null,
  canton varchar(100) not null,
  district varchar(100) not null default '',
  directions varchar(500) not null,
  delivery_notes varchar(300) not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint customer_addresses_label_present check (char_length(trim(label)) between 1 and 60),
  constraint customer_addresses_province_present check (char_length(trim(province)) between 1 and 80),
  constraint customer_addresses_canton_present check (char_length(trim(canton)) between 1 and 100),
  constraint customer_addresses_directions_present check (char_length(trim(directions)) between 1 and 500)
);

create index customer_addresses_user_id_idx on public.customer_addresses(user_id);
create unique index customer_addresses_one_default_idx
  on public.customer_addresses(user_id)
  where is_default;

create table public.customer_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  personalization_enabled boolean not null default false,
  in_account_reminders_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.customer_pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  species varchar(20) not null default 'dog',
  name varchar(40) not null,
  life_stage varchar(20) not null,
  puppy_stage varchar(20),
  size varchar(20),
  neuter_status varchar(30),
  body_condition varchar(30),
  activity_level varchar(30),
  weight_kg numeric(5,2) not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint customer_pets_supported_species check (species = 'dog'),
  constraint customer_pets_name_present check (char_length(trim(name)) between 1 and 40),
  constraint customer_pets_life_stage check (life_stage in ('adult', 'puppy')),
  constraint customer_pets_puppy_stage check (puppy_stage is null or puppy_stage in ('stage1', 'stage2', 'stage3')),
  constraint customer_pets_size check (size is null or size in ('small', 'medium', 'large')),
  constraint customer_pets_neuter_status check (neuter_status is null or neuter_status in ('castrated', 'notCastrated')),
  constraint customer_pets_body_condition check (body_condition is null or body_condition in ('underWeight', 'ideal', 'overWeight')),
  constraint customer_pets_activity check (activity_level is null or activity_level in ('sedentary', 'active', 'veryActive')),
  constraint customer_pets_weight_range check (weight_kg between 0.1 and 100),
  constraint customer_pets_required_adult_fields check (
    life_stage <> 'adult'
    or (size is not null and neuter_status is not null and body_condition is not null and activity_level is not null)
  ),
  constraint customer_pets_required_puppy_fields check (
    life_stage <> 'puppy' or puppy_stage is not null
  )
);

create index customer_pets_user_id_idx on public.customer_pets(user_id);
create unique index customer_pets_one_primary_idx
  on public.customer_pets(user_id)
  where is_primary;

create table public.customer_saved_carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(60) not null,
  schema_version smallint not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint customer_saved_carts_owner_key unique (id, user_id),
  constraint customer_saved_carts_name_present check (char_length(trim(name)) between 1 and 60),
  constraint customer_saved_carts_schema_version_positive check (schema_version > 0)
);

create index customer_saved_carts_user_id_idx
  on public.customer_saved_carts(user_id, created_at desc);

create table public.customer_saved_cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  cart_item_key varchar(240) not null,
  product_id varchar(180) not null,
  sku varchar(120),
  product_name_snapshot varchar(180) not null,
  presentation_snapshot varchar(120) not null default '',
  quantity smallint not null,
  unit_price_snapshot integer not null,
  currency char(3) not null default 'CRC',
  image_url text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  constraint customer_saved_cart_items_cart_owner_fk
    foreign key (cart_id, user_id)
    references public.customer_saved_carts(id, user_id)
    on delete cascade,
  constraint customer_saved_cart_items_key_present check (char_length(trim(cart_item_key)) between 1 and 240),
  constraint customer_saved_cart_items_product_present check (char_length(trim(product_id)) between 1 and 180),
  constraint customer_saved_cart_items_name_present check (char_length(trim(product_name_snapshot)) between 1 and 180),
  constraint customer_saved_cart_items_quantity check (quantity between 1 and 99),
  constraint customer_saved_cart_items_price check (unit_price_snapshot >= 0),
  constraint customer_saved_cart_items_currency check (currency = 'CRC'),
  constraint customer_saved_cart_items_image_length check (
    image_url is null or char_length(image_url) <= 1000
  ),
  constraint customer_saved_cart_items_order check (sort_order between 0 and 49)
);

create index customer_saved_cart_items_cart_id_idx
  on public.customer_saved_cart_items(cart_id, sort_order);
create index customer_saved_cart_items_user_id_idx
  on public.customer_saved_cart_items(user_id);

create trigger customer_profiles_set_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

create trigger customer_addresses_set_updated_at
before update on public.customer_addresses
for each row execute function public.set_updated_at();

create trigger customer_preferences_set_updated_at
before update on public.customer_preferences
for each row execute function public.set_updated_at();

create trigger customer_pets_set_updated_at
before update on public.customer_pets
for each row execute function public.set_updated_at();

create trigger customer_saved_carts_set_updated_at
before update on public.customer_saved_carts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  full_name text := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  first_name_value text := trim(coalesce(
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'given_name',
    split_part(full_name, ' ', 1),
    ''
  ));
  last_name_value text := trim(coalesce(
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'family_name',
    case
      when position(' ' in full_name) > 0 then substring(full_name from position(' ' in full_name) + 1)
      else ''
    end,
    ''
  ));
begin
  insert into public.customer_profiles (
    user_id,
    first_name,
    last_name,
    age_confirmed_at
  ) values (
    new.id,
    left(first_name_value, 80),
    left(last_name_value, 120),
    case
      when coalesce(new.raw_user_meta_data ->> 'age_confirmed', 'false') = 'true'
        then timezone('utc', now())
      else null
    end
  ) on conflict (user_id) do nothing;

  insert into public.customer_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_customer();

create or replace function public.enforce_customer_pet_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  existing_pet_count integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.user_id::text, 101)
  );

  select count(*) into existing_pet_count
  from public.customer_pets
  where user_id = new.user_id;

  if existing_pet_count >= 10 then
    raise exception 'pet_limit_reached' using errcode = 'P0001';
  end if;

  -- The first profile is always primary. Later inserts must use the dedicated
  -- RPC to change the primary pet, which keeps the unique invariant atomic.
  new.is_primary := existing_pet_count = 0;
  return new;
end;
$$;

create trigger customer_pets_enforce_limit
before insert on public.customer_pets
for each row execute function public.enforce_customer_pet_limit();

create or replace function public.enforce_customer_saved_cart_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.user_id::text, 102)
  );

  if (
    select count(*) >= 5
    from public.customer_saved_carts
    where user_id = new.user_id
  ) then
    raise exception 'saved_cart_limit_reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger customer_saved_carts_enforce_limit
before insert on public.customer_saved_carts
for each row execute function public.enforce_customer_saved_cart_limit();

create or replace function public.enforce_customer_saved_cart_item_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if new.cart_id is distinct from old.cart_id
      or new.user_id is distinct from old.user_id then
      raise exception 'saved_cart_item_move_not_allowed' using errcode = 'P0001';
    end if;
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.cart_id::text, 103)
  );

  if (
    select count(*) >= 50
    from public.customer_saved_cart_items
    where cart_id = new.cart_id and user_id = new.user_id
  ) then
    raise exception 'saved_cart_item_limit_reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger customer_saved_cart_items_enforce_limit
before insert or update of cart_id, user_id on public.customer_saved_cart_items
for each row execute function public.enforce_customer_saved_cart_item_limit();

create or replace function public.keep_one_default_customer_address()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_default then
    update public.customer_addresses
    set is_default = false
    where user_id = new.user_id
      and id <> new.id
      and is_default;
  end if;
  return new;
end;
$$;

create trigger customer_addresses_keep_one_default
before insert or update of is_default on public.customer_addresses
for each row execute function public.keep_one_default_customer_address();

alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.customer_preferences enable row level security;
alter table public.customer_pets enable row level security;
alter table public.customer_saved_carts enable row level security;
alter table public.customer_saved_cart_items enable row level security;

create policy "Customers can read their profile"
on public.customer_profiles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their profile"
on public.customer_profiles for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update their profile"
on public.customer_profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete their profile row"
on public.customer_profiles for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can read their addresses"
on public.customer_addresses for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their addresses"
on public.customer_addresses for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update their addresses"
on public.customer_addresses for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete their addresses"
on public.customer_addresses for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can read their preferences"
on public.customer_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their preferences"
on public.customer_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update their preferences"
on public.customer_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete their preferences"
on public.customer_preferences for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can read their pets"
on public.customer_pets for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their pets"
on public.customer_pets for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update their pets"
on public.customer_pets for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete their pets"
on public.customer_pets for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can read their saved carts"
on public.customer_saved_carts for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their saved carts"
on public.customer_saved_carts for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update their saved carts"
on public.customer_saved_carts for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete their saved carts"
on public.customer_saved_carts for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can read their saved cart items"
on public.customer_saved_cart_items for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their saved cart items"
on public.customer_saved_cart_items for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update their saved cart items"
on public.customer_saved_cart_items for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete their saved cart items"
on public.customer_saved_cart_items for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.customer_profiles from anon;
revoke all on public.customer_addresses from anon;
revoke all on public.customer_preferences from anon;
revoke all on public.customer_pets from anon;
revoke all on public.customer_saved_carts from anon;
revoke all on public.customer_saved_cart_items from anon;

grant select, insert, update, delete on public.customer_profiles to authenticated;
grant select, insert, update, delete on public.customer_addresses to authenticated;
grant select, insert, update, delete on public.customer_preferences to authenticated;
grant select, insert, update, delete on public.customer_pets to authenticated;
grant select, insert, update, delete on public.customer_saved_carts to authenticated;
grant select, insert, update, delete on public.customer_saved_cart_items to authenticated;

create or replace function public.set_primary_customer_pet(p_pet_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended((select auth.uid())::text, 101)
  );

  if not exists (
    select 1
    from public.customer_pets
    where id = p_pet_id and user_id = (select auth.uid())
  ) then
    raise exception 'pet_not_found' using errcode = 'P0002';
  end if;

  update public.customer_pets
  set is_primary = false
  where user_id = (select auth.uid()) and is_primary;

  update public.customer_pets
  set is_primary = true
  where id = p_pet_id and user_id = (select auth.uid());
end;
$$;

create or replace function public.delete_customer_pet(p_pet_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  deleted_was_primary boolean;
  next_pet_id uuid;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended((select auth.uid())::text, 101)
  );

  delete from public.customer_pets
  where id = p_pet_id and user_id = (select auth.uid())
  returning is_primary into deleted_was_primary;

  if not found then
    raise exception 'pet_not_found' using errcode = 'P0002';
  end if;

  if deleted_was_primary then
    select id into next_pet_id
    from public.customer_pets
    where user_id = (select auth.uid())
    order by created_at asc, id asc
    limit 1;

    if next_pet_id is not null then
      update public.customer_pets
      set is_primary = true
      where id = next_pet_id and user_id = (select auth.uid());
    end if;
  end if;

  return next_pet_id;
end;
$$;

create or replace function public.save_customer_cart(
  p_name text,
  p_items jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  new_cart_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication_required' using errcode = 'P0001';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(current_user_id::text, 102)
  );

  if char_length(trim(coalesce(p_name, ''))) not between 1 and 60 then
    raise exception 'invalid_cart_name' using errcode = 'P0001';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'invalid_cart_items' using errcode = 'P0001';
  end if;

  if jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'invalid_cart_items' using errcode = 'P0001';
  end if;

  delete from public.customer_saved_carts
  where id in (
    select id
    from public.customer_saved_carts
    where user_id = current_user_id
    order by created_at desc, id desc
    offset 4
  );

  insert into public.customer_saved_carts (user_id, name)
  values (current_user_id, trim(p_name))
  returning id into new_cart_id;

  insert into public.customer_saved_cart_items (
    cart_id,
    user_id,
    cart_item_key,
    product_id,
    sku,
    product_name_snapshot,
    presentation_snapshot,
    quantity,
    unit_price_snapshot,
    image_url,
    sort_order
  )
  select
    new_cart_id,
    current_user_id,
    left(trim(item ->> 'item_key'), 240),
    left(trim(item ->> 'product_id'), 180),
    nullif(left(trim(item ->> 'sku'), 120), ''),
    left(trim(item ->> 'product_name'), 180),
    left(trim(coalesce(item ->> 'presentation', '')), 120),
    (item ->> 'quantity')::smallint,
    (item ->> 'unit_price')::integer,
    nullif(item ->> 'image_url', ''),
    (ordinality - 1)::smallint
  from jsonb_array_elements(p_items) with ordinality as items(item, ordinality);

  return new_cart_id;
end;
$$;

-- PostgreSQL grants EXECUTE on new functions to PUBLIC by default. Trigger
-- helpers are internal-only; the three customer RPCs are callable solely by an
-- authenticated session and still execute under RLS as the caller.
revoke execute on function public.set_updated_at() from public;
revoke execute on function public.handle_new_customer() from public;
revoke execute on function public.enforce_customer_pet_limit() from public;
revoke execute on function public.enforce_customer_saved_cart_limit() from public;
revoke execute on function public.enforce_customer_saved_cart_item_limit() from public;
revoke execute on function public.keep_one_default_customer_address() from public;
revoke execute on function public.set_primary_customer_pet(uuid) from public;
revoke execute on function public.delete_customer_pet(uuid) from public;
revoke execute on function public.save_customer_cart(text, jsonb) from public;

grant execute on function public.set_primary_customer_pet(uuid) to authenticated;
grant execute on function public.delete_customer_pet(uuid) to authenticated;
grant execute on function public.save_customer_cart(text, jsonb) to authenticated;
