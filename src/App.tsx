import { Navigate, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/navbar";
import { Error404Page } from "./pages/404/page";
import { CharacterDetailsPage } from "./pages/characters/character-details/page";
import { CharactersPage } from "./pages/characters/page";
import { EpisodeDetailsPage } from "./pages/episodes/episode-details/page";
import { EpisodesPage } from "./pages/episodes/page";
import { LocationDetailsPage } from "./pages/locations/location-details/page";
import { LocationsPage } from "./pages/locations/page";

function App() {
  return (
    <>
      <NavBar />
      <main className="mt-[55px] min-h-screen bg-[#242424]">
        <Routes>
          <Route path={"/"} element={<Navigate to={"/characters"} replace />} />
          <Route path={"/characters"}>
            <Route index element={<CharactersPage />} />
            <Route path=":characterId" element={<CharacterDetailsPage />} />
          </Route>
          <Route path={"/locations"}>
            <Route index element={<LocationsPage />} />
            <Route path=":locationId" element={<LocationDetailsPage />} />
          </Route>
          <Route path={"/episodes"}>
            <Route index element={<EpisodesPage />} />
            <Route path=":episodeId" element={<EpisodeDetailsPage />} />
          </Route>
          <Route path="*" element={<Error404Page />}></Route>
        </Routes>
      </main>
      <footer className="p-1">
        <p className="text-center text-sm">
          Created by Mykyta Korotun for Dharma
        </p>
      </footer>
    </>
  );
}

export default App;
