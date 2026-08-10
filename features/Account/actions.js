'use server';

import { revalidatePath } from 'next/cache';

import { getProducts } from '../Catalog/server';
import { getAccountContext } from './server';
import {
  mapAddress,
  mapPet,
  mapProfile,
} from './model/account-mappers';
import {
  normalizeAddressInput,
  normalizeCartInput,
  normalizePetInput,
  normalizeProfileInput,
} from './model/account-validation';

const AUTH_REQUIRED = {
  ok: false,
  message: 'Tu sesión venció. Iniciá sesión nuevamente.',
  code: 'AUTH_REQUIRED',
};

const actionContext = async () => {
  const context = await getAccountContext();
  return context.configured && context.identity ? context : null;
};

const databaseError = (message, error) => {
  console.error(message, {
    code: error?.code,
    name: error?.name,
  });
  return {
    ok: false,
    message: 'No pudimos guardar los cambios. Intentá nuevamente.',
    code: 'DATABASE_ERROR',
  };
};

const updateProfileAction = async (input) => {
  const normalized = normalizeProfileInput(input);
  if (normalized.error) return { ok: false, message: normalized.error };

  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;

  const { data, error } = await context.supabase
    .from('customer_profiles')
    .update(normalized.data)
    .eq('user_id', context.identity.id)
    .select('first_name,last_name,phone,age_confirmed_at')
    .single();

  if (error) return databaseError('Error updating customer profile', error);

  revalidatePath('/cuenta', 'layout');
  return {
    ok: true,
    message: 'Tus datos se guardaron.',
    profile: mapProfile(data, context.identity),
  };
};

const saveAddressAction = async (input) => {
  const normalized = normalizeAddressInput(input);
  if (normalized.error) return { ok: false, message: normalized.error };

  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;

  const payload = { ...normalized.data, user_id: context.identity.id };
  const { id: addressId, ...addressValues } = payload;
  const query = addressId
    ? context.supabase
        .from('customer_addresses')
        .update(addressValues)
        .eq('id', addressId)
        .eq('user_id', context.identity.id)
    : context.supabase.from('customer_addresses').insert(payload);
  const { data, error } = await query
    .select(
      'id,label,province,canton,district,directions,delivery_notes,is_default,created_at'
    )
    .single();

  if (error) return databaseError('Error saving customer address', error);

  revalidatePath('/cuenta', 'layout');
  return {
    ok: true,
    message: 'Tu dirección se guardó.',
    address: mapAddress(data),
  };
};

const confirmAgeAction = async () => {
  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;

  const { error } = await context.supabase
    .from('customer_profiles')
    .update({ age_confirmed_at: new Date().toISOString() })
    .eq('user_id', context.identity.id);

  if (error) return databaseError('Error confirming customer age', error);

  revalidatePath('/cuenta', 'layout');
  return { ok: true, message: 'Edad confirmada.' };
};

const savePetAction = async (input) => {
  const normalized = normalizePetInput(input);
  if (normalized.error) return { ok: false, message: normalized.error };

  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;
  const { identity, supabase } = context;
  const payload = { ...normalized.data, user_id: identity.id };
  const { id: petId, ...petValues } = payload;

  const query = petId
    ? supabase
        .from('customer_pets')
        .update(petValues)
        .eq('id', petId)
        .eq('user_id', identity.id)
    : supabase
        .from('customer_pets')
        .insert(payload);
  const { data, error } = await query
    .select(
      'id,name,life_stage,puppy_stage,size,neuter_status,body_condition,activity_level,weight_kg,created_at'
    )
    .single();

  if (error?.message?.includes('pet_limit_reached')) {
    return { ok: false, message: 'Podés guardar hasta 10 mascotas.' };
  }
  if (error) return databaseError('Error saving customer pet', error);

  revalidatePath('/cuenta', 'layout');
  return {
    ok: true,
    message: petId
      ? 'Los cambios se guardaron.'
      : `${data.name} se agregó a tu cuenta.`,
    pet: mapPet(
      data,
      process.env.ACCOUNT_PORTION_PLANNING_ENABLED === 'true'
    ),
  };
};

const deletePetAction = async (petId) => {
  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;
  const { data, error } = await context.supabase
    .from('customer_pets')
    .delete()
    .eq('id', petId)
    .eq('user_id', context.identity.id)
    .select('id')
    .maybeSingle();

  if (error) return databaseError('Error deleting customer pet', error);
  if (!data) return { ok: false, message: 'No encontramos esa mascota.' };

  revalidatePath('/cuenta', 'layout');
  return {
    ok: true,
    message: 'El perfil de la mascota se eliminó.',
  };
};

