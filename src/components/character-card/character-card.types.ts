import { ICharacter } from "../../pages/characters/page.types";

export interface ICharacterCard
  extends Pick<
    ICharacter,
    "id" | "name" | "species" | "status" | "gender" | "image"
  > {
  onSelectCharacter?: (id: number) => () => void;
}
