export type ContentfulLink = { sys: { type: "Link"; linkType: "Entry" | "Asset" | "ContentType"; id: string } };

export type ContentfulEntry<Fields extends Record<string, unknown> = Record<string, unknown>> = {
  sys: {
    id: string;
    type: "Entry";
    contentType: ContentfulLink;
    createdAt?: string;
    updatedAt?: string;
    locale?: string;
  };
  fields: Fields;
};

export type ContentfulAsset = {
  sys: { id: string; type: "Asset" };
  fields: {
    title?: string;
    description?: string;
    file?: { url: string; fileName: string; contentType: string; details?: { size?: number; image?: { width: number; height: number } } };
  };
};

export type ContentfulCollection<Item> = {
  total: number;
  skip: number;
  limit: number;
  items: Item[];
  includes?: { Entry?: ContentfulEntry[]; Asset?: ContentfulAsset[] };
};

export type ContentfulContentType = { sys: { id: string }; name: string; fields: { id: string; type: string; required?: boolean; localized?: boolean }[] };

export type ContentfulEntryQuery = {
  contentType: string;
  limit?: number;
  skip?: number;
  include?: number;
  locale?: string;
  order?: string;
  filters?: Record<`fields.${string}`, string | number | boolean>;
};

/** Published product copy. Avify remains the source for price, stock, and availability. */
export type ProductContentFields = {
  productName?: string;
  avifySku?: string;
  urlSlug?: string;
  description?: string;
  ingredientes?: string;
  image?: (ContentfulLink | ContentfulAsset)[];
  category?: string;
  categorySlug?: string;
  categoryTest?: ContentfulLink | ContentfulEntry;
};

export type CategoryContentFields = { label?: string; slug?: string; image?: ContentfulLink | ContentfulAsset };
export type BlogPostContentFields = { title?: string; slug?: string; excerpt?: string; body?: Record<string, unknown>; media?: ContentfulLink | ContentfulAsset; author?: ContentfulLink | ContentfulEntry };
