import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { Skeleton } from "../../../components/skeleton";
import { BASE_URL } from "../../../constants/api";
import { ICharacter } from "../page.types";
import { STATUS_COLOR_MAP } from "./page.constants";

export const CharacterDetailsPage = () => {
  const match = useMatch("/characters/:characterId");
  const characterId = match?.params.characterId;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [isCharacterError, setIsCharacterError] = useState<boolean>(false);

  const fetchCharacterDetail = async () => {
    if (!characterId) return;
    setIsLoading(true);
    setIsCharacterError(false);
    try {
      const charReq = await fetch(`${BASE_URL}/character/${characterId}`, {
        method: "GET",
      });
      if (!charReq.ok) {
        throw new Error("Error: failed to get character details");
      }
      const data = await charReq.json();
      setCharacter(data);
    } catch (e) {
      console.error(e);
      setIsCharacterError(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterDetail();
  }, []);

  return (
    <>
      <div className="py-10">
        <h1 className="text-center text-3xl font-semibold">
          {character?.name || "Character details"}
        </h1>
      </div>
      <section className="p-4">
        {isLoading ? (
          <div className="w-full flex max-md:flex-col max-md:justify-center max-md:items-center gap-4">
            <Skeleton className="w-[300px] h-[300px] rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-100 h-10 mb-4 rounded-lg" />
              <Skeleton className="w-70 h-5 rounded-lg" />
              <Skeleton className="w-80 h-5 rounded-lg" />
              <Skeleton className="w-90 h-5 rounded-lg" />
              <Skeleton className="w-100 h-5 rounded-lg" />
              <Skeleton className="w-70 h-5 rounded-lg" />
              <Skeleton className="w-80 h-5 mt-6 rounded-lg" />
            </div>
          </div>
        ) : !character || isCharacterError ? (
          <p className="text-center font-semibold text-2xl text-red-400">
            Failed to get character details
          </p>
        ) : (
          <div className="w-full flex max-md:flex-col max-md:justify-center max-md:items-center gap-4">
            <img
              src={character.image}
              alt={character.name}
              className="w-[300px] h-[300px] rounded-xl object-fill"
            />
            <div className="flex flex-col gap-2">
              <p className="text-xl flex items-center gap-x-2">
                {`Status: ${character.status}`}
                <span
                  className={`inline-block w-5 h-5 rounded-full ${
                    STATUS_COLOR_MAP[character.status]
                  }`}
                />
              </p>
              <p className="text-xl">{`Gender: ${character.gender}`}</p>
              <p className="text-xl">{`Type: ${
                character.type || "Unknown"
              }`}</p>
              <p className="text-xl">{`Species: ${
                character.species || "Unknown"
              }`}</p>
              <p className="text-xl">
                {`Location: `}
                <b>{`${character.location?.name || "Unknown"}`}</b>
              </p>
              <p className="text-xl mt-4">{`Appeared in ${character.episode.length} episode(s)`}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
