/**
 * api/userService.js
 * -------------------------------------------------
 * User/student-related service.
 * Currently: reads from localStorage & mock data.
 * Laravel swap: replace with apiFetch('/api/user/...')
 * -------------------------------------------------
 */

// import { apiFetch } from './config';
import { getCurrentUser } from './authService';
import courses from '../data/courses.json';
import liveClasses from '../data/liveClasses.json';

/** Get enrolled courses for the current user */
export async function getEnrolledCourses() {
  const user = getCurrentUser();
  if (!user) return Promise.resolve([]);
  const enrolled = courses.filter((c) => user.enrolledCourses?.includes(c.id));
  return Promise.resolve(enrolled);
  // return apiFetch('/api/user/courses');
}

/** Get course progress for a specific course */
export async function getCourseProgress(courseId) {
  const user = getCurrentUser();
  if (!user) return Promise.resolve(0);
  return Promise.resolve(user.progress?.[courseId] ?? 0);
  // return apiFetch(`/api/user/courses/${courseId}/progress`);
}

/** Get live classes the user is enrolled in */
export async function getUserLiveClasses() {
  const user = getCurrentUser();
  if (!user) return Promise.resolve([]);
  const userLive = liveClasses.filter((lc) => user.enrolledCourses?.includes(lc.courseId));
  return Promise.resolve(userLive);
  // return apiFetch('/api/user/live-classes');
}

/** Enrol in a course (mock) */
export async function enrollCourse(courseId) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const updated = { ...user, enrolledCourses: [...(user.enrolledCourses || []), courseId], progress: { ...user.progress, [courseId]: 0 } };
  localStorage.setItem('lg_user', JSON.stringify(updated));
  return Promise.resolve(updated);
  // return apiFetch(`/api/user/courses/${courseId}/enrol`, { method: 'POST' });
}

/** Update lesson completion (mock) */
export async function updateProgress(courseId, progress) {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const updated = { ...user, progress: { ...user.progress, [courseId]: progress } };
  localStorage.setItem('lg_user', JSON.stringify(updated));
  return Promise.resolve(updated);
  // return apiFetch(`/api/user/courses/${courseId}/progress`, { method: 'PUT', body: JSON.stringify({ progress }) });
}
