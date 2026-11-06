export type AvifyVariant = {
  id: string;
  sku: string;
  name: string;
  status: string | null;
  price: number | null;
  salePrice: number | null;
  qty: number | null;
};

export type AvifyCategory = { id: string; label: string; parentId: string | null };

export type AvifyProduct = AvifyVariant & {
  slug: string | null;
  type: string | null;
  description: string | null;
  categories: AvifyCategory[];
  children: AvifyVariant[];
};

export type AvifyProductPage = {
  products: AvifyProduct[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type AvifyProductQuery = {
  page?: number;
  pageSize?: number;
  skus?: readonly string[];
  /** Omit to use AVIFY_LOCATION_ID; null explicitly requests global inventory. */
  locationId?: number | null;
};
