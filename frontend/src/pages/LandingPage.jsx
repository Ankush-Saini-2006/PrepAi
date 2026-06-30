import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, MessageSquareText, Briefcase, Map } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    description: "Get instant ATS scoring, strengths, weaknesses and keyword suggestions.",
  },
  {
    icon: MessageSquareText,
    title: "Mock Interviews",
    description: "Practice technical, HR & coding interviews with real-time AI feedback.",
  },
  {
    icon: Briefcase,
    title: "Job Tracker",
    description: "Track every application from saved to offer with a clean visual board.",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description: "Personalized, milestone-based learning paths generated just for you.",
  },
];

const LandingPage = () => {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl"
        >
          Your AI-Powered
          <span className="block text-primary-600">Career &amp; Placement Coach</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-500"
        >
          PrepAI helps students and professionals land their dream job with AI resume analysis,
          mock interviews, job tracking, and personalized career roadmaps.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary">
            Start Free Today
          </Link>
          <Link to="/login" className="btn-secondary">
            I already have an account
          </Link>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
