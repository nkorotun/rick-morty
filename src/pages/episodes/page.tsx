import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { CharacterCard } from "../../components/character-card";
import { Icon } from "../../components/icon";
import { Loader } from "../../components/loader";
import { Pagination } from "../../components/pagination/pagination";
import { IPagination } from "../../components/pagination/pagination.types";
import { BASE_URL, SEARCH_INPUT_DEBOUNCE_DELAY } from "../../constants/api";
import useDebounce from "../../hooks/useDebounce";
import { calculateUglyPagination } from "../locations/page.helpers";
import { IEpisode, IEpisodeState, TAction } from "./page.types";

const initialState: IEpisodeState = {
  next_url: null,
  episodes: [],
};

const reducer = (state: IEpisodeState, action: TAction) => {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, episodes: action.payload };
    case "ADD_ITEMS":
      return { ...state, episodes: [...state.episodes, ...action.payload] };
    case "CHANGE_NEXT_URL":
      return { ...state, next_url: action.payload };
    default:
      return state;
  }
};

export const EpisodesPage = () => {
  const navigate = useNavigate();
  // Episodes List
  const [episodeState, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Loading more
  const loadEpisodesRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Search
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchValue = useDebounce(
    searchInput,
    SEARCH_INPUT_DEBOUNCE_DELAY
  );

  useEffect(() => {
    onSearch();
  }, [debouncedSearchValue]);

  const fetchEpisodes = async (
    url: string,
    params?: { [key: string]: string }
  ) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const episodeResponse = await fetch(
        params ? `${url}?${new URLSearchParams(params)}` : url,
        {
          method: "GET",
        }
      );
      if (!episodeResponse.ok) {
        throw new Error("Error: failed to get episodes");
      }
      const data = await episodeResponse.json();
      dispatch({ type: "SET_ITEMS", payload: data.results });
      dispatch({ type: "CHANGE_NEXT_URL", payload: data.info.next });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const onSearch = (
    e?:
      | React.SyntheticEvent<HTMLFormElement>
      | React.MouseEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e?.preventDefault();
    fetchEpisodes(`${BASE_URL}/episode`, {
      name: debouncedSearchValue.toLowerCase(),
    });
  };

  // Infinite scroll
  useEffect(() => {
    document.addEventListener("scroll", onScrollEpisodes, true);
    return () => document.removeEventListener("scroll", onScrollEpisodes, true);
  }, [episodeState]);

  const onScrollEpisodes = () => {
    if (!loadEpisodesRef.current) return;

    // @ts-ignore
    const rect = loadEpisodesRef.current.getBoundingClientRect();
    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.top + 40 <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
      loadMoreEpisodes();
    }
  };

  const loadMoreEpisodes = async (params?: { [key: string]: string }) => {
    if (isLoading || isLoadingMore) return;
    const url = episodeState.next_url;
    if (!url) return;
    setIsLoadingMore(true);

    try {
      const episodeResponse = await fetch(
        params ? `${url}?${new URLSearchParams(params)}` : url,
        {
          method: "GET",
        }
      );
      if (!episodeResponse.ok) {
        throw new Error("Error: failed to get more episodes");
      }
      const data = await episodeResponse.json();
      dispatch({ type: "ADD_ITEMS", payload: data.results });
      dispatch({ type: "CHANGE_NEXT_URL", payload: data.info.next });
    } catch (e) {
      console.error(e);
      setIsLoadingMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const openEpisode = (id: number) => () => {
    navigate(`/episodes/${id}`);
  };

  return (
    <>
      <div className="py-10">
        <h1 className="text-center text-3xl font-semibold">Episodes</h1>
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
        {isLoading ? (
          <div className="w-full h-20 flex justify-center items-center">
            <Loader className="text-green-400" />
          </div>
        ) : !episodeState.episodes.length ? (
          <p className="w-full text-center text-xl">No results were found...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {episodeState.episodes.map((episode) => {
              return (
                <div
                  key={`episodes-${episode.id}`}
                  onClick={openEpisode(episode.id)}
                  className="cursor-pointer h-40 flex items-center gap-2 p-2 bg-gray-700 transition-all duration-75 hover:bg-green-700 rounded-lg"
                >
                  <div className="flex flex-col gap-y-1">
                    <span className="text-xl font-bold mb-2">
                      {episode.name}
                    </span>
                    <span className="text-lg">{`Episode: ${episode.episode}`}</span>
                    <span className="text-lg">
                      {`Air date: ${episode.air_date}`}
                    </span>
                    <span className="text-lg">
                      {`Characters: ${episode.characters.length}`}
                    </span>
                  </div>
                </div>
              );
            })}
            {!!(episodeState.episodes.length && !isLoadingMore) && (
              <div id="trigger" ref={loadEpisodesRef} />
            )}
          </div>
        )}
        {isLoadingMore && (
          <div className="flex flex-col w-full justify-center items-center gap-2 p-2">
            <Loader className="text-green-400" />
            <span className="text-lg">Loading more...</span>
          </div>
        )}
      </section>
    </>
  );
};
