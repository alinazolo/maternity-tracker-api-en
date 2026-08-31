'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import Select, { components, type OptionProps } from 'react-select';
import styles from './AddDiaryEntryForm.module.css';
import { createNote, updateNote, getEmotions } from '@/lib/api/clientApi';
import type { Emotion, Note } from '@/types/types';
import { useRouter } from 'next/navigation';

interface AddDiaryEntryFormProps {
  onSuccess: () => void;
  initialData?: Note | null;
}

export type FormValues = {
  title: string;
  description: string;
  emotions: string[];
};

const schema = Yup.object({
  title: Yup.string().required('Enter a title'),
  description: Yup.string().required('Enter text'),
  emotions: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Select an emotion')
    .required('Select an emotion'),
});

type OptionType = {
  value: string;
  label: string;
};

const CheckboxOption = (props: OptionProps<OptionType, true>) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 18, height: 18 }}>
          {props.isSelected ? (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="4" fill="#000" />
              <path
                d="M6 12l4 4 8-8"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <rect
                width="24"
                height="24"
                rx="4"
                fill="rgba(0, 0, 0, 0.05)"
                stroke="rgba(255, 255, 255, 0)"
              />
            </svg>
          )}
        </div>

        {props.label}
      </div>
    </components.Option>
  );
};

export default function AddDiaryEntryForm({
  initialData,
  onSuccess,
}: AddDiaryEntryFormProps) {
  const router = useRouter();
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const data = await getEmotions();
        setEmotions(data?.emotions || []);
      } catch {
        toast.error('Error fetching the list of emotions');
        setEmotions([]);
      }
    };

    fetchEmotions();
  }, []);

  const queryClient = useQueryClient();

  const emotionOptions = useMemo(() => {
    return emotions.map(e => ({
      value: e._id,
      label: e.title,
    }));
  }, [emotions]);

  const initialEmotions = useMemo(() => {
    if (!initialData?.emotions) return [];

    return initialData.emotions.map(e => (typeof e === 'string' ? e : e._id));
  }, [initialData]);

  return (
    <>
      <Toaster position="top-right" />
      <Formik<FormValues>
        enableReinitialize
        initialValues={{
          title: initialData?.title || '',
          description: initialData?.description || '',
          emotions: initialEmotions,
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              title: values.title,
              description: values.description,
              emotions: values.emotions,
            };

            if (initialData?._id) {
              await updateNote(initialData._id, payload);
            } else {
              await createNote(payload);
            }

            toast.success(initialData ? 'Updated' : 'Created');
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onSuccess();
            router.refresh();
          } catch {
            toast.error('Error saving the entry');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className={styles.form}>
            {/* Title */}
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              placeholder="Enter a title"
              className={styles.input}
            />
            <ErrorMessage
              name="title"
              component="div"
              className={styles.error}
            />

            {/* Emotions */}
            <label>Categories</label>
            <Select
              isMulti
              components={{
                IndicatorSeparator: () => null,
                Option: CheckboxOption,
              }}
              isClearable={false}
              options={emotionOptions}
              value={emotionOptions.filter(o =>
                values.emotions.includes(o.value)
              )}
              onChange={(
                selected: readonly { value: string; label: string }[] | null
              ) => {
                setFieldValue(
                  'emotions',
                  selected ? selected.map(s => s.value) : []
                );
              }}
              placeholder="Select emotions"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '48px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  width: '100%',
                  borderRadius: state.menuIsOpen ? '12px 12px 0 0' : '12px',
                  boxShadow: 'none',
                  border: state.menuIsOpen
                    ? '1px solid rgba(0, 0, 0, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0)',
                  '&:hover': {
                    border: '1px solid rgba(0, 0, 0, 0.15)',
                  },
                }),
                menu: base => ({
                  ...base,
                  backgroundColor: '#f2f2f2',
                  borderRadius: '0 0 12px 12px',
                  marginTop: '0',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderTop: 'none',
                }),
                option: (base, state) => ({
                  ...base,
                  color: '#000',
                  backgroundColor: state.isFocused
                    ? 'rgba(0, 0, 0, 0.05)'
                    : '#f2f2f2',
                  borderRadius: '8px',
                }),
                valueContainer: base => ({
                  ...base,
                  padding: '8px 12px',
                }),
                menuList: base => ({
                  ...base,
                  backgroundColor: '#f2f2f2',
                  maxHeight: '180px',
                  padding: '0',
                  scrollbarGutter: 'stable',

                  '::-webkit-scrollbar': {
                    margin: '8px 0',
                    width: '10px',
                  },

                  '::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    margin: '8px 0',
                    borderLeft: '2px solid transparent',
                    borderRight: '2px solid transparent',
                    backgroundClip: 'padding-box',
                  },

                  '::-webkit-scrollbar-thumb': {
                    background: '#ffcbd3',
                    borderRadius: '4px',
                    height: '56px',
                  },
                }),
                multiValueRemove: () => ({
                  display: 'none',
                }),
                multiValueLabel: base => ({
                  ...base,

                  color: '#000',
                  fontSize: '16px',
                  fontWeight: 400,
                }),
                multiValue: base => ({
                  ...base,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '100px',
                  padding: '4px 10px',
                  marginRight: '10px',
                  height: '32px',
                }),
              }}
            />
            <ErrorMessage
              name="emotions"
              component="div"
              className={styles.error}
            />

            {/* Text */}
            <label htmlFor="text">Entry</label>
            <Field
              as="textarea"
              id="text"
              name="description"
              placeholder="How are you feeling?"
              className={styles.textarea}
            />
            <ErrorMessage
              name="text"
              component="div"
              className={styles.error}
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.btn}
            >
              {isSubmitting
                ? 'Saving...'
                : initialData
                  ? 'Update'
                  : 'Save'}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
