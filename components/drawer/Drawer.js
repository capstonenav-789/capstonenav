// "use client";
// import React, { useState } from "react";
// import styles from "./Drawer.module.css";
// import Link from "next/link";
// import { Button } from "../ui/button";
// import { signOut } from 'firebase/auth';
// import { auth } from "@/firebase";
// const Drawer = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };
//   return (
//     <div className={`${styles.drawer} ${isOpen ? styles.open : styles.closed}`}>
//       <nav className={styles.nav}>
//         <ul>
//           <li>
//             <Link href="/dashboard">HOME</Link>
//           </li>
//           <li>
//             <Link href="/aboutprofesser">ABOUT PROFESSOR</Link>
//           </li>
//           <li>
//             <Link href="/classes">CLASSES</Link>
//           </li>
//           <li>
//             <Link href="/courses">COURSES</Link>
//           </li>
//           <li>
//             <Link href="/projects">PROJECTS</Link>
//           </li>
//           <li>
//             <Link href="/project-name">PROJECT NAME</Link>
//           </li>
//           <li>
//             <Button variant="link" size="link" onClick={handleLogout}>LOGOUT</Button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Drawer;

"use client";
import React from "react";
import styles from "./Drawer.module.css";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { X } from "lucide-react";

const Drawer = ({ isOpen = true, isMobile = false, onClose }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLinkClick = () => {
    // Close drawer on mobile when a link is clicked
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`
      ${styles.drawer} 
      ${isOpen ? styles.open : styles.closed}
      ${isMobile ? styles.mobile : styles.desktop}
    `}
    >
      {/* Close button for mobile */}
      {isMobile && (
        <div className={styles.closeButton}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2"
          >
            <X size={20} />
          </Button>
        </div>
      )}

      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/dashboard" onClick={handleLinkClick}>
              HOME
            </Link>
          </li>
          <li>
            <Link href="/aboutprofesser" onClick={handleLinkClick}>
              ABOUT PROFESSOR
            </Link>
          </li>
          <li>
            <Link href="/classes" onClick={handleLinkClick}>
              CLASSES
            </Link>
          </li>
          <li>
            <Link href="/courses" onClick={handleLinkClick}>
              COURSES
            </Link>
          </li>
          <li>
            <Link href="/projects" onClick={handleLinkClick}>
              PROJECTS
            </Link>
          </li>
          <li>
            <Link href="/project-name" onClick={handleLinkClick}>
              PROJECT NAME
            </Link>
          </li>
          <li>
            <Button
              variant="link"
              size="link"
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
              className="text-white hover:underline p-0 h-auto font-semibold text-[20px]"
            >
              LOGOUT
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Drawer;
