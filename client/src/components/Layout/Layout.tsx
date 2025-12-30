// Layout.js
import { Outlet } from 'react-router-dom'; // Import Outlet
import { Sidebar } from '../Sidebar';
import { MobileHeader } from '../MobileHeader';
import { MobileNavbar } from '../MobileNavbar';
import './Layout.css'; 

const Layout = () => {
  return (
    <div className="app-container">
      <aside className="desktop-sidebar">
        <Sidebar />
      </aside>

      <header className="mobile-top">
        <MobileHeader />
      </header>

      <main className="main-content">
        {/* The child page will load here automatically */}
        <Outlet />  
      </main>

      <nav className="mobile-bottom">
        <MobileNavbar />
      </nav>
    </div>
  );
};

export default Layout;