import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
    return <button {...props} className={`${styles.btn}`}>
        {children}
    </button>
}