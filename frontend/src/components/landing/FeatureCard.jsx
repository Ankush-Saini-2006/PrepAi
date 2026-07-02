import { BriefcaseBusiness, FileText, MessageSquareText, Target } from "lucide-react";
import { motion } from "framer-motion";

const icons = {
  BriefcaseBusiness,
  FileText,
  MessageSquareText,
  Target,
};

const FeatureCard = ({ feature, index = 0 }) => {
  const Icon = icons[feature.icon] || FileText;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05 }}
      className="theme-surface group rounded-2xl px-5 py-6 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)]"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-primary-700 ring-1 ring-inset ring-indigo-100 dark:from-slate-800 dark:to-slate-700 dark:ring-slate-700">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 text-base font-semibold text-[color:var(--page-text)]">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 theme-text-muted">{feature.description}</p>
    </motion.article>
  );
};

export default FeatureCard;
