begin;

create extension if not exists pgtap with schema extensions;

select extensions.plan(32);

-- Fixed identities keep the assertions readable. Everything in this file is
-- rolled back, including the auth users and the rows created by their trigger.
insert into auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'rls-a@dnature.test',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Ana","last_name":"Prueba","age_confirmed":true}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'rls-b@dnature.test',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Bruno","last_name":"Prueba","age_confirmed":true}'::jsonb
  );

insert into public.customer_addresses (
  id,
  user_id,
  label,
  province,
  canton,
  directions,
  is_default
)
values
  (
    'aa000001-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'Casa A',
    'San José',
    'Tibás',
    'Dirección privada de A',
    true
  ),
  (
    'bb000001-0000-4000-8000-000000000001',
    '22222222-2222-4222-8222-222222222222',
    'Casa B',
    'Heredia',
    'Heredia',
    'Dirección privada de B',
    true
  );

insert into public.customer_pets (
  id,
  user_id,
  name,
  life_stage,
  size,
  neuter_status,
  body_condition,
  activity_level,
  weight_kg
)
values
  (
    'a1000001-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'Alfa',
    'adult',
    'medium',
    'castrated',
    'ideal',
    'active',
    12.5
  ),
  (
    'a1000002-0000-4000-8000-000000000002',
    '11111111-1111-4111-8111-111111111111',
    'Atenea',
    'adult',
    'small',
    'notCastrated',
    'ideal',
    'active',
    7.25
  ),
  (
    'b2000001-0000-4000-8000-000000000001',
    '22222222-2222-4222-8222-222222222222',
    'Beta',
    'adult',
    'large',
    'castrated',
    'ideal',
    'sedentary',
    28
  );

insert into public.customer_saved_carts (id, user_id, name)
values
  (
    'ca000001-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'Carrito privado A'
  ),
  (
    'cb000001-0000-4000-8000-000000000001',
    '22222222-2222-4222-8222-222222222222',
    'Carrito privado B'
  );

insert into public.customer_saved_cart_items (
  id,
  cart_id,
  user_id,
  cart_item_key,
  product_id,
  product_name_snapshot,
  quantity,
  unit_price_snapshot
)
values
  (
    'da000001-0000-4000-8000-000000000001',
    'ca000001-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'item-a',
    'product-a',
    'Producto privado A',
    1,
    4000
  ),
  (
    'db000001-0000-4000-8000-000000000001',
    'cb000001-0000-4000-8000-000000000001',
    '22222222-2222-4222-8222-222222222222',
    'item-b',
    'product-b',
    'Producto privado B',
    1,
    5000
  );

select extensions.is(
  (select count(*)::integer from public.customer_profiles),
  2,
  'the auth trigger creates one profile per customer'
);
select extensions.is(
  (select count(*)::integer from public.customer_preferences),
  2,
  'the auth trigger creates one preference row per customer'
);
select extensions.ok(
  exists (
    select 1
    from public.customer_profiles
    where user_id = '11111111-1111-4111-8111-111111111111'
      and first_name = 'Ana'
      and last_name = 'Prueba'
      and age_confirmed_at is not null
  ),
  'the auth trigger maps trusted signup metadata'
);

select extensions.ok(
  not exists (
    select 1
    from (
      values
        ('public.customer_profiles'),
        ('public.customer_addresses'),
        ('public.customer_preferences'),
        ('public.customer_pets'),
        ('public.customer_saved_carts'),
        ('public.customer_saved_cart_items')
    ) as relations(name)
    where pg_catalog.has_table_privilege('anon', name, 'SELECT')
      or pg_catalog.has_table_privilege('anon', name, 'INSERT')
      or pg_catalog.has_table_privilege('anon', name, 'UPDATE')
      or pg_catalog.has_table_privilege('anon', name, 'DELETE')
  ),
  'anon has no CRUD privileges on customer data'
);
select extensions.ok(
  not pg_catalog.has_function_privilege(
    'anon',
    'public.save_customer_cart(text,jsonb)',
    'EXECUTE'
  ),
  'anon cannot call the saved-cart RPC'
);
select extensions.ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.save_customer_cart(text,jsonb)',
    'EXECUTE'
  ),
  'authenticated can call the saved-cart RPC'
);
select extensions.ok(
  not pg_catalog.has_function_privilege(
    'authenticated',
    'public.handle_new_customer()',
    'EXECUTE'
  ),
  'authenticated cannot invoke the internal auth trigger helper'
);

