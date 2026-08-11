import {
  MAX_PET_WEIGHT_KG,
  MIN_PET_WEIGHT_KG,
} from '../../../util/portion-size';
import { COSTA_RICA_PROVINCES } from '../../../constants/costa-rica';

const MAX_PETS = 10;
const MAX_SAVED_CARTS = 5;
const MAX_CART_ITEMS = 50;

const cleanString = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const toCostaRicanLocalPhone = (value) => {
  const phone = cleanString(value, 32);
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('506')) {
    return digits.slice(3);
  }

  return digits.length === 8 ? digits : phone;
};

const safeNextPath = (value, fallback = '/cuenta') => {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return fallback;
  }

  const pathname = value.split(/[?#]/, 1)[0];
  const allowedDestination =
    pathname === '/cuenta' ||
    (pathname.startsWith('/cuenta/') &&
      !pathname.startsWith('/cuenta/iniciar-sesion')) ||
    pathname === '/checkout';

  if (!allowedDestination) return fallback;

  return value;
};

const normalizeProfileInput = (input = {}) => {
  const firstName = cleanString(input.firstName, 80);
  const lastName = cleanString(input.lastName, 120);
  const phone = cleanString(input.phone, 32);
  const phoneDigits = phone.replace(/\D/g, '');

  if (!firstName) {
    return { error: 'Ingresá tu nombre.' };
  }

  if (phone && ![8, 11].includes(phoneDigits.length)) {
    return { error: 'Ingresá un teléfono de Costa Rica válido.' };
  }

  if (phoneDigits.length === 11 && !phoneDigits.startsWith('506')) {
    return { error: 'Ingresá un teléfono de Costa Rica válido.' };
  }

  return {
    data: {
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
    },
  };
};

const normalizeAddressInput = (input = {}) => {
  const id = cleanString(input.id, 80);
  const label = cleanString(input.label, 60) || 'Principal';
  const province = cleanString(input.province, 80);
  const canton = cleanString(input.canton, 100);
  const district = cleanString(input.district, 100);
  const directions = cleanString(input.address || input.directions, 500);
  const deliveryNotes = cleanString(input.deliveryNotes, 300);

  if (!COSTA_RICA_PROVINCES.includes(province)) {
    return { error: 'Seleccioná una provincia de Costa Rica.' };
  }

  if (!canton) {
    return { error: 'Ingresá el cantón.' };
  }

  if (!directions) {
    return { error: 'Ingresá las señas de la dirección.' };
  }

  return {
    data: {
      ...(id ? { id } : {}),
      label,
      province,
      canton,
      district,
      directions,
      delivery_notes: deliveryNotes,
      is_default: true,
    },
  };
};

const PET_VALUES = {
  age: ['adult', 'puppy'],
  puppyStage: ['stage1', 'stage2', 'stage3'],
  size: ['small', 'medium', 'large'],
  castrated: ['castrated', 'notCastrated'],
  bodyContexture: ['underWeight', 'ideal', 'overWeight'],
  dailyActivity: ['sedentary', 'active', 'veryActive'],
};

const normalizePetInput = (input = {}) => {
  const id = cleanString(input.id, 80);
  const name = cleanString(input.name, 40);
  const age = PET_VALUES.age.includes(input.age) ? input.age : 'adult';
  const weight = Number(input.weight);

  if (!name) {
    return { error: 'Escribí el nombre de tu mascota.' };
  }

  if (
    !Number.isFinite(weight) ||
    weight < MIN_PET_WEIGHT_KG ||
    weight > MAX_PET_WEIGHT_KG
  ) {
    return {
      error: `Ingresá un peso entre ${MIN_PET_WEIGHT_KG} kg y ${MAX_PET_WEIGHT_KG} kg.`,
    };
  }

  const normalized = {
    age,
    bodyContexture: PET_VALUES.bodyContexture.includes(input.bodyContexture)
      ? input.bodyContexture
      : 'ideal',
    castrated: PET_VALUES.castrated.includes(input.castrated)
      ? input.castrated
      : 'castrated',
    dailyActivity: PET_VALUES.dailyActivity.includes(input.dailyActivity)
      ? input.dailyActivity
      : 'active',
    puppyStage: PET_VALUES.puppyStage.includes(input.puppyStage)
      ? input.puppyStage
      : 'stage1',
    size: PET_VALUES.size.includes(input.size) ? input.size : 'medium',
    weight,
  };

  return {
    data: {
      ...(id ? { id } : {}),
      species: 'dog',
      name,
      life_stage: age,
      puppy_stage: age === 'puppy' ? normalized.puppyStage : null,
      size: age === 'adult' ? normalized.size : null,
      neuter_status: age === 'adult' ? normalized.castrated : null,
      body_condition: age === 'adult' ? normalized.bodyContexture : null,
      activity_level: age === 'adult' ? normalized.dailyActivity : null,
      weight_kg: weight,
    },
  };
};

const normalizeCartInput = (cart, label) => {
  const name = cleanString(label, 60) || 'Mi compra frecuente';
  const sourceItems = Array.isArray(cart?.items) ? cart.items : [];

  if (!sourceItems.length) {
    return { error: 'Agregá al menos un producto antes de guardar el carrito.' };
  }

  if (sourceItems.length > MAX_CART_ITEMS) {
    return { error: `El carrito admite hasta ${MAX_CART_ITEMS} productos.` };
  }

  const items = sourceItems.map((item) => {
    const productId = cleanString(item?.id, 180);
    const productName = cleanString(item?.productName, 180);
    const presentation = cleanString(item?.presentation, 120);
    const sku = cleanString(
      item?.parentSku || item?.sku || item?.avifySku,
      120
    );
    const imageUrl = cleanString(item?.image, 1000);
    const quantity = Number(item?.quantity);
    const unitPrice = Number(item?.price);

    if (
      !productId ||
      !productName ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99 ||
      !Number.isInteger(unitPrice) ||
      unitPrice < 0
    ) {
      return null;
    }

    return {
      item_key: productId,
      product_id: cleanString(item?.catalogProductId, 180) || productId,
      sku: sku || null,
      product_name: productName,
      presentation,
      quantity,
      unit_price: unitPrice,
      image_url: imageUrl || null,
    };
  });

  if (items.some((item) => !item)) {
    return {
      error:
        'Uno de los productos no se puede guardar. Revisá el carrito e intentá nuevamente.',
    };
  }

  return { data: { items, name } };
};

export {
  COSTA_RICA_PROVINCES,
  MAX_CART_ITEMS,
  MAX_PETS,
  MAX_SAVED_CARTS,
  normalizeAddressInput,
  normalizeCartInput,
  normalizePetInput,
  normalizeProfileInput,
  safeNextPath,
  toCostaRicanLocalPhone,
};
