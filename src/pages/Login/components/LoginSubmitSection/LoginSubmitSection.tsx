import { memo } from 'react';
import { Loader } from '$components';
import classes from './LoginSubmitSection.module.css';

interface LoginSubmitSectionProps {
  apiError: string | null;
  isSubmitting: boolean;
}

const LoginSubmitSectionComponent = ({ apiError, isSubmitting }: LoginSubmitSectionProps) => (
  <>
    <div className={classes.submitWrap}>
      {apiError && (
        <span className={classes.tooltipPopover} role="alert">
          {apiError}
        </span>
      )}
      <button type="submit" className={classes.submit} disabled={isSubmitting}>
        {isSubmitting ? <Loader size="sm" /> : 'Войти'}
      </button>
    </div>
    <p className={classes.separator}>или</p>
    <p className={classes.register}>
      Нет аккаунта? <span className={classes.registerLink}>Создать</span>
    </p>
  </>
);

LoginSubmitSectionComponent.displayName = 'LoginSubmitSection';

export const LoginSubmitSection = memo(LoginSubmitSectionComponent);