-- Authenticate as customer A. Setting both GUC shapes keeps this test valid
-- across the Supabase auth.uid() implementations used by local CLI releases.
select pg_catalog.set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  true
);
select pg_catalog.set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);
set local role authenticated;

select extensions.is(
  auth.uid(),
  '11111111-1111-4111-8111-111111111111'::uuid,
  'the test harness authenticates as customer A'
);
select extensions.is(
  (select count(*)::integer from public.customer_profiles),
  1,
  'customer A sees only their profile'
);
select extensions.is(
  (select count(*)::integer from public.customer_addresses),
  1,
  'customer A sees only their address'
);
select extensions.is(
  (select count(*)::integer from public.customer_preferences),
  1,
  'customer A sees only their preferences'
);
select extensions.is(
  (select count(*)::integer from public.customer_pets),
  2,
  'customer A sees only their pets'
);
select extensions.is(
  (select count(*)::integer from public.customer_saved_carts),
  1,
  'customer A sees only their saved cart'
);
select extensions.is(
  (select count(*)::integer from public.customer_saved_cart_items),
  1,
  'customer A sees only their saved-cart items'
);

select extensions.lives_ok(
  $sql$
    insert into public.customer_addresses (
      user_id,
      label,
      province,
      canton,
      directions,
      is_default
    ) values (
      '11111111-1111-4111-8111-111111111111',
      'Trabajo A',
      'San José',
      'San José',
      'Segunda dirección de A',
      false
    )
  $sql$,
  'customer A can insert an address they own'
);
select extensions.throws_ok(
  $sql$
    insert into public.customer_addresses (
      user_id,
      label,
      province,
      canton,
      directions,
      is_default
    ) values (
      '22222222-2222-4222-8222-222222222222',
      'Intrusión',
      'Heredia',
      'Heredia',
      'No debe guardarse',
      false
    )
  $sql$,
  '42501',
  'new row violates row-level security policy for table "customer_addresses"',
  'customer A cannot insert an address for customer B'
);
select extensions.is_empty(
  $sql$
    update public.customer_pets
    set name = 'Nombre alterado'
    where id = 'b2000001-0000-4000-8000-000000000001'
    returning id
  $sql$,
  'customer A cannot update a pet owned by customer B'
);
select extensions.is_empty(
  $sql$
    delete from public.customer_saved_carts
    where id = 'cb000001-0000-4000-8000-000000000001'
    returning id
  $sql$,
  'customer A cannot delete a cart owned by customer B'
);
select extensions.throws_ok(
  $sql$
    update public.customer_pets
    set user_id = '22222222-2222-4222-8222-222222222222'
    where id = 'a1000001-0000-4000-8000-000000000001'
  $sql$,
  '42501',
  'new row violates row-level security policy for table "customer_pets"',
  'customer A cannot transfer one of their pets to customer B'
);
select extensions.throws_ok(
  $sql$
    insert into public.customer_saved_cart_items (
      cart_id,
      user_id,
      cart_item_key,
      product_id,
      product_name_snapshot,
      quantity,
      unit_price_snapshot
    ) values (
      'cb000001-0000-4000-8000-000000000001',
      '11111111-1111-4111-8111-111111111111',
      'forged-item',
      'forged-product',
      'No debe guardarse',
      1,
      1
    )
  $sql$,
  '23503',
  'insert or update on table "customer_saved_cart_items" violates foreign key constraint "customer_saved_cart_items_cart_owner_fk"',
  'the composite foreign key blocks attaching an owned item to another customer cart'
);
select extensions.lives_ok(
  $sql$
    select public.save_customer_cart(
      'Carrito A por RPC',
      '[{
        "item_key":"rpc-item-a",
        "product_id":"rpc-product-a",
        "sku":"RPC-A",
        "product_name":"Producto RPC A",
        "presentation":"1 kg",
        "quantity":2,
        "unit_price":6500,
        "image_url":null
      }]'::jsonb
    )
  $sql$,
  'customer A can save a valid cart through the RPC'
);
select extensions.ok(
  exists (
    select 1
    from public.customer_saved_carts as carts
    join public.customer_saved_cart_items as items
      on items.cart_id = carts.id and items.user_id = carts.user_id
    where carts.user_id = auth.uid()
      and carts.name = 'Carrito A por RPC'
      and items.product_id = 'rpc-product-a'
  ),
  'the saved-cart RPC assigns both parent and item rows to customer A'
);
select extensions.throws_ok(
  $sql$
    update public.customer_saved_cart_items
    set cart_id = (
      select id
      from public.customer_saved_carts
      where name = 'Carrito A por RPC'
    )
    where id = 'da000001-0000-4000-8000-000000000001'
  $sql$,
  'P0001',
  'saved_cart_item_move_not_allowed',
  'an existing item cannot be moved to bypass the per-cart item limit'
);
select extensions.throws_ok(
  $sql$
    select public.save_customer_cart('Carrito inválido', null)
  $sql$,
  'P0001',
  'invalid_cart_items',
  'the saved-cart RPC rejects SQL NULL item input'
);
select extensions.throws_ok(
  $sql$
    select public.save_customer_cart('Carrito inválido', '{}'::jsonb)
  $sql$,
  'P0001',
  'invalid_cart_items',
  'the saved-cart RPC rejects non-array JSON without evaluating array length'
);
select extensions.lives_ok(
  $sql$
    delete from public.customer_pets
    where id = 'a1000002-0000-4000-8000-000000000002'
  $sql$,
  'customer A can delete one of their own pet profiles'
);
select extensions.ok(
  (
    select count(*) = 1
      and bool_and(id = 'a1000001-0000-4000-8000-000000000001')
    from public.customer_pets
  ),
  'deleting one pet does not alter the remaining peer profile'
);

