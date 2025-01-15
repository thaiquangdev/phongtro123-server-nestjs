export class FilterPostDto {
  limit?: number;

  page?: number;

  orderBy?: string;

  category?: string;

  minPrice?: number;

  maxPrice?: number;

  acreage?: number;
}
