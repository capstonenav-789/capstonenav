"use client";
import React, { useState } from "react";
import styles from "./Drawer.module.css";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut } from 'firebase/auth';
import { auth } from "@/firebase";
const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : styles.closed}`}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/dashboard">HOME</Link>
          </li>
          <li>
            <Link href="/aboutprofesser">ABOUT PROFESSOR</Link>
          </li>
          <li>
            <Link href="/classes">CLASSES</Link>
          </li>
          <li>
            <Link href="/courses">COURSES</Link>
          </li>
          <li>
            <Link href="/projects">PROJECTS</Link>
          </li>
          <li>
            <Link href="/project-name">PROJECT NAME</Link>
          </li>
          <li>
            <Button variant="link" size="link" onClick={handleLogout}>LOGOUT</Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Drawer;
