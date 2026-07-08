import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { TaskItem, User } from '../types';

export async function saveUserProfile(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan || 'free',
      theme: 'auto',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfile(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        plan: data.plan || 'free',
        storageUsed: 9.4,
        storageLimit: 20.0,
        creditsUsed: 1450,
        creditsLimit: 5000,
      } as User;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveTaskToFirestore(task: TaskItem, userId: string): Promise<void> {
  const docId = task.id.startsWith(userId) ? task.id : `${userId}_${task.id}`;
  const path = `tasks/${docId}`;
  try {
    await setDoc(doc(db, 'tasks', docId), {
      id: docId,
      title: task.title,
      completed: task.completed,
      userId: userId,
      dueDate: task.dueDate || 'Due tomorrow',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTaskFromFirestore(taskId: string, userId: string): Promise<void> {
  const docId = taskId.startsWith(userId) ? taskId : `${userId}_${taskId}`;
  const path = `tasks/${docId}`;
  try {
    await deleteDoc(doc(db, 'tasks', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchUserTasks(userId: string): Promise<TaskItem[]> {
  const path = 'tasks';
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const tasks: TaskItem[] = [];
    querySnapshot.forEach((docRef) => {
      const data = docRef.data();
      tasks.push({
        id: data.id,
        title: data.title,
        completed: data.completed,
        dueDate: data.dueDate,
        assignedTo: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
      });
    });
    return tasks;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
