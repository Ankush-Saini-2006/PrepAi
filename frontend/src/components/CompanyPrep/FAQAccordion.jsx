import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DashboardCard from "../dashboard/DashboardCard";

const FAQAccordion = ({ questions = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <DashboardCard subtitle="FAQ" title="Frequently asked questions">
      <div className="space-y-3">
        {questions.map((question, index) => (
          <button
            key={`${question}-${index}`}
            type="button"
            className="w-full rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4 text-left"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[color:var(--page-text)]">
              {question}
              <ChevronDown size={16} className={openIndex === index ? "rotate-180 transition" : "transition"} />
            </span>
            {openIndex === index ? (
              <span className="mt-3 block text-sm leading-6 theme-text-muted">
                Prepare a concise answer using your projects, DSA practice, and company-specific motivation.
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </DashboardCard>
  );
};

export default FAQAccordion;
