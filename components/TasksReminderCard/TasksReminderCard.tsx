'use client';
import css from './TasksReminderCard.module.css';
import { useRouter } from 'next/navigation';
import type { Task } from '@/types/types';
import AddTaskModal from "@/components/AddTaskModal/AddTaskModal";
import { updateTask, getTasks } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

export default function TasksReminderCard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;

  const tasksQueryKey = ['tasks', user?._id];

    const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: tasksQueryKey,
    queryFn: getTasks,
    enabled: !!user,
    });

   const mutation = useMutation({
    mutationFn: (taskId: string) => updateTask(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });

      const previousTasks =
        queryClient.getQueryData<Task[]>(tasksQueryKey);

      queryClient.setQueryData<Task[]>(tasksQueryKey, (old = []) =>
        old.map((task) =>
          task._id === taskId
            ? { ...task, isDone: !task.isDone }
            : task
        )
      );

      return { previousTasks };
    },

    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });

  const handleToggleTask = (id: string) => {
    mutation.mutate(id);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      router.push('/register');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (<>
    <section className={css.card}>
      <div className={css.header}>
        <h2 className={css.title}>Important tasks</h2>
        <button className={css.addBtn} onClick={handleAddClick}>
          <svg className={css.addBtn} width={24} height={24}>
            <use href="/icons.svg#plus" />
          </svg>
        </button>
      </div>
      {tasks?.length === 0 ? (
        <div className={css.emptyState}>
          <p className={css.emptyText}>
            There are no tasks at the moment
          </p>
          <p className={css.emptyTextSeconde}>
            Create your first new task!
          </p>
          <button className={css.createBtn} onClick={handleAddClick}>
            Create task
          </button>
        </div>
      ) : (
        <ul className={css.list}>
          {tasks.map((task) => (
            <li key={task._id} className={css.item}>
              <label className={css.label}>
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={() => handleToggleTask(task._id)}
                  className={css.hiddenCheckbox}
                />
                <span className={css.customCheckbox}>
                  <svg width={12} height={12}>
                    <use href="/icons.svg#checkbox" />
                  </svg>
                </span>
                <span>
                  {task.date && (
                    <span className={css.date}>{task.date}</span>
                  )}
                  <span className={task.isDone ? css.completed : ''}>{task.title}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
    {isModalOpen && (
        <AddTaskModal onClose={handleCloseModal} />
      )}
  </>
  );
}
