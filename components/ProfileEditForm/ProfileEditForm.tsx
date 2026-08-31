'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { clsx } from 'clsx';
import { useId } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import { useState } from 'react';
import styles from './ProfileEditForm.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { User, BabyGender } from '@/types/types';
import { updateUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface ProfileEditFormProps {
  message: (mes: string, err: boolean) => void;

  user: User;
}

interface UpdateUser {
  name: string;
  gender?: BabyGender;
  dueDate?: string;
  email: string;
}

export default function ProfileEditForm({
  user,
  message,
}: ProfileEditFormProps) {
  const setUserStore = useAuthStore(s => s.setUser);
  const oldUser = user;
  const [isDateErr, setIsdateErr] = useState(false);
  const [isResBtn, setResBtn] = useState(true);
  const [submitBtn, setSubmitBtn] = useState(true);
  const [nameErr, setNameErr] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const queryClient = useQueryClient();
  const id = useId();
  const today = new Date();
  today.setDate(today.getDate() + 9);
  const maxDueDate = new Date();
  maxDueDate.setDate(maxDueDate.getDate() + 40 * 7);

  const createMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      const res = await updateUser(data);

      return res;
    },
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setSubmitBtn(true);
      setResBtn(true);
      setUserStore(res);
      message('Profile updated successfully', false);
    },
    onError: () => {
      message('An error occurred while saving the data', true);
      setSubmitBtn(false);
      handleReset();
    },
  });

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      gender: user.gender || 'unknown',
      dueDate: user.dueDate != undefined ? new Date(user.dueDate) : null,
    },
    onSubmit: values => {
      const data: UpdateUser = {
        name: values.name,
        email: values.email,
        gender: values.gender,
      };
      if (values.dueDate) {
        const currDate = values.dueDate.toISOString().slice(0, 10);
        data.dueDate = currDate;
      }
      if (data.name.length < 1 || data.name.length > 32) {
        setNameErr(true);
        return;
      } else {
        setNameErr(false);
      }
      if (!data.email.includes('@')) {
        setEmailError(true);
        return;
      } else {
        setEmailError(false);
      }
      if (isDateErr) {
        return;
      }
      createMutation.mutate(data);
    },
  });

  function validDate(date: Date | null) {
    if (!date) {
      return;
    }
    if (date < today || date > maxDueDate) {
      setIsdateErr(true);
      return false;
    } else {
      setIsdateErr(false);
      return true;
    }
  }

  function handleReset() {
    const oldDate =
      oldUser.dueDate != undefined ? new Date(oldUser.dueDate) : null;
    formik.setFieldValue('name', oldUser.name);
    formik.setFieldValue('email', oldUser.email);
    formik.setFieldValue('gender', oldUser.gender || 'unknown');
    formik.setFieldValue('dueDate', oldDate);
    setSubmitBtn(true);
    setIsdateErr(false);
    setNameErr(false);
    setEmailError(false);
    setResBtn(true);
  }

  function handleChangeName(event: React.ChangeEvent) {
    const elem = event.target as HTMLInputElement;
    const size = elem.value.length;
    if (size < 1 || size > 32) {
      setNameErr(true);
    } else {
      setNameErr(false);
    }
  }

  function handleChangeEmail(event: React.ChangeEvent) {
    const elem = event.target as HTMLInputElement;
    const isValid = elem.value.includes('@');
    if (!isValid) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className={styles.formBox}>
      <div className={styles.inputGroup}>
        <div className={styles.formGroup}>
          <label htmlFor={`${id}-name`} className={styles.label}>
            Ім`я
          </label>
          <input
            type="text"
            id={`${id}-name`}
            name="name"
            value={formik.values.name}
            onChange={data => {
              formik.handleChange(data);
              setSubmitBtn(false);
              setResBtn(false);
              handleChangeName(data);
            }}
            className={clsx(styles.input, nameErr && styles.inputError)}
            placeholder="Введіть ім'я"
          />
          {nameErr && (
            <span className={styles.errorMessage}>
              Must be between 1 and 32 characters
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${id}-email`} className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id={`${id}-email`}
            name="email"
            value={formik.values.email}
            onChange={data => {
              formik.handleChange(data);
              setSubmitBtn(false);
              setResBtn(false);
              handleChangeEmail(data);
            }}
            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            placeholder="Введіть email"
          />
          {emailError && (
            <span className={styles.errorMessage}>Invalid email</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${id}-gender`} className={styles.label}>
            Baby gender
          </label>
          <Select
            inputId={`${id}-gender`}
            name="gender"
            options={[
              { value: 'unknown', label: 'Оберіть стать' },
              { value: 'girl', label: 'Дівчинка' },
              { value: 'boy', label: 'Хлопчик' },
            ]}
            value={
              formik.values.gender
                ? {
                    value: formik.values.gender,
                    label:
                      formik.values.gender === 'girl'
                        ? 'Дівчинка'
                        : formik.values.gender === 'boy'
                          ? 'Хлопчик'
                          : 'Оберіть стать',
                  }
                : null
            }
            onChange={option => {
              if (option) {
                formik.setFieldValue('gender', option.value);
                setSubmitBtn(false);
                setResBtn(false);
              }
            }}
            styles={{
              control: base => ({
                ...base,
                backgroundColor: 'var(--opacity-neutral-darkest-5)',
                borderColor: 'transparent',
                borderWidth: '2px',
                borderRadius: '12px',
                padding: '0',
                minHeight: '40px',
                height: '40px',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-family)',
                color: 'var(--opacity-neutral-darkest-60)',
                cursor: 'pointer',
                outline: 'none',
              }),
              valueContainer: base => ({
                ...base,
                padding: '8px 12px',
                backgroundColor: 'transparent',
              }),
              input: base => ({
                ...base,
                color: 'var(--opacity-neutral-darkest-60)',
                fontFamily: 'var(--font-family)',
                margin: '0',
                padding: '0',
              }),
              singleValue: base => ({
                ...base,
                color: 'var(--opacity-neutral-darkest-60)',
              }),
              placeholder: base => ({
                ...base,
                color: 'var(--opacity-neutral-darkest-60)',
              }),
              menu: base => ({
                ...base,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                marginTop: '4px',
              }),
              option: (base, { isSelected, isFocused }) => ({
                ...base,
                backgroundColor: isSelected
                  ? 'var(--color-scheme-accent)'
                  : isFocused
                    ? '#f5f5f5'
                    : 'white',
                color: isSelected
                  ? 'white'
                  : 'var(--opacity-neutral-darkest-60)',
                padding: '8px 12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }),
              dropdownIndicator: base => ({
                ...base,
                padding: '0 8px',
                color: 'var(--opacity-neutral-darkest-60)',
              }),
              indicatorSeparator: () => ({
                display: 'none',
              }),
            }}
          />
        </div>

        <div className={clsx(styles.formGroup)}>
          <label className={styles.label}>Planned delivery date</label>
          <DatePicker
            selected={formik.values.dueDate}
            onChange={(date: Date | null) => {
              const isValid = validDate(date);
              setSubmitBtn(false);
              setResBtn(false);
              if (isValid) {
                formik.setFieldValue('dueDate', date);
              }
            }}
            wrapperClassName={clsx(styles.datepicker)}
            className={clsx(styles.datainput, isDateErr && styles.inputError)}
            dateFormat="dd.MM.yyyy"
            autoComplete="off"
          />
          {isDateErr && (
            <span className={styles.errorMessage}>Invalid date</span>
          )}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleReset}
          className={clsx(styles.btn, styles.btnReset)}
          disabled={isResBtn}
        >
          Reset Changes
        </button>
        <button
          type="submit"
          className={clsx(styles.btn, styles.btnSave)}
          disabled={submitBtn}
        >
          {createMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
