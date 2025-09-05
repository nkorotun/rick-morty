import { FC } from "react";
import { ICharacterCard } from "./character-card.types";

export const CharacterCard: FC<ICharacterCard> = (props) => {
  const { onSelectCharacter, id, image, name, status, species, gender } = props;

  const handleClick =
    (onSelectCharacter && onSelectCharacter(id)) || (() => {});

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer h-40 flex items-center gap-2 p-2 bg-gray-700 transition-all duration-75 hover:bg-green-700"
    >
      <img
        src={image}
        alt={name}
        className="w-auto h-30 rounded-full object-fill"
      />
      <div className="flex flex-col gap-y-1">
        <span className="text-xl font-bold mb-2">{name}</span>
        <span>{status}</span>
        <span>Species: {species}</span>
        <span>Gender: {gender}</span>
      </div>
    </div>
  );
};
