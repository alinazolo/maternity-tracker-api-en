'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import css from './RegisterForm.module.css';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import { register } from '@/lib/api/clientApi';
import { isAxiosError } from 'axios';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';
import type { RegisterRequest, User } from '@/types/types';

const RegisterFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required field')
    .max(32, 'Maximum 32 characters'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required field')
    .max(64, 'Maximum 64 characters'),
  password: Yup.string()
    .required('Required field')
    .min(8, 'Minimum 8 characters')
    .max(128, 'Maximum 128 characters'),
});

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
};

type RegisterFormValues = RegisterRequest;

export default function RegisterForm() {
  const router = useRouter();
  const fieldId = useId();
  const setUser = useAuthStore(state => state.setUser);

  return (
    <div className={css.page}>
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
          validationSchema={RegisterFormSchema}
          onSubmit={async (
            values: RegisterFormValues,
            {
              setSubmitting,
              resetForm,
              setErrors,
            }: FormikHelpers<RegisterFormValues>
          ) => {
            try {
              const user: User = await register(values);
              if (!user) {
                toast.error('Something went wrong');
              } else {
                setUser(user);
                resetForm();
                router.push('/edit');
              }
            } catch (error: unknown) {
              if (isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message || 'Registration error'
                );
              } else {
                toast.error('Something went wrong');
              }
              setErrors({
                password: 'A user with this email already exists',
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={css.form}>
              <h1 className={css.title}>Registration</h1>

              <label htmlFor={`${fieldId}-name`} className={css.label}>
                Name*
              </label>
              <div className={css.fieldWrapper}>
                <Field
                  id={`${fieldId}-name`}
                  type="text"
                  name="name"
                  className={`${css.input} ${errors.name && touched.name ? css.inputError : ''}`}
                  placeholder="Your name"
                />
                <ErrorMessage
                  name="name"
                  className={css.error}
                  component="span"
                />
              </div>
              <label htmlFor={`${fieldId}-email`} className={css.label}>
                Email*
              </label>
              <div className={css.fieldWrapper}>
                <Field
                  id={`${fieldId}-email`}
                  type="email"
                  name="email"
                  className={`${css.input} ${errors.email && touched.email ? css.inputError : ''}`}
                  placeholder="hello@leleka.com"
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  className={css.error}
                  component="span"
                />
              </div>
              <label htmlFor={`${fieldId}-password`} className={css.label}>
                Password*
              </label>
              <div className={css.fieldWrapper}>
                <Field
                  id={`${fieldId}-password`}
                  type="password"
                  name="password"
                  className={`${css.input} ${errors.password && touched.password ? css.inputError : ''}`}
                  placeholder="********"
                  autoComplete="new-password"
                />
                <ErrorMessage
                  name="password"
                  className={css.error}
                  component="span"
                />
              </div>
              <button type="submit" disabled={isSubmitting} className={css.btn}>
                {isSubmitting ? 'Loading...' : 'Sign up'}
              </button>

              <p className={css.register}>
                Already have an account?{' '}
                <span>
                  <Link href="/login">Sign in</Link>
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
