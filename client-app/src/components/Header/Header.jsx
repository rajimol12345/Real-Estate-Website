import React, { useState, useEffect } from 'react';
import TopBar from '../TopBar/TopBar';
import Navbar from '../Navbar/Navbar';
import './Header.css';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <TopBar />
      <Navbar />
    </header>
  );
};

export default Header;
