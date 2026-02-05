import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '$constants';
import { useAuth } from '$context';
import { LoginForm, LoginHeader } from './components';
import classes from './Login.module.css';

export const Login = () => {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && token) navigate(ROUTES.PRODUCTS, { replace: true });
  }, [token, isLoading, navigate]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
};
