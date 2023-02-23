import { Link, useNavigate } from "react-router-dom";

function SidebarLink({ Icon, text, active,link,theme }) {
  const router = useNavigate();
  return (
    <Link
      className={`text-[#d9d9d9] ${theme !== 'dark' && 'text-[#000]'} flex items-center  justify-center xl:justify-start  hoverAnimation ${
        active && "font-extrabold"
      }`}
      to={link}
      onClick={() => active && router.push("/")}
    >
        <div className="flex hover:bg-[rgb(255,255,255,0.1)] rounded-full transition-all space-x-3 p-2 px-3">

      <Icon className="h-8" fontSize={30} />
      <span className="hidden md:inline text-2xl">{text}</span>
        </div>
    </Link>
  );
}

export default SidebarLink;