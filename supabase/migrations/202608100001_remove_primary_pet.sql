-- Pet profiles are intentionally peers. Choosing a pet in the dashboard is
-- transient UI state and must not create a persisted hierarchy between pets.

drop function if exists public.set_primary_customer_pet(uuid);
drop function if exists public.delete_customer_pet(uuid);

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

  return new;
end;
$$;

drop index if exists public.customer_pets_one_primary_idx;

alter table public.customer_pets
drop column if exists is_primary;