reset role;

-- Customer B must still see their original rows after every attempted A-side
-- read and mutation above.
select pg_catalog.set_config(
  'request.jwt.claim.sub',
  '22222222-2222-4222-8222-222222222222',
  true
);
select pg_catalog.set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);
set local role authenticated;

select extensions.is(
  auth.uid(),
  '22222222-2222-4222-8222-222222222222'::uuid,
  'the test harness switches to customer B'
);
select extensions.is(
  (select count(*)::integer from public.customer_profiles),
  1,
  'customer B sees only their profile'
);
select extensions.ok(
  exists (
    select 1
    from public.customer_pets
    where id = 'b2000001-0000-4000-8000-000000000001'
      and name = 'Beta'
  ),
  'customer B pet remains private and unchanged'
);
select extensions.ok(
  exists (
    select 1
    from public.customer_saved_carts as carts
    join public.customer_saved_cart_items as items
      on items.cart_id = carts.id and items.user_id = carts.user_id
    where carts.id = 'cb000001-0000-4000-8000-000000000001'
      and items.id = 'db000001-0000-4000-8000-000000000001'
  ),
  'customer B saved cart and items remain private and unchanged'
);
select extensions.is_empty(
  $sql$
    delete from public.customer_pets
    where id = 'a1000001-0000-4000-8000-000000000001'
    returning id
  $sql$,
  'customer B cannot delete customer A pet profile'
);

reset role;

select * from extensions.finish();
rollback;