const saveCartAction = async (cart, label) => {
  const normalized = normalizeCartInput(cart, label);
  if (normalized.error) return { ok: false, message: normalized.error };

  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;
  const { data: cartId, error } = await context.supabase.rpc(
    'save_customer_cart',
    {
      p_name: normalized.data.name,
      p_items: normalized.data.items,
    }
  );

  if (error) return databaseError('Error saving customer cart', error);

  revalidatePath('/cuenta', 'layout');
  return {
    ok: true,
    message: 'Tu carrito se guardó.',
    cart: {
      id: cartId,
      label: normalized.data.name,
      savedAt: new Date().toISOString(),
      items: normalized.data.items.map((item, index) => ({
        id: item.item_key,
        databaseId: `pending-${cartId}-${index}`,
        catalogProductId: item.product_id,
        sku: item.sku || undefined,
        productName: item.product_name,
        presentation: item.presentation,
        quantity: item.quantity,
        price: item.unit_price,
        ...(item.image_url ? { image: item.image_url } : {}),
      })),
    },
  };
};

const deleteSavedCartAction = async (cartId) => {
  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;

  const { data, error } = await context.supabase
    .from('customer_saved_carts')
    .delete()
    .eq('id', cartId)
    .eq('user_id', context.identity.id)
    .select('id')
    .maybeSingle();

  if (error) return databaseError('Error deleting saved customer cart', error);
  if (!data) return { ok: false, message: 'No encontramos ese carrito.' };

  revalidatePath('/cuenta', 'layout');
  return { ok: true, message: 'El carrito guardado se eliminó.' };
};

const restoreSavedCartAction = async (cartId) => {
  const context = await actionContext();
  if (!context) return AUTH_REQUIRED;

  const { data, error } = await context.supabase
    .from('customer_saved_carts')
    .select(
      'id,name,customer_saved_cart_items(id,cart_item_key,product_id,sku,product_name_snapshot,presentation_snapshot,quantity,unit_price_snapshot,image_url,sort_order)'
    )
    .eq('id', cartId)
    .eq('user_id', context.identity.id)
    .single();

  if (error) return databaseError('Error reading cart for restoration', error);

  try {
    const catalog = await getProducts();
    const products = Object.values(catalog || {}).flatMap(
      (category) => category.products || []
    );
    const byId = new Map(
      products.map((product) => [String(product.sys?.id || ''), product])
    );
    const bySku = new Map(
      products
        .filter((product) => product.avifySku)
        .map((product) => [String(product.avifySku).trim(), product])
    );
    const sortedItems = (data.customer_saved_cart_items || [])
      .slice()
      .sort((left, right) => left.sort_order - right.sort_order);
    let removedCount = 0;
    let updatedPriceCount = 0;

    const items = sortedItems.flatMap((item) => {
      const product = byId.get(item.product_id) || bySku.get(item.sku);
      if (!product) {
        removedCount += 1;
        return [];
      }

      const presentation = item.presentation_snapshot || '';
      const presentationPrices = product.preciosPorUnidad || null;
      const currentPrice = presentationPrices
        ? Number(presentationPrices[presentation])
        : Number(product.precio);

      if (!Number.isFinite(currentPrice) || currentPrice < 0) {
        removedCount += 1;
        return [];
      }

      if (currentPrice !== item.unit_price_snapshot) updatedPriceCount += 1;

      return [
        {
          id: item.cart_item_key,
          catalogProductId: product.sys.id,
          sku: product.avifySku || item.sku || undefined,
          productName: presentationPrices
            ? `${product.productName} ${presentation}`.trim()
            : product.productName,
          presentation: presentation || product.medida || '',
          quantity: item.quantity,
          price: currentPrice,
          ...(product.images?.[0]?.url
            ? { image: product.images[0].url }
            : {}),
        },
      ];
    });

    if (!items.length) {
      return {
        ok: false,
        message:
          'Los productos de este carrito ya no aparecen en el catálogo. Armá una selección nueva.',
      };
    }

    const changes = [
      removedCount
        ? `${removedCount} ${removedCount === 1 ? 'producto no disponible fue omitido' : 'productos no disponibles fueron omitidos'}`
        : '',
      updatedPriceCount
        ? `${updatedPriceCount} ${updatedPriceCount === 1 ? 'precio fue actualizado' : 'precios fueron actualizados'}`
        : '',
    ].filter(Boolean);

    return {
      ok: true,
      cart: { items },
      message: changes.length
        ? `Carrito actualizado: ${changes.join(' y ')}.`
        : 'El carrito está actualizado y listo para revisar.',
    };
  } catch (catalogError) {
    console.error('Error reconciling saved cart with catalog', {
      name: catalogError?.name,
    });
    return {
      ok: false,
      message:
        'No pudimos comprobar los productos y precios actuales. Intentá nuevamente.',
    };
  }
};

export {
  confirmAgeAction,
  deletePetAction,
  deleteSavedCartAction,
  saveAddressAction,
  saveCartAction,
  savePetAction,
  restoreSavedCartAction,
  updateProfileAction,
};
