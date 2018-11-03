import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu = (props) => {
  return (
    <nav>
      <ul>
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/blog">BLOG</Link></li>
      </ul>
    </nav>
  )
};

export default SideMenu;
