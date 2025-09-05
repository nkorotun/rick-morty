import { FC } from "react";
import { ICON_HASH_MAP } from "./icon.contants";
import { IIcon } from "./icon.types";

export const Icon: FC<IIcon> = (props) => {
  const { type, size, className } = props;

  const Icon = ICON_HASH_MAP[type];
  if (!Icon) {
    return null;
  }

  return <Icon width={size} height={size} className={className} />;
};
