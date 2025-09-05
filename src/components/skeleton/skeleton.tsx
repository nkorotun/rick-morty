import { FC } from "react";
import { ISkeleton } from "./skeleton.types";

export const Skeleton: FC<ISkeleton> = (props) => {
  const { className } = props;

  return (
    <div
      className={`bg-[#efefef] bg-[linear-gradient(90deg,#efefef,#ffffff,#efefef)] bg-[200%_100%] bg-no-repeat rounded inline-block leading-none animate-[skeleton-animation_.75s_ease-in-out_infinite] ${
        className || ""
      }`}
    />
  );
};
