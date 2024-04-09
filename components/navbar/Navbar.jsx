// import Links from "./links/Links"
import Link from "next/link"
import '../../app/globals.css';

const Navbar = () => {
    return (
      <div className="flex flex-row justify-between items-center mx-auto bg-[#115740]  h-[80px] pr-20">
        <div className="atulogo h-[100px] bg-[#ffcc00] w-[400px] mt-3">
          <Link href="/" className="text-white text-2xl text-center ">
            {" "}
           
              <img
                src="/logo-atu-wide.webp"
                alt="Logo"
                className="h-[60px] w-[250px] ml-5 mt-3"
              />
        
          </Link>
        </div>
        <div className="mr-auto ">
          {/* <Links /> */}
        </div>
        <div className="marg">
          <Link
            href="#"
            className="text-white text-[18px] mr-20  border-1 border-solid border-white"
          >
            Login
          </Link>
          <Link href="#" className="text-white text-[18px]">
            SignUp{" "}
          </Link>
        </div>
      </div>
    );
}

export default Navbar