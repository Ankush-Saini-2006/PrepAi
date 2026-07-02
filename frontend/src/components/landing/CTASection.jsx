import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = ({ cta }) => (
  <section className="relative py-12 sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="theme-surface overflow-hidden rounded-2xl px-6 py-8 text-center shadow-[0_24px_70px_-44px_rgba(15,23,42,0.5)] sm:px-10 sm:py-10"
      >
        <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight text-[color:var(--page-text)] sm:text-3xl">
          {cta.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 theme-text-muted sm:text-base">{cta.description}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={cta.primaryCta.to} className="btn-primary group px-6 py-3 text-sm font-semibold">
            {cta.primaryCta.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to={cta.secondaryCta.to} className="btn-secondary px-6 py-3 text-sm font-semibold">
            {cta.secondaryCta.label}
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
