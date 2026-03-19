/* eslint-disable max-len */
import {NavLink} from 'react-router-dom';
import styles from './styles.module.scss';

// Header renders the top navigation bar with links to Home and Settings.
//
// NavLink is React Router's link component that knows whether its target
// route is currently active. The className prop accepts a function receiving
// { isActive } — here we use it to apply the activeLink style (bold +
// underline) on top of the base navLink style when the route matches.
const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <NavLink
          to="/settings"
          exact={'true'}
          className={({isActive}) => isActive ? [styles.activeLink, styles.navLink].join(' ') : styles.navLink}
        >
          <div>Settings</div>
        </NavLink>
        <NavLink
          to="/"
          exact={'true'}
          className={({isActive}) => isActive ? [styles.activeLink, styles.navLink].join(' ') : styles.navLink}
        >
          <div>Home</div>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
