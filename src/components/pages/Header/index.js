/* eslint-disable max-len */
import {NavLink} from 'react-router-dom';
import styles from './styles.module.scss';

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
