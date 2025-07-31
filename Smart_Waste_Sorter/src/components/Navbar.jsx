import React from 'react';
import { NavLink } from 'react-router-dom';

// Define styles as JavaScript objects
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  brand: {
    fontSize: '1.5rem',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  links: {
    listStyle: 'none',
    display: 'flex',
    gap: '1.5rem',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  // Note: pseudo-classes like :hover are not directly supported in inline styles.
};

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <NavLink to="/" style={styles.brand}>
        ♻️ Smart Waste Sorter
      </NavLink>
      <ul style={styles.links}>
        <li>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              ...styles.link, 
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none'
            })}
          >
            Scan Item
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/infographics"
            style={({ isActive }) => ({
              ...styles.link, 
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none'
            })}
          >
            Infographics
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;