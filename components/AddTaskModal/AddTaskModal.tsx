'use client';

import css from './AddTaskModal.module.css';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import Modal from '../Modal/Modal';

interface TaskModalProps {
  onClose: () => void;
}

export default function AddTaskModal({ onClose }: TaskModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className={css.box}>
        <p className={css.title}>New Task</p>
        <AddTaskForm onClose={onClose}/>
      </div>
    </Modal>
  );
}
