export interface ILocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // URL []
  url: string; // URL
}

export interface IListPagination {
  prev: string | null; // URL
  next: string | null; // URL
  count: number;
  pages: number;
  page: number;
}