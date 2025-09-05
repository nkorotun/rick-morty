import { IListPagination } from "../../pages/characters/page.types";

export interface IPagination extends IListPagination {
  isUglyPagination?: boolean;
  onClick: (value: string | null) => () => void;
}
