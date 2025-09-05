import { FC } from "react";
import { Button } from "../button";
import { Icon } from "../icon";
import { IPagination } from "./pagination.types";

export const Pagination: FC<IPagination> = (props) => {
  const { prev, next, page, pages, onClick, isUglyPagination } = props;
  return (
    <div className="flex items-center max-md:justify-between gap-x-2 py-2">
      <Button
        disabled={!isUglyPagination ? !prev : !prev && page % 2 !== 0}
        onClick={onClick(prev)}
      >
        <Icon type="chevron-left" className="w-5" />
      </Button>
      <span>{`${page || 0} of ${pages || 0}`}</span>
      <Button disabled={!next} onClick={onClick(next)}>
        <Icon type="chevron-right" className="w-5" />
      </Button>
    </div>
  );
};
