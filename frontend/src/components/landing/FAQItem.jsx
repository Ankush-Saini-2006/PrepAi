import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const FAQItem = ({ item, open, onToggle }) => {
  return (
    <div className="theme-surface overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[color:var(--page-text)]">{item.question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 theme-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <p className="border-t border-[color:var(--page-border)] px-5 py-4 text-sm leading-6 theme-text-muted">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
