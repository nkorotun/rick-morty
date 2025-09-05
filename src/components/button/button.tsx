import { FC } from "react";
import { IButton } from "./button.types";

export const Button: FC<IButton> = (props) => {
  const { className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={`cursor-pointer disabled:cursor-not-allowed p-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-400 rounded-lg transition-all duration-[0.15s] ${
        className || ""
      }`}
    />
  );
};
