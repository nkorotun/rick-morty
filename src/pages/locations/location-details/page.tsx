import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { CharacterCard } from "../../../components/character-card";
import { Skeleton } from "../../../components/skeleton";
import { BASE_URL } from "../../../constants/api";
import { ICharacter } from "../../characters/page.types";
import { ILocation } from "../page.types";
import { RESIDENTS_TO_SHOW } from "./page.constants";

export const LocationDetailsPage = () => {
  const match = useMatch("/locations/:locationId");
  const locationId = match?.params.locationId;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<ILocation | null>(null);
  const [isLocationError, setIsLocationError] = useState<boolean>(false);

  const [residents, setResidents] = useState<ICharacter[]>([]);
  const [isResidentsLoading, setIsResidentsLoading] = useState<boolean>(false);

  const fetchLocationDetails = async () => {
    if (!locationId) return;
    setIsLoading(true);
    setIsLocationError(false);
    try {
      const locationResponse = await fetch(
        `${BASE_URL}/location/${locationId}`,
        {
          method: "GET",
        }
      );
      if (!locationResponse.ok) {
        throw new Error("Error: failed to get location details");
      }
      const data = await locationResponse.json();
      setLocation(data);
    } catch (e) {
      console.error(e);
      setIsLocationError(true);
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
    fetchLocationDetails();
  }, []);

  useEffect(() => {
    if (!location) {
      return;
    }

    const selectFirstFive = location.residents
      .slice(0, RESIDENTS_TO_SHOW)
      .map((res) => res.split("character/")[1]);

    fetchResidents(selectFirstFive);
  }, [location]);

  return (
    <>
      <div className="py-10">
        <h1 className="text-center text-3xl font-semibold ">
          {location?.name || "Location details"}
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
        ) : !location || isLocationError ? (
          <p className="text-center font-semibold text-2xl text-red-400">
            Failed to get location details
          </p>
        ) : (
          <div className="w-full flex flex-col justify-center gap-4">
            <p className="text-lg">
              {`Type: `}
              <b>{location.type}</b>
            </p>
            <p className="text-lg">
              {`Dimension: `}
              <b>{location.dimension}</b>
            </p>
            <div className="mt-4">
              <p className="text-xl mb-2">
                {`Residents: `}
                <b>{location.residents.length}</b>
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
