begin;

create extension if not exists pgtap with schema extensions;

select plan(20);

select has_table('public', 'customer_profiles', 'customer_profiles exists');
select has_table('public', 'customer_addresses', 'customer_addresses exists');
select has_table('public', 'customer_preferences', 'customer_preferences exists');
select has_table('public', 'customer_pets', 'customer_pets exists');
select has_table('public', 'customer_saved_carts', 'customer_saved_carts exists');
select has_table('public', 'customer_saved_cart_items', 'customer_saved_cart_items exists');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.customer_profiles'::regclass),
  'RLS is enabled on customer_profiles'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.customer_addresses'::regclass),
  'RLS is enabled on customer_addresses'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.customer_preferences'::regclass),
  'RLS is enabled on customer_preferences'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.customer_pets'::regclass),
  'RLS is enabled on customer_pets'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.customer_saved_carts'::regclass),
  'RLS is enabled on customer_saved_carts'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.customer_saved_cart_items'::regclass),
  'RLS is enabled on customer_saved_cart_items'
);

select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'customer_profiles'),
  4,
  'customer_profiles has operation-specific policies'
);
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'customer_addresses'),
  4,
  'customer_addresses has operation-specific policies'
);
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'customer_preferences'),
  4,
  'customer_preferences has operation-specific policies'
);
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'customer_pets'),
  4,
  'customer_pets has operation-specific policies'
);
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'customer_saved_carts'),
  4,
  'customer_saved_carts has operation-specific policies'
);
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'customer_saved_cart_items'),
  4,
  'customer_saved_cart_items has operation-specific policies'
);

select hasnt_column(
  'public',
  'customer_pets',
  'is_primary',
  'pet profiles do not persist a primary designation'
);
select has_function(
  'public',
  'save_customer_cart',
  array['text', 'jsonb'],
  'transactional saved-cart mutation exists'
);

select * from finish();
rollback;
