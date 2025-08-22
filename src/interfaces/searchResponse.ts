import { ProductResponse } from './productResponse';

export interface SearchResponse {
  products: ProductResponse[];
  total?: number;
  page?: number;
  limit?: number;
}