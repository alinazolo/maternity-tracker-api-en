'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import css from './LoginForm.module.css';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import { login, getMe } from '@/lib/api/clientApi';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import { isAxiosError } from 'axios';
import { type LoginRequest as LoginFormValues } from '@/types/types';

const LoginFormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required field'),
  password: Yup.string().required('Required field'),
});

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export default function LoginForm() {
  const router = useRouter();
  const fieldId = useId();
  const setUser = useAuthStore(state => state.setUser);

  return (
    <div className={css.loginPage}>
      <Toaster position="top-right" />
      <div className={css.logo}>
        <Link href="/">
          <svg className={css.logoIcon} width={30} height={30}>
            <use href="/icons.svg#logo" />
          </svg>
          <svg className={css.logoLeleka} width={60} height={13}>
            <use href="/icons.svg#icon-leleka" />
          </svg>
        </Link>
      </div>
      <div className={css.center}>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginFormSchema}
          onSubmit={async (
            values: LoginFormValues,
            {
              setSubmitting,
              resetForm,
              // setErrors,
            }: FormikHelpers<LoginFormValues>
          ) => {
            try {
              const data = { email: values.email, password: values.password };
              const res = await login(data);
              if (res) {
                const user = await getMe();
                if (user) {
                  setUser(user);
                }
                router.push('/');
                resetForm();
              }
            } catch (error: unknown) {
              if (isAxiosError(error)) {
                toast.error('Invalid email or password');
              } else {
                toast.error('Something went wrong');
              }
              // setErrors({
              //   password: 'Invalid email or password',
              // });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={css.form}>
              <h1 className={css.title}>Sign in</h1>
              <div className={css.fieldWrapper}>
                <Field
                  id={`${fieldId}-email`}
                  type="email"
                  name="email"
                  className={`${css.input} ${errors.email && touched.email ? css.inputError : ''}`}
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  className={css.error}
                  component="span"
                />
              </div>
              <div className={css.fieldWrapper}>
                <Field
                  id={`${fieldId}-password`}
                  type="password"
                  name="password"
                  className={`${css.input} ${errors.password && touched.password ? css.inputError : ''}`}
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  className={css.error}
                  component="span"
                />
              </div>
              <button type="submit" disabled={isSubmitting} className={css.btn}>
                {isSubmitting ? 'Loading...' : 'Sign in'}
              </button>

              <p className={css.register}>
                Do you have an account?{' '}
                <span>
                  <Link href="/register">Sign up</Link>
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
