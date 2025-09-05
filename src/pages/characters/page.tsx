import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { CharacterCard } from "../../components/character-card";
import { Icon } from "../../components/icon";
import { Loader } from "../../components/loader";
import { Pagination } from "../../components/pagination/pagination";
import { BASE_URL, SEARCH_INPUT_DEBOUNCE_DELAY } from "../../constants/api";
import useDebounce from "../../hooks/useDebounce";
import { CHARACTER_FILTER_OPTIONS } from "./page.constants";
import { ICharacter, ICharacterFilter, IListPagination } from "./page.types";

export const CharactersPage = () => {
  const navigate = useNavigate();
  // Character List
  const [characterList, setCharacterList] = useState<ICharacter[]>([]);
  const [pagination, setPagination] = useState<IListPagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchValue = useDebounce(
    searchInput,
    SEARCH_INPUT_DEBOUNCE_DELAY
  );

  // Filter
  const [filter, setFilter] = useState<ICharacterFilter>({
    gender: "",
    status: "",
  });

  useEffect(() => {
    fetchCharacters(`${BASE_URL}/character`);
  }, []);

  useEffect(() => {
    onSearch();
  }, [debouncedSearchValue]);

  const fetchCharacters = async (
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

      const currentPage = data?.info?.prev
        ? Number(new URL(data?.info?.prev).searchParams.get("page")) + 1
        : 1;
      setPagination({ ...data.info, page: currentPage });
      setCharacterList(data?.results || []);
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
    fetchCharacters(`${BASE_URL}/character`, {
      name: debouncedSearchValue.toLowerCase(),
      ...filter,
    });
  };

  const onChangePaginationPage = (url: string | null) => () => {
    if (!url) return;
    fetchCharacters(url);
  };

  const openCharacterDetails = (id: number) => () => {
    navigate(`/characters/${id}`);
  };

  const onChangeSelectedFilter =
    (category: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      setFilter((prev) => ({
        ...prev,
        [`${category}`]: e.target.value,
      }));
    };

  return (
    <>
      <div className="py-10">
        <h1 className="text-center text-3xl font-semibold">Characters</h1>
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
      <div className="flex items-center gap-x-4 px-6 mt-2">
        <Icon type="filter" className="w-4 fill-white" />
        {Object.entries(CHARACTER_FILTER_OPTIONS).map(([category, options]) => {
          return (
            <select
              name={`${category}-filter`}
              id={`${category}-select`}
              onChange={onChangeSelectedFilter(category)}
              className={`capitalize`}
            >
              {options.map((option) => {
                return (
                  <option
                    value={option}
                    // @ts-ignore
                    selected={filter[category] === option}
                  >{`${option || category}`}</option>
                );
              })}
            </select>
          );
        })}
      </div>
      <section className="px-4 my-8">
        {!!(characterList.length && pagination) && (
          <Pagination {...pagination} onClick={onChangePaginationPage} />
        )}
        {isLoading ? (
          <div className="w-full h-20 flex justify-center items-center">
          <Loader className="text-green-400" />
          </div>
        ) : !characterList.length ? (
          <p className="w-full text-center text-xl">No results were found...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {characterList.map((character) => (
              <CharacterCard
                key={`char-${character.id}`}
                {...character}
                onSelectCharacter={openCharacterDetails}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};
