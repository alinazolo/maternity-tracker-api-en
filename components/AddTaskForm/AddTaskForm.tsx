'use client';

import css from './AddTaskForm.module.css';
import 'react-datepicker/dist/react-datepicker.css';

import { useFormik } from 'formik';
import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import type { CreateTaskRequest, TaskResponse } from '@/types/types';
import { createTask } from '@/lib/api/clientApi';

interface AddTaskFormProps {
  onClose: () => void;
}

const today = new Date(Date.now()).toISOString().slice(0, 10);

export default function AddTaskForm({ onClose }: AddTaskFormProps) {
  const [inputDate, setInputDate] = useState(new Date(today));
  const id = useId();
  const [isErrText, setIsErrText] = useState(false);
  const [titleErr, setTitleErr] = useState('');
  const [isDateErr, setIsDateErr] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation<TaskResponse, Error, CreateTaskRequest>({
    mutationFn: async (data: CreateTaskRequest) => {
      const res = await createTask(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsFetching(false);
      onClose();
    },
    onError: error => {
      toast.error(error.message);
      setIsFetching(false);
    },
  });

  function changeText(event: React.ChangeEvent) {
    formik.handleChange(event);
    const elem = event.target as HTMLInputElement;
    const isBlank = elem.value === '';
    const isMin = elem.value.length < 1;
    const isMax = elem.value.length > 96;
    if (isBlank || isMin || isMax) {
      if (isBlank) setTitleErr('This field is required');
      if (isMin) setTitleErr('Must be at least 1 character.');
      if (isMax) setTitleErr('Maximum 96 characters.');
      setIsErrText(true);
    } else {
      setIsErrText(false);
    }
  }

  function changeDate(myDate: Date | null) {
    let isErr;
    if (myDate != null) {
      setInputDate(myDate);
      isErr = myDate.getDate() <= new Date(today).getDate();
    }
    if (isErr) {
      setIsDateErr(true);
    } else {
      setIsDateErr(false);
    }
    const currDate = myDate?.toISOString().slice(0, 10);
    formik.setFieldValue('date', currDate);
  }

  const formik = useFormik<CreateTaskRequest>({
    initialValues: { title: '', date: today },
    onSubmit: values => {
      if (values.title === '') {
        setTitleErr('This field is required');
        setIsErrText(true);
        return;
      } else if (values.title.length < 1) {
        setTitleErr('Must be at least 1 character.');
        setIsErrText(true);
        return;
      } else if (values.title.length > 96) {
        setTitleErr('Maximum 96 characters.');
        setIsErrText(true);
        return;
      } else if (new Date(values.date).getDate() <= new Date(today).getDate()) {
        setIsDateErr(true);
        return;
      }
      createMutation.mutate(values);
      setIsFetching(true);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.taskForm}>
      <Toaster position="top-right" />
      <div className={css.formGroup}>
        <label className={css.text} htmlFor={`title-${id}`}>
          Task name
        </label>
        <input
          onChange={changeText}
          id={`title-${id}`}
          name="title"
          className={clsx(css.input, isErrText && css.inputInvalid)}
          type="text"
          placeholder="Take vitamins"
        />
        {isErrText && <span className={css.errMess}>{titleErr}</span>}
      </div>
      <div className={css.formGroup}>
        <label className={css.text}>Date</label>
        <DatePicker
          selected={inputDate}
          onChange={(date: Date | null) => changeDate(date)}
          wrapperClassName={clsx(css.input, css.datepicker)}
          className={clsx(css.datainput, isDateErr && css.inputInvalid)}
          dateFormat="dd.MM.yyyy"
          autoComplete="off"
        />
        {isDateErr && (
          <span className={css.errMess}>The date must be at least tomorrow</span>
        )}
      </div>
      <button className={css.btn} type="submit" disabled={isFetching}>
        {createMutation.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
