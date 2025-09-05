import { FC } from "react";
import { ILoader } from "./loader.types";

export const Loader: FC<ILoader> = (props) => {
  const { className } = props;
  return (
    <div
      className={`inline-block h-8 w-8 animate-[pulseLoader_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] text-surface opacity-0 motion-reduce:animate-[pulseLoader_1.5s_linear_infinite] ${
        className || ""
      }`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
