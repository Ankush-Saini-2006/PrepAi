import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  startInterview,
  submitAnswer,
  completeInterview,
  resetActiveInterview,
} from "../../features/interview/interviewSlice";
import Button from "../../components/common/Button";

const MockInterviewPage = () => {
  const dispatch = useDispatch();
  const { activeInterview, loading, submitting } = useSelector((state) => state.interview);
  const [form, setForm] = useState({ role: "", type: "mixed", difficulty: "medium" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const handleStart = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error("Please enter a target role");

    const result = await dispatch(startInterview(form));
    if (startInterview.fulfilled.match(result)) {
      setCurrentIndex(0);
      setAnswer("");
      toast.success("Interview started! Good luck.");
    } else {
      toast.error(result.payload || "Failed to start interview");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return toast.error("Please write an answer first");

    const result = await dispatch(
      submitAnswer({ interviewId: activeInterview._id, questionIndex: currentIndex, answer })
    );
    if (submitAnswer.fulfilled.match(result)) {
      toast.success("Feedback received!");
    } else {
      toast.error(result.payload || "Failed to submit answer");
    }
  };

  const handleNext = () => {
    setAnswer("");
    setCurrentIndex((i) => i + 1);
  };

  const handleComplete = async () => {
    const result = await dispatch(completeInterview(activeInterview._id));
    if (completeInterview.fulfilled.match(result)) {
      toast.success("Interview completed!");
    }
  };

  if (!activeInterview) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Mock Interview</h1>
          <p className="text-sm text-gray-500">
            Practice real interview questions and get instant AI feedback.
          </p>
        </div>

        <form onSubmit={handleStart} className="card max-w-lg space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Target Role</label>
            <input
              className="input-field"
              placeholder="e.g. Backend Developer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
              <select
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="mixed">Mixed</option>
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
                <option value="coding">Coding</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                className="input-field"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Start Interview
          </Button>
        </form>
      </div>
    );
  }

  const isCoding = activeInterview.type === "coding";
  const isLast = currentIndex === activeInterview.questions.length - 1;
  const question = activeInterview.questions[currentIndex];
  const isCompleted = activeInterview.status === "completed";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeInterview.role} Interview
          </h1>
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {activeInterview.questions.length}
          </p>
        </div>
        <Button variant="secondary" onClick={() => dispatch(resetActiveInterview())}>
          Exit Interview
        </Button>
      </div>

      {isCompleted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center">
          <h3 className="text-xl font-bold text-gray-900">Interview Completed 🎉</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {activeInterview.overallScore}/10
          </p>
          <p className="mt-3 text-sm text-gray-600">{activeInterview.overallFeedback}</p>
        </motion.div>
      ) : (
        <div className="card space-y-4">
          <p className="font-medium text-gray-900">{question.question}</p>

          {isCoding ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Editor
                height="300px"
                defaultLanguage="javascript"
                value={answer}
                theme="vs-dark"
                onChange={(value) => setAnswer(value || "")}
              />
            </div>
          ) : (
            <textarea
              className="input-field min-h-[140px]"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}

          {question.feedback && (
            <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-800">
              <p className="font-semibold">Feedback (Score: {question.score}/10)</p>
              <p className="mt-1">{question.feedback}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            {!question.feedback ? (
              <Button onClick={handleSubmitAnswer} loading={submitting}>
                Submit Answer
              </Button>
            ) : isLast ? (
              <Button onClick={handleComplete}>Finish Interview</Button>
            ) : (
              <Button onClick={handleNext}>Next Question</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
