import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { LoginFormValues } from '$schemas';
import classes from './LoginPasswordField.module.css';

interface LoginPasswordFieldProps {
  onClearApiError: () => void;
}

export const LoginPasswordField = ({ onClearApiError }: LoginPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, formState } = useFormContext<LoginFormValues>();
  const { errors, isSubmitting } = formState;

  return (
    <div className={classes.field}>
      <label htmlFor="password" className={classes.label}>
        Пароль
      </label>
      <div className={`${classes.inputWrap} ${classes.hasRightBtn}`}>
        {errors.password && (
          <span id="login-password-error" className={classes.tooltipPopover} role="alert">
            {errors.password.message}
          </span>
        )}
        <span className={classes.inputIcon} aria-hidden>
          <Lock size={20} color="#a6aab3" />
        </span>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { onChange: onClearApiError })}
          className={classes.inputWithIcon}
          autoComplete="current-password"
          disabled={isSubmitting}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        <button
          type="button"
          className={classes.eye}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <EyeOff size={20} color="#a6aab3" />
          ) : (
            <Eye size={20} color="#a6aab3" />
          )}
        </button>
      </div>
    </div>
  );
};
