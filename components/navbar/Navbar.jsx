// import Links from "./links/Links"
import Link from "next/link";
import '../../app/globals.css';

import { useAuthContext } from "@/utils/authContext";

const Navbar = () => {
  const { user } = useAuthContext();
    return (
      <div className="firstboxnav">
        <div className="flex flex-row justify-between items-center mx-auto bg-[#115740]  h-[80px] pr-20 navbarclass">
          <div className="atulogo h-[100px] bg-[#ffcc00] w-[400px] mt-3 mr-auto">
            <Link href="/" className="text-white text-2xl text-center ">
              <img
                src="/logo-atu-wide.webp"
                alt="Logo"
                className="h-[60px] w-[250px] ml-5 mt-3"
              />
            </Link>
          </div>
          <div className="marg">
            {!user?.uid ? 
              <Link
                href="/"
                className="text-white text-[18px] border-1 border-solid border-white"
              >
                Login
              </Link> 
            : <Link
            href="/profile"
            className="text-white text-[18px] border-1 border-solid border-white"
          >
            My Profile
          </Link> 
            }
          </div>
        </div>
      </div>
    );
}

export default Navbar