// Types for PLP API responses

export interface Product {
  productId: string;
  productName: string;
  slug: string;
  description?: string;
  productAsset?: { preview: string };
  price?: { value?: number; min?: number; max?: number };
  priceWithTax?: { value?: number; min?: number; max?: number };
  currencyCode?: string;
  facetValueIds?: string[];
}

export interface FacetValue {
  id: string;
  name: string;
  facet: { id: string; name: string };
}

export interface FacetCount {
  count: number;
  facetValue: FacetValue;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  slug: string;
  featuredAsset?: { preview: string };
}

export interface ProductSearchResult {
  items: Product[];
  totalItems: number;
  facetValues: FacetCount[];
}

export interface CollectionFacetValue extends FacetValue {
  count?: number;
}
