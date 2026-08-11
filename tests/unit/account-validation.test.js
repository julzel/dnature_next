import { describe, expect, it } from 'vitest';

import {
  normalizeAddressInput,
  normalizeCartInput,
  normalizePetInput,
  normalizeProfileInput,
  safeNextPath,
  toCostaRicanLocalPhone,
} from '../../features/Account/model/account-validation';

describe('customer account input boundaries', () => {
  it('accepts only relative in-app return paths', () => {
    expect(safeNextPath('/cuenta/mascotas?desde=acceso')).toBe(
      '/cuenta/mascotas?desde=acceso'
    );
    expect(safeNextPath('https://evil.example/path')).toBe('/cuenta');
    expect(safeNextPath('//evil.example/path')).toBe('/cuenta');
    expect(safeNextPath('/\\evil.example')).toBe('/cuenta');
    expect(safeNextPath('/cuenta/iniciar-sesion')).toBe('/cuenta');
    expect(safeNextPath('/cuenta/iniciar-sesion/otra-ruta')).toBe('/cuenta');
    expect(safeNextPath('/productos')).toBe('/cuenta');
    expect(safeNextPath('/checkout')).toBe('/checkout');
  });

  it('normalizes a minimal customer profile without accepting foreign fields', () => {
    expect(
      normalizeProfileInput({
        firstName: '  Ana  ',
        lastName: ' Vargas ',
        phone: '8888-8888',
        role: 'admin',
      })
    ).toEqual({
      data: {
        first_name: 'Ana',
        last_name: 'Vargas',
        phone: '8888-8888',
      },
    });
  });

  it('rejects a non-Costa-Rican phone number', () => {
    expect(
      normalizeProfileInput({ firstName: 'Ana', phone: '+1 212 555 0100' })
        .error
    ).toMatch(/Costa Rica/);
  });

  it('maps a +506 profile phone to the existing checkout format', () => {
    expect(toCostaRicanLocalPhone('+506 8888-8888')).toBe('88888888');
    expect(toCostaRicanLocalPhone('8888-8888')).toBe('88888888');
  });

  it('requires an approved Costa Rican province and usable directions', () => {
    expect(
      normalizeAddressInput({
        province: 'California',
        canton: 'San José',
        address: 'Una dirección',
      }).error
    ).toMatch(/provincia/);

    expect(
      normalizeAddressInput({
        province: 'San José',
        canton: 'Tibás',
        district: 'Colima',
        address: 'Del parque 200 m norte',
      }).data
    ).toMatchObject({
      province: 'San José',
      canton: 'Tibás',
      district: 'Colima',
      directions: 'Del parque 200 m norte',
      is_default: true,
    });
  });

  it('maps adult and puppy pet inputs to the database contract', () => {
    expect(
      normalizePetInput({
        name: ' Luna ',
        age: 'adult',
        size: 'medium',
        castrated: 'castrated',
        bodyContexture: 'ideal',
        dailyActivity: 'active',
        weight: '18.2',
      }).data
    ).toMatchObject({
      name: 'Luna',
      life_stage: 'adult',
      puppy_stage: null,
      weight_kg: 18.2,
    });

    expect(
      normalizePetInput({
        name: 'Coco',
        age: 'puppy',
        puppyStage: 'stage2',
        weight: 8,
      }).data
    ).toMatchObject({
      life_stage: 'puppy',
      puppy_stage: 'stage2',
      size: null,
      neuter_status: null,
    });
  });

  it('rejects invalid pet weights before they reach Supabase', () => {
    expect(normalizePetInput({ name: 'Sol', weight: 0.01 }).error).toMatch(
      /peso/
    );
  });

  it('preserves stable catalog identity when saving a cart', () => {
    const result = normalizeCartInput(
      {
        items: [
          {
            id: 'contentful-id-1kg',
            catalogProductId: 'contentful-id',
            sku: 'SKU-1-VARIANT',
            parentSku: 'SKU-1',
            productName: 'Receta 1kg',
            presentation: '1kg',
            quantity: 2,
            price: 5500,
          },
        ],
      },
      ' Quincena '
    );

    expect(result).toEqual({
      data: {
        name: 'Quincena',
        items: [
          {
            item_key: 'contentful-id-1kg',
            product_id: 'contentful-id',
            sku: 'SKU-1',
            product_name: 'Receta 1kg',
            presentation: '1kg',
            quantity: 2,
            unit_price: 5500,
            image_url: null,
          },
        ],
      },
    });
  });

  it('rejects malformed cart items as a complete transaction', () => {
    expect(
      normalizeCartInput(
        {
          items: [
            {
              id: 'product',
              productName: 'Producto',
              quantity: 0,
              price: 5000,
            },
          ],
        },
        'Carrito'
      ).error
    ).toMatch(/no se puede guardar/);
  });
});
