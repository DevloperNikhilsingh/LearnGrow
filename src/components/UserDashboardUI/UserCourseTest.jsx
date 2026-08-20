import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Clock, FileCheck, CheckCircle2, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import courseTests from '../../data/courseTest';
import { getCourseBySlug } from '../../services/courseService';
import { getCourseProgress } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';
import { createCertificateRequest } from '../../services/CertificateService';


export default function UserCourseTest() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false); 
  const [submitted, setSubmitted] = useState(false); 
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  
  const [result, setResult] = useState(null);

  const test = courseTests[slug];

  useEffect(() => {
    getCourseBySlug(slug).then(async (data) => {
      if (!data) {
        navigate('/dashboard');
        return;
      }
      setCourse(data);

      const progress = await getCourseProgress(data.id);
      if (progress < 100) {
        setBlocked(true);
      }
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (blocked || !test) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-muted/10">
          <FileCheck size={26} className="text-muted" />
        </div>
        <h2 className="text-xl font-bold text-[#1F1F1F] mb-2">
          {blocked ? 'Test not available yet' : 'No test found for this course'}
        </h2>
        <p className="text-muted max-w-sm mb-6">
          {blocked
            ? "You need to complete all lessons before you can take the final test."
            : "This course doesn't have a test set up yet."}
        </p>
        <Link
          to={`/course/${slug}`}
          className="btn-primary px-6 py-2.5 rounded-btn font-semibold text-sm"
        >
          Back to course
        </Link>
      </div>
    );
  }

  const questions = test.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (optionId) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const goNext = () => {
    if (!isLastQuestion) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // --- Submit flow ---
  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
  setShowSubmitConfirm(false);
  setSubmitting(true);

  const user = getCurrentUser();
  await createCertificateRequest({
    userId: user.id,
    studentName: user.name,
    studentEmail: user.email,
    courseId: course.id,
    courseName: course.title,
    answers,
    questions,
    passingScore: test.passingScore,
  });
};

  const cancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  // --- Exit flow ---
  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    // TODO: optionally send partial `answers` to backend as an early/forced submit here.
    navigate(DASHBOARD_MY_COURSES);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  // --- Shared confirm modal ---
  const ConfirmModal = ({ icon, title, message, cancelLabel, confirmLabel, onCancel, onConfirm, danger }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm bg-white rounded-lg p-6 text-center"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
            danger ? 'bg-red-50' : 'bg-primary/10'
          }`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-lg text-[#1F1F1F] mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-btn font-semibold text-sm border border-border text-[#1F1F1F] hover:bg-surface transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-btn font-semibold text-sm text-white transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // --- Processing screen: submitted, waiting for scorecard ---
  if (submitting) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Helmet>
          <title>Test submitted | {course.title}</title>
        </Helmet>

        <header className="bg-navy text-white h-16 flex items-center px-4 sm:px-6 flex-shrink-0 shadow-md">
          <span className="text-white/70 flex items-center gap-1">
            <FileCheck size={20} /> <span className="font-medium">{test.title}</span>
          </span>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white border border-border rounded-lg p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-success/10">
              <CheckCircle2 size={30} className="text-success" />
            </div>

            <h2 className="text-xl font-bold text-[#1F1F1F] mb-1">Test submitted successfully</h2>
            <p className="text-muted mb-8">
              Your answers have been recorded. Please wait while we prepare your scorecard — it'll be available soon.
            </p>

            <Link
              to="/dashboard"
              className="text-sm p-2 bg-blue-500 rounded-md text-white font-semibold transition-colors"
            >
              Back to My Courses
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- Score screen (kept for later, once backend scoring exists) ---
  if (submitted && result) {
    const { correctCount, scorePercent, passed } = result;
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Helmet>
          <title>Test result | {course.title}</title>
        </Helmet>

        <header className="bg-navy text-white h-16 flex items-center px-4 sm:px-6 flex-shrink-0 shadow-md">
          <Link to={DASHBOARD_MY_COURSES} className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
            <ChevronLeft size={20} /> <span className="font-medium">Back to My Courses</span>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white border border-border rounded-lg p-8 text-center"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-success/10' : 'bg-red-50'
              }`}
            >
              {passed ? (
                <CheckCircle2 size={30} className="text-success" />
              ) : (
                <XCircle size={30} className="text-red-500" />
              )}
            </div>

            <h2 className="text-xl font-bold text-[#1F1F1F] mb-1">
              {passed ? "You've passed!" : 'Not quite there'}
            </h2>
            <p className="text-muted mb-6">
              {passed
                ? "Your certificate is on its way. Great work."
                : `You need ${test.passingScore}% to pass. Give it another go.`}
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <p className="text-3xl font-bold text-[#1F1F1F]">{scorePercent}%</p>
                <p className="text-xs text-muted mt-1">Score</p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div>
                <p className="text-3xl font-bold text-[#1F1F1F]">
                  {correctCount}
                  <span className="text-muted text-lg">/{totalQuestions}</span>
                </p>
                <p className="text-xs text-muted mt-1">Correct</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {passed ? (
                <Link
                  to={DASHBOARD_MY_COURSES}
                  className="btn-primary px-6 py-2.5 rounded-btn font-semibold text-sm"
                >
                  Back to My Courses
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setAnswers({});
                    setCurrentIndex(0);
                    setResult(null);
                    setSubmitted(false);
                  }}
                  className="btn-primary px-6 py-2.5 rounded-btn font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> Retake test
                </button>
              )}
              <Link
                to={DASHBOARD_MY_COURSES}
                className="text-sm text-muted hover:text-[#1F1F1F] transition-colors"
              >
                Exit to My Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Helmet>
        <title>{test.title} | {course.title}</title>
      </Helmet>

      {/* Top bar */}
      <header className="bg-navy text-white h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-md">
        <button
          onClick={handleExitClick}
          className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={20} /> <span className="hidden sm:inline font-medium">Exit test</span>
        </button>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Clock size={16} />
          <span>{test.durationMinutes} min</span>
        </div>
      </header>

      <div className="flex-1 flex justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileCheck size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted">Final assessment</p>
              <h1 className="font-bold text-[#1F1F1F] text-lg leading-tight">{test.title}</h1>
            </div>
          </div>

          {/* Segmented progress */}
          <div className="flex gap-1 mb-6">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`h-1 flex-1 rounded-full ${
                  i < currentIndex
                    ? 'bg-success'
                    : i === currentIndex
                    ? 'bg-primary'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-muted mb-1">
            Question {currentIndex + 1} of {totalQuestions}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <h2 className="text-lg font-semibold text-[#1F1F1F] leading-relaxed mb-6">
                {currentQuestion.question}
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-white'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          isSelected ? 'bg-primary text-white' : 'bg-surface text-muted'
                        }`}
                      >
                        {letter}
                      </span>
                      <span
                        className={`text-sm flex-1 ${
                          isSelected ? 'text-[#1F1F1F] font-medium' : 'text-[#1F1F1F]'
                        }`}
                      >
                        {opt.text}
                      </span>
                      {isSelected && <Check size={18} className="text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-btn font-semibold text-sm border border-border ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'text-[#1F1F1F] hover:bg-white'
              }`}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span className="text-xs text-muted">{answeredCount}/{totalQuestions} answered</span>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitClick}
                className="btn-primary px-6 py-2.5 rounded-btn font-semibold text-sm"
              >
                Submit test
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-5 py-2.5 rounded-btn font-semibold text-sm btn-primary"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <ConfirmModal
            icon={<FileCheck size={22} className="text-primary" />}
            title="Submit the test?"
            message="Once submitted, you won't be able to change your answers. Are you sure you want to submit?"
            cancelLabel="Cancel"
            confirmLabel="Yes, submit"
            onCancel={cancelSubmit}
            onConfirm={confirmSubmit}
          />
        )}
      </AnimatePresence>

      {/* Exit confirmation modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <ConfirmModal
            icon={<AlertTriangle size={22} className="text-red-500" />}
            title="Leave the test?"
            message={`If you exit now, your test will be submitted as-is with only ${answeredCount}/${totalQuestions} question(s) answered. This can't be undone.`}
            cancelLabel="Stay"
            confirmLabel="Exit & submit"
            onCancel={cancelExit}
            onConfirm={confirmExit}
            danger
          />
        )}
      </AnimatePresence>
    </div>
  );
}