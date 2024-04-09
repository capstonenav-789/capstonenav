"use client"
import React, { useState } from 'react';
import styles from './Drawer.module.css';

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : styles.closed}`}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="/">HOME</a>
          </li>
          <li>
            <a href="/aboutprofesser">ABOUT PROFESSOR</a>
          </li>
          <li>
            <a href="/nameofclass">NAME OF THE CLASS</a>
          </li>
          <li>
            <a href="/projectnames">PROJECT NAMES</a>
          </li>
          <li>
            <a href="/projectsyear">PROJECTS YEAR</a>
          </li>
          <li>
            <a href="/studentnames">STUDENT NAMES</a>
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