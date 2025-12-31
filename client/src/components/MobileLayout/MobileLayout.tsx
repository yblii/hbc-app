// Layout.js
import { Outlet } from 'react-router-dom';
import styles from './MobileLayout.module.scss'; 
import { MobileNavbar } from '../MobileNavbar';

export const MobileLayout = () => {
  return (
    <div className={styles['app-container']}>
      <main className={styles['main-content']}>
        <Outlet />  
      </main>
      <MobileNavbar />
    </div>
  );
};