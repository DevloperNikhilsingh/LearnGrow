const STORAGE_KEY = 'lg_certificate_requests';

/** Read all requests from localStorage (private helper) */
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save all requests to localStorage (private helper) */
function writeAll(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export async function createCertificateRequest({ userId, studentName, studentEmail, courseId, courseName, answers, questions, passingScore,}){
  
    const totalQuestions = questions.length;
  const correctCount = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0),
    0
  );
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= passingScore;

  const newRequest = {
    id: Date.now(),
    userId,
    studentName,
    studentEmail,
    courseId,
    courseName,
    correctCount,
    totalQuestions,
    scorePercent,
    passed,
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    rejectReason: null,
  };

  const all = readAll();
  all.push(newRequest);
  writeAll(all);

  return Promise.resolve(newRequest);
}

/** Get every certificate request (for the admin tab) */
export async function getAllCertificateRequests() {
  return Promise.resolve(readAll());
}

/** Get only pending requests (for an admin badge/count) */
export async function getPendingCertificateRequests() {
  return Promise.resolve(readAll().filter((r) => r.status === 'pending'));
}

/** Get a specific user's requests (for their Certificates tab) */
export async function getUserCertificateRequests(userId) {
  return Promise.resolve(readAll().filter((r) => r.userId === userId));
}

/** Get only a user's APPROVED requests (what actually shows as a certificate) */
export async function getUserApprovedCertificates(userId) {
  return Promise.resolve(
    readAll().filter((r) => r.userId === userId && r.status === 'approved')
  );
}

/** Admin approves a request */
export async function approveCertificateRequest(requestId) {
  const all = readAll();
  const updated = all.map((r) =>
    r.id === requestId
      ? { ...r, status: 'approved', reviewedAt: new Date().toISOString(), rejectReason: null }
      : r
  );
  writeAll(updated);
  return Promise.resolve(updated.find((r) => r.id === requestId));
}

/** Admin rejects a request (optional reason) */
export async function rejectCertificateRequest(requestId, reason = '') {
  const all = readAll();
  const updated = all.map((r) =>
    r.id === requestId
      ? { ...r, status: 'rejected', reviewedAt: new Date().toISOString(), rejectReason: reason }
      : r
  );
  writeAll(updated);
  return Promise.resolve(updated.find((r) => r.id === requestId));
}

/** Check if a user already has a request (pending/approved/rejected) for a course */
export async function getExistingRequestForCourse(userId, courseId) {
  const all = readAll();
  return Promise.resolve(
    all.find((r) => r.userId === userId && r.courseId === courseId) || null
  );
}