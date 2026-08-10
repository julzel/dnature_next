import 'server-only';

import { redirect } from 'next/navigation';

import {
  createClient,
  isSupabaseConfigured,
} from '../../services/supabase/server';
import {
  emptyAddress,
  mapAddress,
  mapPet,
  mapProfile,
  mapSavedCart,
} from './model/account-mappers';
import {
  safeNextPath,
  toCostaRicanLocalPhone,
} from './model/account-validation';

class AccountDataError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'AccountDataError';
    this.code = cause?.code || 'ACCOUNT_DATA_ERROR';
  }
}

const identityFromClaims = (claims) => ({
  id: claims.sub,
  email: typeof claims.email === 'string' ? claims.email : '',
  provider:
    claims.app_metadata?.provider ||
    claims.user_metadata?.provider ||
    'email',
});

const getAccountContext = async () => {
  if (!isSupabaseConfigured()) {
    return { configured: false, identity: null, supabase: null };
  }

  const supabase = await createClient();
  let claims;
  let error;

  try {
    const result = await supabase.auth.getClaims();
    claims = result.data.claims;
    error = result.error;
  } catch (authError) {
    console.warn('Unable to validate the Supabase session.', {
      name: authError?.name,
    });
    return { configured: true, identity: null, supabase };
  }

  if (error || !claims?.sub) {
    return { configured: true, identity: null, supabase };
  }

  return {
    configured: true,
    identity: identityFromClaims(claims),
    supabase,
  };
};

const requireAccountContext = async (nextPath = '/cuenta') => {
  const context = await getAccountContext();

  if (!context.configured || !context.identity) {
    redirect(
      `/cuenta/iniciar-sesion?siguiente=${encodeURIComponent(nextPath)}`
    );
  }

  return context;
};

const throwForQueryError = (result, resource) => {
  if (result.error) {
    throw new AccountDataError(
      `No se pudo cargar ${resource}. Confirmá que las migraciones de Supabase estén aplicadas.`,
      result.error
    );
  }

  return result.data;
};

const ensureCustomerRows = async ({ identity, supabase }) => {
  const profileResult = await supabase
    .from('customer_profiles')
    .select('user_id')
    .eq('user_id', identity.id)
    .maybeSingle();

  if (profileResult.error) {
    throwForQueryError(profileResult, 'el perfil');
  }

  if (!profileResult.data) {
    const profileInsert = await supabase.from('customer_profiles').insert({
      user_id: identity.id,
    });
    throwForQueryError(profileInsert, 'el perfil');
  }

  const preferencesResult = await supabase
    .from('customer_preferences')
    .select('user_id')
    .eq('user_id', identity.id)
    .maybeSingle();

  if (preferencesResult.error) {
    throwForQueryError(preferencesResult, 'las preferencias');
  }

  if (!preferencesResult.data) {
    const preferencesInsert = await supabase
      .from('customer_preferences')
      .insert({ user_id: identity.id });
    throwForQueryError(preferencesInsert, 'las preferencias');
  }
};

const loadCurrentAccount = async () => {
  const context = await requireAccountContext();
  const { identity, supabase } = context;
  await ensureCustomerRows(context);

  const [profileResult, addressesResult, preferencesResult, petsResult, cartsResult] =
    await Promise.all([
      supabase
        .from('customer_profiles')
        .select('first_name,last_name,phone,age_confirmed_at')
        .eq('user_id', identity.id)
        .single(),
      supabase
        .from('customer_addresses')
        .select(
          'id,label,province,canton,district,directions,delivery_notes,is_default,created_at'
        )
        .eq('user_id', identity.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true }),
      supabase
        .from('customer_preferences')
        .select('personalization_enabled,in_account_reminders_enabled')
        .eq('user_id', identity.id)
        .single(),
      supabase
        .from('customer_pets')
        .select(
          'id,name,life_stage,puppy_stage,size,neuter_status,body_condition,activity_level,weight_kg,created_at'
        )
        .eq('user_id', identity.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('customer_saved_carts')
        .select(
          'id,name,created_at,customer_saved_cart_items(id,cart_item_key,product_id,sku,product_name_snapshot,presentation_snapshot,quantity,unit_price_snapshot,image_url,sort_order)'
        )
        .eq('user_id', identity.id)
        .order('created_at', { ascending: false }),
    ]);

  const profileRow = throwForQueryError(profileResult, 'el perfil');
  const addressRows = throwForQueryError(addressesResult, 'las direcciones');
  const preferencesRow = throwForQueryError(
    preferencesResult,
    'las preferencias'
  );
  const petRows = throwForQueryError(petsResult, 'las mascotas');
  const cartRows = throwForQueryError(cartsResult, 'los carritos guardados');
  const address = addressRows[0] ? mapAddress(addressRows[0]) : emptyAddress;
  const portionPlanningEnabled =
    process.env.ACCOUNT_PORTION_PLANNING_ENABLED === 'true';
  const pets = petRows.map((row) => mapPet(row, portionPlanningEnabled));

  return {
    identity,
    profile: mapProfile(profileRow, identity, address),
    addresses: addressRows.map(mapAddress),
    preferences: {
      personalization: preferencesRow.personalization_enabled,
      inAccountReminders: preferencesRow.in_account_reminders_enabled,
    },
    pets,
    selectedPetId: pets[0]?.id || null,
    savedCarts: cartRows.map(mapSavedCart),
    featureFlags: {
      portionPlanning: portionPlanningEnabled,
      stage2: process.env.ACCOUNT_STAGE_2_ENABLED === 'true',
      personalization: false,
      reminders: false,
    },
  };
};

const loadOptionalCheckoutCustomer = async () => {
  const context = await getAccountContext();
  if (!context.identity) return null;

  const [profileResult, addressResult] = await Promise.all([
    context.supabase
      .from('customer_profiles')
      .select('first_name,last_name,phone')
      .eq('user_id', context.identity.id)
      .maybeSingle(),
    context.supabase
      .from('customer_addresses')
      .select('province,canton,directions,is_default,created_at')
      .eq('user_id', context.identity.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileResult.error || addressResult.error || !profileResult.data) {
    return null;
  }

  const profile = profileResult.data;
  const address = addressResult.data;

  return {
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: context.identity.email,
    contactPhoneNumber: toCostaRicanLocalPhone(profile.phone),
    address: {
      provincia: address?.province || '',
      canton: address?.canton || '',
      direccion: address?.directions || '',
    },
    pets: [],
  };
};

export {
  AccountDataError,
  getAccountContext,
  loadCurrentAccount,
  loadOptionalCheckoutCustomer,
  requireAccountContext,
  safeNextPath,
};
