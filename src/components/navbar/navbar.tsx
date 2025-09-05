import { useRef } from "react";
import { Link } from "react-router";
import { Icon } from "../icon";

export const NavBar = () => {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const onNavigate = () => {
    if (!detailsRef.current) return;
    detailsRef.current.open = false;
  };

  return (
    <nav className="fixed top-0 w-full h-[55px] flex max-sm:justify-between sm:justify-start items-center bg-gray-100 text-green-700 font-bold text-xl">
      <Icon size={32} type={"logo"} className="ml-2 mr-8" />
      <ul className="max-sm:hidden w-full flex justify-start items-center gap-x-4 p-2">
        <li>
          <Link to={"/"}>Characters</Link>
        </li>
        <li>
          <Link to={"/locations"}>Locations</Link>
        </li>
        <li>
          <Link to={"/episodes"}>Episodes</Link>
        </li>
      </ul>
      <details ref={detailsRef} className="group sm:hidden mr-2">
        <summary className="flex items-center cursor-pointer list-none">
          <span className="mr-1 note font-medium">
            <Icon type="burger-menu" className="w-8 group-open:hidden" />
            <Icon type="close" className="w-8 hidden group-open:block!" />
          </span>
        </summary>
        <ul className="w-full h-screen list-none bg-white overflow-hidden absolute top-[100%] right-0">
          <li className="cursor-pointer px-3 py-2 transition-all duration-[0.15s] hover:bg-[#F6F6F6] hover:bg-opacity-70 flex gap-x-1.5 items-center title-s font-medium">
            <Link to={"/"} onClick={onNavigate}>
              Characters
            </Link>
          </li>
          <li className="cursor-pointer px-3 py-2 transition-all duration-[0.15s] hover:bg-[#F6F6F6] hover:bg-opacity-70 flex gap-x-1.5 items-center title-s font-medium">
            <Link to={"/locations"} onClick={onNavigate}>
              Locations
            </Link>
          </li>
          <li className="cursor-pointer px-3 py-2 transition-all duration-[0.15s] hover:bg-[#F6F6F6] hover:bg-opacity-70 flex gap-x-1.5 items-center title-s font-medium">
            <Link to={"/episodes"} onClick={onNavigate}>
              Episodes
            </Link>
          </li>
        </ul>
      </details>
    </nav>
  );
};
