import { calculatePortionSizeInGrams } from '../../../util/portion-size';

const emptyAddress = {
  id: '',
  label: 'Principal',
  province: '',
  canton: '',
  district: '',
  address: '',
  deliveryNotes: '',
};

const mapProfile = (row, identity, address) => ({
  firstName: row?.first_name || '',
  lastName: row?.last_name || '',
  email: identity.email || '',
  phone: row?.phone || '',
  ageConfirmed: Boolean(row?.age_confirmed_at),
  ...address,
});

const mapAddress = (row) =>
  row
    ? {
        id: row.id,
        label: row.label,
        province: row.province,
        canton: row.canton,
        district: row.district || '',
        address: row.directions,
        deliveryNotes: row.delivery_notes || '',
      }
    : { ...emptyAddress };

const mapPet = (row, portionPlanningEnabled) => {
  const pet = {
    id: row.id,
    name: row.name,
    age: row.life_stage,
    puppyStage: row.puppy_stage || 'stage1',
    size: row.size || 'medium',
    castrated: row.neuter_status || 'castrated',
    bodyContexture: row.body_condition || 'ideal',
    dailyActivity: row.activity_level || 'active',
    weight: Number(row.weight_kg),
  };

  return {
    ...pet,
    portionSize: portionPlanningEnabled
      ? calculatePortionSizeInGrams(pet)
      : null,
  };
};

const mapSavedCartItem = (row) => ({
  id: row.cart_item_key,
  databaseId: row.id,
  catalogProductId: row.product_id,
  sku: row.sku || undefined,
  productName: row.product_name_snapshot,
  presentation: row.presentation_snapshot || '',
  quantity: row.quantity,
  price: row.unit_price_snapshot,
  ...(row.image_url ? { image: row.image_url } : {}),
});

const mapSavedCart = (row) => ({
  id: row.id,
  label: row.name,
  savedAt: row.created_at,
  items: (row.customer_saved_cart_items || [])
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .map(mapSavedCartItem),
});

export { emptyAddress, mapAddress, mapPet, mapProfile, mapSavedCart };
