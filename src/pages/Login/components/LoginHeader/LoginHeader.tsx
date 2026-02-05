import { memo } from 'react';
import { LogIn } from 'lucide-react';
import classes from './LoginHeader.module.css';

const LoginHeaderComponent = () => (
  <div className={classes.header}>
    <LogIn className={classes.icon} size={40} aria-hidden />
    <h1 className={classes.title}>Добро пожаловать!</h1>
    <p className={classes.subtitle}>Пожалуйста, авторизируйтесь</p>
  </div>
);

export const LoginHeader = memo(LoginHeaderComponent);
