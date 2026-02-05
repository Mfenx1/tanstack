import { useFormContext } from 'react-hook-form';
import type { LoginFormValues } from '$schemas';
import classes from './LoginRememberCheckbox.module.css';

export const LoginRememberCheckbox = () => {
  const { register, formState } = useFormContext<LoginFormValues>();

  return (
    <div className={classes.checkboxWrap}>
      <input
        id="remember"
        type="checkbox"
        {...register('rememberMe')}
        className={classes.checkbox}
        disabled={formState.isSubmitting}
      />
      <label htmlFor="remember" className={classes.checkboxLabel}>
        Запомнить данные
      </label>
    </div>
  );
};
