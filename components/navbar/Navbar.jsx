// // import Links from "./links/Links"
// import Link from "next/link";
// import '../../app/globals.css';

// import { useAuthContext } from "@/utils/authContext";

// const Navbar = () => {
//   const { user } = useAuthContext();
//     return (
//       <div className="firstboxnav">
//         <div className="flex flex-row justify-between items-center mx-auto bg-[#115740]  h-[80px] pr-20 navbarclass">
//           <div className="atulogo h-[100px] bg-[#ffcc00] w-[400px] mt-3 mr-auto">
//             <Link href="/" className="text-white text-2xl text-center ">
//               <img
//                 src="/logo-atu-wide.webp"
//                 alt="Logo"
//                 className="h-[60px] w-[250px] ml-5 mt-3"
//               />
//             </Link>
//           </div>
//           <div className="marg">
//             {!user?.uid ?
//               <Link
//                 href="/"
//                 className="text-white text-[18px] border-1 border-solid border-white"
//               >
//                 Login
//               </Link>
//             : <Link
//             href="/profile"
//             className="text-white text-[18px] border-1 border-solid border-white"
//           >
//             My Profile
//           </Link>
//             }
//           </div>
//         </div>
//       </div>
//     );
// }

// export default Navbar

// Navbar.js
import Link from "next/link";
import "../../app/globals.css";
import { useAuthContext } from "@/utils/authContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = ({ onToggleDrawer, showToggle = false }) => {
  const { user } = useAuthContext();

  return (
    <div className="firstboxnav">
      <div className="flex flex-row justify-between items-center mx-auto bg-[#115740] h-[80px] pr-4 sm:pr-20 navbarclass">
        {/* Left side - Toggle button + Logo */}
        <div className="flex items-center">
          {/* Mobile toggle button */}
          {showToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDrawer}
              className="mr-2 sm:mr-4 p-2 hover:bg-white/10 text-white md:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </Button>
          )}

          {/* Logo */}
          <div className="atulogo h-[100px] bg-[#ffcc00] w-[250px] sm:w-[300px] md:w-[400px] mt-3">
            <Link href="/" className="text-white text-2xl text-center">
              <img
                src="/logo-atu-wide.webp"
                alt="Logo"
                className="h-[60px] w-[200px] sm:w-[220px] md:w-[250px] ml-3 sm:ml-4 md:ml-5 mt-3"
              />
            </Link>
          </div>
        </div>

        {/* Right side - Profile/Login link */}
        <div className="marg">
          {!user?.uid ? (
            <Link
              href="/"
              className="text-white text-sm sm:text-base md:text-[18px] border-1 border-solid border-white px-2 py-1 hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          ) : (
            <Link
              href="/profile"
              className="text-white text-sm sm:text-base md:text-[18px] border-1 border-solid border-white px-2 py-1 hover:bg-white/10 transition-colors"
            >
              My Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
