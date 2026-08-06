/**
 * services/adminService.js
 * -------------------------------------------------
 * Admin-related service.
 * Currently: mock in-memory operations.
 * -------------------------------------------------
 */

import { mockCourses } from './courseService';
import instructorsData from '../data/instructors';
import liveClassesData from '../data/liveClasses';

/** Get admin overview stats */
export async function getAdminStats() {
  return Promise.resolve({
    totalCourses: mockCourses.length,
    totalStudents: 73250,
    totalRevenue: 4280000,
    activeLiveClasses: liveClassesData.filter((lc) => lc.isActive).length,
  });
}

export const getCourseById = (id) => {
  const course = mockCourses.find((c) => c.id === Number(id));
  return Promise.resolve(course);
};

export const updateCourse = (id, data) => {
  const index = mockCourses.findIndex((c) => c.id === Number(id));
  if (index !== -1) {
    mockCourses[index] = { ...mockCourses[index], ...data };
    return Promise.resolve(mockCourses[index]);
  }
  return Promise.reject(new Error('Course not found'));
};

/** Get all courses for admin table */
export async function getAdminCourses() {
  return Promise.resolve([...mockCourses]);
}

/** Delete a course (mock) */
export async function deleteCourse(courseId) {
  const index = mockCourses.findIndex((c) => c.id === courseId);
  if (index !== -1) mockCourses.splice(index, 1);
  return Promise.resolve({ success: true });
}

/** Add a new course (mock) */
export async function addCourse(courseData) {
  const newCourse = { id: Date.now(), ...courseData };
  mockCourses.push(newCourse);
  return Promise.resolve(newCourse);
}

/**
 * Add a student review to a course and recalculate rating + reviewCount (mock).
 * Mutates mockCourses in-place so all consumers of getCourseBySlug() see the update.
 */
export function updateCourseReviews(courseId, review) {
  const course = mockCourses.find((c) => c.id === courseId);
  if (!course) return;

  // Ensure reviews array exists
  if (!Array.isArray(course.reviews)) course.reviews = [];

  course.reviews.push(review);

  // Recalculate average rating and review count
  const total = course.reviews.reduce((sum, r) => sum + r.rating, 0);
  course.reviewCount = course.reviews.length;
  course.rating = Math.round((total / course.reviewCount) * 10) / 10;
}

/** Get all students (mock) */
export async function getStudents() {
  return Promise.resolve([
    { id: 1, name: 'Nikhil Sharma', email: 'student@learngrow.in', enrolledCourses: 3, joinedAt: '2025-08-10' },
    { id: 2, name: 'Priya Gupta', email: 'priya@example.com', enrolledCourses: 2, joinedAt: '2025-09-15' },
    { id: 3, name: 'Rahul Mehta', email: 'rahul@example.com', enrolledCourses: 1, joinedAt: '2025-10-01' },
    { id: 4, name: 'Sonal Desai', email: 'sonal@example.com', enrolledCourses: 4, joinedAt: '2025-11-12' },
    { id: 5, name: 'Arjun Das', email: 'arjun@example.com', enrolledCourses: 2, joinedAt: '2025-12-05' },
  ]);
}

/** Get all live classes for admin */
export async function getAdminLiveClasses() {
  return Promise.resolve(liveClassesData);
}

/** Get all instructors */
export async function getInstructors() {
  return Promise.resolve(instructorsData);
}
