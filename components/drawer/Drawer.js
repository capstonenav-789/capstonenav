"use client"
import React, { useState } from 'react';
import styles from './Drawer.module.css';
import Link from "next/link";

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : styles.closed}`}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">HOME</Link>
          </li>
          <li>
            <Link href="/aboutprofesser">ABOUT PROFESSOR</Link>
          </li>
          <li>
            <Link href="/nameofclass">NAME OF THE CLASS</Link>
          </li>
          <li>
            <Link href="/projectnames">PROJECT NAMES</Link>
          </li>
          <li>
            <Link href="/projectsyear">PROJECTS YEAR</Link>
          </li>
          <li>
            <Link href="/studentnames">STUDENT NAMES</Link>
          </li>
          <li>
            <a href="/logout">LOGOUT</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Drawer;