import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { CharacterCard } from "../../../components/character-card";
import { Skeleton } from "../../../components/skeleton";
import { BASE_URL } from "../../../constants/api";
import { ICharacter } from "../../characters/page.types";
import { IEpisode } from "../page.types";
import { RESIDENTS_TO_SHOW } from "./page.constants";

export const EpisodeDetailsPage = () => {
  const match = useMatch("/episodes/:episodeId");
  const episodeId = match?.params.episodeId;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [episode, setEpisode] = useState<IEpisode | null>(null);
  const [isEpisodeError, setIsEpisodeError] = useState<boolean>(false);

  const [residents, setResidents] = useState<ICharacter[]>([]);
  const [isResidentsLoading, setIsResidentsLoading] = useState<boolean>(false);

  const fetchEpisodeDetails = async () => {
    if (!episodeId) return;
    setIsLoading(true);
    setIsEpisodeError(false);
    try {
      const episodeResponse = await fetch(`${BASE_URL}/episode/${episodeId}`, {
        method: "GET",
      });
      if (!episodeResponse.ok) {
        throw new Error("Error: failed to get episode details");
      }
      const data = await episodeResponse.json();
      setEpisode(data);
    } catch (e) {
      console.error(e);
      setIsEpisodeError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResidents = async (ids: string[]) => {
    if (!ids.length) return;
    setIsResidentsLoading(true);
    const query = ids.join(",");
    try {
      const residents = await fetch(`${BASE_URL}/character/${query}`, {
        method: "GET",
      });
      const data = await residents.json();
      setResidents(Array.isArray(data) ? data : [data]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResidentsLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodeDetails();
  }, []);

  useEffect(() => {
    if (!episode) {
      return;
    }

    const selectFirstFive = episode.characters
      .slice(0, RESIDENTS_TO_SHOW)
      .map((res) => res.split("character/")[1]);

    fetchResidents(selectFirstFive);
  }, [episode]);

  return (
    <>
      <div className="py-10">
        <h1 className="text-center text-3xl font-semibold ">
          {episode?.episode || "Episode details"}
        </h1>
      </div>
      <section className="p-4">
        {isLoading ? (
          <div className="w-full flex flex-col justify-center gap-4">
            <Skeleton className="w-100 h-10 mb-4 rounded-lg" />
            <Skeleton className="w-80 h-5 rounded-lg" />
            <Skeleton className="w-70 h-5 rounded-lg" />
            <Skeleton className="w-65 h-5 rounded-lg" />
            <Skeleton className="w-70 h-5 mt-6 rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-1/3 h-40 rounded-md" />
              <Skeleton className="w-1/3 h-40 rounded-md" />
              <Skeleton className="w-1/3 h-40 rounded-md" />
            </div>
          </div>
        ) : !episode || isEpisodeError ? (
          <p className="text-center font-semibold text-2xl text-red-400">
            Failed to get episode details
          </p>
        ) : (
          <div className="w-full flex flex-col justify-center gap-4">
            <p className="text-lg">
              {`Name: `}
              <b>{episode.name}</b>
            </p>
            <p className="text-lg">
              {`Date: `}
              <b>{episode.air_date}</b>
            </p>
            <div className="mt-4">
              <p className="text-xl mb-2">
                {`Characters: `}
                <b>{episode.characters.length}</b>
              </p>
              {isResidentsLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="w-1/4 h-40 rounded-md" />
                  <Skeleton className="w-1/4 h-40 rounded-md" />
                  <Skeleton className="w-1/4 h-40 rounded-md" />
                  <Skeleton className="w-1/4 h-40 rounded-md" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {residents.map((el) => (
                    <CharacterCard key={`char-${el.id}`} {...el} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
