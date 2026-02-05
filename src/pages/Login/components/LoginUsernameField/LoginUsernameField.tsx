import { Mail, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { LoginFormValues } from '$schemas';
import classes from './LoginUsernameField.module.css';

interface LoginUsernameFieldProps {
  onClearApiError: () => void;
}

export const LoginUsernameField = ({ onClearApiError }: LoginUsernameFieldProps) => {
  const {
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<LoginFormValues>();

  const username = watch('username');

  const handleClear = () => {
    setValue('username', '');
    clearErrors('username');
    onClearApiError();
  };

  return (
    <div className={classes.field}>
      <label htmlFor="username" className={classes.label}>
        Почта
      </label>
      <div className={`${classes.inputWrap} ${classes.hasRightBtn}`}>
        {errors.username && (
          <span id="login-email-error" className={classes.tooltipPopover} role="alert">
            {errors.username.message}
          </span>
        )}
        <span className={classes.inputIcon} aria-hidden>
          <Mail size={20} color="#6b7280" />
        </span>
        <input
          id="username"
          type="text"
          {...register('username', { onChange: onClearApiError })}
          className={classes.inputWithIcon}
          autoComplete="username"
          disabled={isSubmitting}
          aria-invalid={errors.username ? 'true' : 'false'}
          aria-describedby={errors.username ? 'login-email-error' : undefined}
        />
        {username ? (
          <button
            type="button"
            className={classes.clearBtn}
            onClick={handleClear}
            aria-label="Очистить почту"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
};
