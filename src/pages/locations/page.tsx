import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Icon } from "../../components/icon";
import { Loader } from "../../components/loader";
import { Pagination } from "../../components/pagination/pagination";
import { IPagination } from "../../components/pagination/pagination.types";
import { BASE_URL, SEARCH_INPUT_DEBOUNCE_DELAY } from "../../constants/api";
import useDebounce from "../../hooks/useDebounce";
import { ILocation } from "./page.types";
import { USE_UGLY_PAGINATION } from "./page.constants";
import { calculateUglyPagination } from "./page.helpers";


export const LocationsPage = () => {
  const navigate = useNavigate();
  // Locations List
  const [locationsList, setLocationsList] = useState<ILocation[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchValue = useDebounce(
    searchInput,
    SEARCH_INPUT_DEBOUNCE_DELAY
  );

  useEffect(() => {
    fetchLocation(`${BASE_URL}/location`);
  }, []);

  useEffect(() => {
    onSearch();
  }, [debouncedSearchValue]);

  const fetchLocation = async (
    url: string,
    params?: { [key: string]: string }
  ) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const charReq = await fetch(
        params ? `${url}?${new URLSearchParams(params)}` : url,
        {
          method: "GET",
        }
      );
      const data = await charReq.json();

      if (USE_UGLY_PAGINATION) {
        const uglyPagination = calculateUglyPagination(data.info);
        setPagination(uglyPagination);
      } else {
        const currentPage = data?.info?.prev
          ? Number(new URL(data?.info?.prev).searchParams.get("page")) + 1
          : 1;
        setPagination({ ...data.info, page: currentPage });
      }
      setLocationsList(data?.results || []);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Search bar
  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const onSearch = (
    e?:
      | React.SyntheticEvent<HTMLFormElement>
      | React.MouseEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e?.preventDefault();
    fetchLocation(`${BASE_URL}/location`, {
      name: debouncedSearchValue.toLowerCase(),
    });
  };

  const onChangePaginationPage = (url: string | null) => async () => {
    // TODO: DELETE EVERYTHING UNDER THIS CONDITION
    if (USE_UGLY_PAGINATION) {
      if (!pagination) return;
      if (!url) {
        // @ts-ignore
        setPagination((prev) => ({
          ...prev,
          // @ts-ignore
          page: 1,
        }));
        return;
      }

      const pageToGo = url.split("=")[1];
      const currentUglyPage = pagination.page;
      const currentRealPage = Math.ceil(currentUglyPage / 2);
      const isMovingForward = url === pagination.next;

      if (isMovingForward) {
        if (currentRealPage !== Number(pageToGo) && currentUglyPage % 2 == 0) {
          fetchLocation(url);
          return;
        }
        // @ts-ignore
        setPagination((prev) => ({
          ...prev,
          // @ts-ignore
          page: prev.page + 1,
        }));
      } else {
        if (currentUglyPage % 2 === 0) {
          // @ts-ignore
          setPagination((prev) => ({
            ...prev,
            // @ts-ignore
            page: prev.page - 1,
          }));
          return;
        }
        await fetchLocation(url);
        // @ts-ignore
        setPagination((prev) => ({
          ...prev,
          // @ts-ignore
          page: prev.page + 1,
        }));
        return;
      }
      return;
    }

    if (!url) return;
    fetchLocation(url);
  };

  const openLocationDetailsPage = (id: number) => () => {
    navigate(`/locations/${id}`);
  };

  return (
    <>
      <div className="py-10">
        <h1 className="text-center text-3xl font-semibold">Locations</h1>
      </div>
      <form className="h-12 flex items-center px-4" onSubmit={onSearch}>
        <input
          value={searchInput}
          onChange={onChangeSearchInput}
          type={"text"}
          className="w-full h-12 outline-none py-2 px-4 bg-white rounded-l-lg font-lg text-black"
        />
        <Button
          type={"button"}
          className="flex justify-center items-center w-12 h-12 rounded-l-none"
          onClick={onSearch}
        >
          <Icon type="search" className="w-6 stroke-white" />
        </Button>
      </form>
      <section className="px-4 my-8">
        {!!(locationsList.length && pagination) && (
          <Pagination
            isUglyPagination={true}
            {...pagination}
            onClick={onChangePaginationPage}
          />
        )}
        {isLoading ? (
          <div className="w-full h-20 flex justify-center items-center">
          <Loader className="text-green-400" />
          </div>
        ) : !locationsList.length || !pagination ? (
          <p className="w-full text-center text-xl">No results were found...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(USE_UGLY_PAGINATION
              ? locationsList.slice(
                  pagination.page % 2 !== 0 ? 0 : 10,
                  pagination.page % 2 !== 0 ? 10 : 20
                )
              : locationsList
            ).map((location) => {
              return (
                <div
                  key={`locations-${location.id}`}
                  onClick={openLocationDetailsPage(location.id)}
                  className="cursor-pointer h-40 flex items-center gap-2 p-2 bg-gray-700 transition-all duration-75 hover:bg-green-700 rounded-lg"
                >
                  <div className="flex flex-col gap-y-1">
                    <span className="text-xl font-bold mb-2">
                      {location.name}
                    </span>
                    <span className="text-lg">{`Type: ${location.type}`}</span>
                    <span className="text-lg">
                      {`Dimension: ${location.dimension}`}
                    </span>
                    <span className="text-lg">
                      {`Residents: ${location.residents.length}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};
