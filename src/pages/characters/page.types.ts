export interface ICharacter {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: any;
  location: any;
  image: string; // URL
  episode: string[]; // URL[]
  url: string; // URL
}

export interface IListPagination {
  prev: string | null; // URL
  next: string | null; // URL
  count: number;
  pages: number;
  page: number;
}

export interface ICharacterFilter {
  gender: "" | "female" | "male" | "genderless" | "unknown";
  status: "" | "alive" | "dead" | "unknown";
}
