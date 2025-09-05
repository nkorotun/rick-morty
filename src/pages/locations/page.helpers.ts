import { IPagination } from "../../components/pagination/pagination.types";

export const calculateUglyPagination = (data: IPagination): IPagination => {
  const ITEMS_IN_UGLY_PAGINATED_LIST = 10;
  const totalPages = Math.ceil(data.count / ITEMS_IN_UGLY_PAGINATED_LIST);
  const currentPage = data?.prev
    ? Number(new URL(data?.prev).searchParams.get("page") || 0) * 2 + 1
    : 1;
  return {
    ...data,
    pages: totalPages,
    page: currentPage,
  };
};
