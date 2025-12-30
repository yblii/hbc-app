import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { Button } from '../Button';
import { RiTimerLine } from "react-icons/ri";
import { MdOutlineQueue } from "react-icons/md";
import { MdOutlinePeople } from "react-icons/md";

export const Sidebar = () => {
    return (
    <div className={`${styles.sidebar}`}>
      <div className={`${styles.logo}`}>Husky Badminton</div>
      
      <nav>
        <NavLink to="/" end>
           <RiTimerLine />COURTS
        </NavLink>
        <NavLink to="/" end>
           <MdOutlineQueue />QUEUE
        </NavLink>
        <NavLink to="/" end>
           <MdOutlinePeople />MEMBERS
        </NavLink>
      </nav>

      <div className={`${styles['sidebar-footer']}`}>
        <Button>Log Out</Button>
      </div>
    </div>
  );
}