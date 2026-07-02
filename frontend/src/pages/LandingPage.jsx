import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, MessageSquareText, BriefcaseBusiness, Target, Sparkles } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import useFetchLandingContent from "../hooks/useFetchLandingContent";

const featureIcons = {
  FileText,
  MessageSquareText,
  BriefcaseBusiness,
  Target,
};

const container = "mx-auto max-w-7xl px-4 sm:px-6";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage = () => {
  const { content, loading, error } = useFetchLandingContent();

  if (loading && !content) {
    return <Spinner fullScreen />;
  }

  const hero = content?.hero;
  const features = content?.features || [];

  return (
    <div className="relative min-h-screen overflow-hidden theme-shell">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl dark:bg-cyan-400/10" />
        <div className="absolute bottom-0 left-[-8rem] h-72 w-72 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-500/10" />
      </div>

      <section className="relative pt-4 sm:pt-6">
        <div className={`${container} max-w-7xl pb-4 pt-2 sm:pb-8 lg:pt-4`}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="theme-surface mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur"
            >
              <Sparkles size={14} className="text-primary-600" />
              {hero?.badge || "AI-powered career and placement coach"}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mx-auto mt-4 text-5xl font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-[4.25rem]"
            >
              <span className="block text-[color:var(--page-text)]">Your AI-Powered</span>
              <span className="block text-primary-600">Career & Placement Coach</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg"
            >
              {hero?.description || "PrepAI helps students and professionals land their dream job with AI resume analysis, mock interviews, job tracking, and personalized career roadmaps."}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={hero?.primaryCta?.to || "/register"} className="btn-primary group px-6 py-3 text-sm font-semibold">
                {hero?.primaryCta?.label || "Start Free Today"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to={hero?.secondaryCta?.to || "/login"} className="btn-secondary px-6 py-3 text-sm font-semibold shadow-sm">
                {hero?.secondaryCta?.label || "I already have an account"}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-10 pt-4 sm:pb-14">
        <div className={`${container} grid gap-4 sm:grid-cols-2 xl:grid-cols-4`}>
          {features.length > 0 ? (
            features.slice(0, 4).map(({ icon, title, description }, index) => {
              const Icon = featureIcons[icon] || FileText;

              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-solid)] px-5 py-6 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)]"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-primary-700 ring-1 ring-inset ring-indigo-100 dark:from-slate-800 dark:to-slate-700 dark:ring-slate-700">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-[color:var(--page-text)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </motion.div>
              );
            })
          ) : (
            <div className="xl:col-span-4">
              <EmptyState title="No feature content available" description="Feature cards will appear here once the content service returns data." />
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className={`${container} pb-10`}>
          <EmptyState title="Unable to load landing content" description={error} />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
