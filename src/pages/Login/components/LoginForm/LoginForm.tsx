import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaultRememberMe } from '$utils';
import { useAuth } from '$context';
import { loginSchema, type LoginFormValues } from '$schemas';
import {
  LoginPasswordField,
  LoginRememberCheckbox,
  LoginSubmitSection,
  LoginUsernameField,
} from '../index';
import classes from './LoginForm.module.css';

export const LoginForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuth();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: getDefaultRememberMe(),
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    const err = await login(data.username, data.password, data.rememberMe);
    if (err) setApiError(err);
  };

  const onClearApiError = useCallback(() => setApiError(null), []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={classes.form}>
        <LoginUsernameField onClearApiError={onClearApiError} />
        <LoginPasswordField onClearApiError={onClearApiError} />
        <LoginRememberCheckbox />
        <LoginSubmitSection
          apiError={apiError}
          isSubmitting={methods.formState.isSubmitting}
        />
      </form>
    </FormProvider>
  );
};
