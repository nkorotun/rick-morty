import morty from "../../assets/morty.svg?react";
import chevronLeft from "../../assets/chevron-left.svg?react";
import chevronRight from "../../assets/chevron-right.svg?react";
import burgerMenu from "../../assets/burger-menu.svg?react";
import close from "../../assets/close.svg?react";
import search from "../../assets/search.svg?react";
import filter from "../../assets/filter.svg?react";

export const ICON_HASH_MAP = {
  logo: morty,
  "chevron-left": chevronLeft,
  "chevron-right": chevronRight,
  "burger-menu": burgerMenu,
  close: close,
  search: search,
  filter: filter,
};

export type TIcon = keyof typeof ICON_HASH_MAP;
