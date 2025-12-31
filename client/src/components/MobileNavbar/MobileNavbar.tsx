import { NavLink } from "react-router-dom"
import { RiTimerLine, RiTimerFill } from "react-icons/ri";
import { MdOutlineQueue, MdQueue } from "react-icons/md";
import { MdPersonOutline, MdPerson } from "react-icons/md";
import styles from './MobileNavbar.module.scss';

export const MobileNavbar = () => {
    return (
        <nav className={styles['mobile-navbar']}>
            <NavLink to="/timers" className={styles['nav-item']} end>
                {({ isActive }) => (
                    <>
                        {isActive ? <RiTimerFill className={styles['icon']} /> : <RiTimerLine className={styles['icon']} />}
                        <span className={styles['label']}>Timers</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/" className={styles['nav-item']} end>
                {({ isActive }) => (
                    <>
                        {isActive ? <MdQueue className={styles['icon']} /> : <MdOutlineQueue className={styles['icon']} />}
                        <span className={styles['label']}>Queue</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/profile" className={styles['nav-item']} end>
                {({ isActive }) => (
                    <>
                        {isActive ? <MdPerson className={styles['icon']} /> : <MdPersonOutline className={styles['icon']} />}
                        <span className={styles['label']}>Profile</span>
                    </>
                )}
            </NavLink>
        </nav>
    )
}