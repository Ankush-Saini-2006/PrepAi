import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import CTASection from "../components/landing/CTASection";
import FAQItem from "../components/landing/FAQItem";
import FeatureCard from "../components/landing/FeatureCard";
import PreviewCard from "../components/landing/PreviewCard";
import useFetchLandingContent from "../hooks/useFetchLandingContent";

const container = "mx-auto max-w-7xl px-4 sm:px-6";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const SectionHeader = ({ eyebrow, title, description, align = "center" }) => (
  <div className={align === "left" ? "max-w-3xl" : "mx-auto max-w-3xl text-center"}>
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">{eyebrow}</p>
    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--page-text)] sm:text-3xl">
      {title}
    </h2>
    <p className="mt-3 text-sm leading-6 theme-text-muted sm:text-base">{description}</p>
  </div>
);

const TestimonialSkeleton = () => (
  <div className="theme-surface rounded-2xl p-5">
    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="mt-5 space-y-3">
      <div className="h-2.5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-2.5 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
    <div className="mt-6 flex items-center gap-3">
      <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2">
        <div className="h-2.5 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-2.5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const { content, loading, error } = useFetchLandingContent();
  const [openFaq, setOpenFaq] = useState(0);

  if (loading && !content) {
    return <Spinner fullScreen />;
  }

  const hero = content?.hero;
  const featuresSection = content?.featuresSection;
  const features = content?.features || [];
  const howItWorks = content?.howItWorks;
  const productPreviews = content?.productPreviews;
  const testimonialsSection = content?.testimonialsSection;
  const testimonials = content?.testimonials || [];
  const faqSection = content?.faqSection;
  const faq = content?.faq || [];
  const cta = content?.cta;
  const footer = content?.footer;

  return (
    <div className="relative min-h-screen overflow-hidden theme-shell">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl dark:bg-cyan-400/10" />
        <div className="absolute bottom-0 left-[-8rem] h-72 w-72 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-500/10" />
      </div>

      {hero && (
        <section className="relative pt-4 sm:pt-6">
          <div className={`${container} pb-8 pt-2 sm:pb-12 lg:pt-4`}>
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
                {hero.badge}
              </motion.div>

              <motion.p variants={fadeUp} className="mt-5 text-sm font-semibold text-primary-600">
                {hero.eyebrow}
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="mx-auto mt-3 text-5xl font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-[4.25rem]"
              >
                <span className="block text-[color:var(--page-text)]">{hero.heading.lead}</span>
                <span className="block text-primary-600">{hero.heading.highlight}</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-3xl text-base leading-7 theme-text-muted sm:text-lg">
                {hero.description}
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to={hero.primaryCta.to} className="btn-primary group px-6 py-3 text-sm font-semibold">
                  {hero.primaryCta.label}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link to={hero.secondaryCta.to} className="btn-secondary px-6 py-3 text-sm font-semibold shadow-sm">
                  {hero.secondaryCta.label}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {featuresSection && (
        <section className="relative py-10 sm:py-14">
          <div className={container}>
            <SectionHeader {...featuresSection} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {howItWorks && (
        <section className="relative py-10 sm:py-14">
          <div className={container}>
            <SectionHeader {...howItWorks} />
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {howItWorks.steps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.08 }}
                  className="theme-surface rounded-2xl p-6"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-100 dark:bg-slate-800 dark:text-white dark:ring-slate-700">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-[color:var(--page-text)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 theme-text-muted">{step.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {productPreviews && (
        <section className="relative py-10 sm:py-14">
          <div className={container}>
            <SectionHeader {...productPreviews} />
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {productPreviews.items.map((preview, index) => (
                <PreviewCard key={preview.id} preview={preview} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonialsSection && (
        <section className="relative py-10 sm:py-14">
          <div className={container}>
            <SectionHeader {...testimonialsSection} />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {testimonials.length > 0
                ? testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="theme-surface rounded-2xl p-5">
                      <p className="text-sm leading-6 theme-text-muted">{testimonial.quote}</p>
                      <div className="mt-5 text-sm font-semibold text-[color:var(--page-text)]">{testimonial.name}</div>
                    </div>
                  ))
                : Array.from({ length: testimonialsSection.skeletonCount }).map((_, index) => (
                    <TestimonialSkeleton key={index} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {faqSection && (
        <section className="relative py-10 sm:py-14">
          <div className={`${container} grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start`}>
            <SectionHeader {...faqSection} align="left" />
            <div className="space-y-3">
              {faq.map((item, index) => (
                <FAQItem
                  key={item.question}
                  item={item}
                  open={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {cta && <CTASection cta={cta} />}

      {footer && (
        <footer className="relative border-t border-[color:var(--page-border)] py-10">
          <div className={`${container} grid gap-8 md:grid-cols-[1.2fr_1fr]`}>
            <div>
              <Link to="/" className="text-lg font-extrabold text-[color:var(--page-text)]">
                {footer.brand.name}
              </Link>
              <p className="mt-3 max-w-md text-sm leading-6 theme-text-muted">{footer.brand.description}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {footer.groups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-[color:var(--page-text)]">{group.title}</h3>
                  <div className="mt-3 space-y-2">
                    {group.links.map((link) => (
                      <Link key={link.href} to={link.href} className="block text-sm theme-text-muted hover:text-primary-600">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      )}

      {error && (
        <div className={`${container} pb-10`}>
          <EmptyState title={error.title} description={error.description} />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
