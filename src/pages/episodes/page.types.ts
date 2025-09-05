export interface IEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
}
export interface IEpisodeState {
  next_url: string | null;
  episodes: IEpisode[];
}
export type TAction =
  | { type: "SET_ITEMS"; payload: IEpisode[] }
  | { type: "ADD_ITEMS"; payload: IEpisode[] }
  | { type: "CHANGE_NEXT_URL"; payload: string | null };
