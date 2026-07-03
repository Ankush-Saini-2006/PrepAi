export const HERO_CONFIG = {
  badge: "AI career preparation workspace",
  eyebrow: "PrepAI",
  heading: {
    lead: "Prepare for the next",
    highlight: "career step with AI",
  },
  description:
    "A focused workspace for resume review, coding insights, role research, and guided learning without clutter or inflated claims.",
  primaryCta: { label: "Create account", to: "/register" },
  secondaryCta: { label: "Sign in", to: "/login" },
};

export const HOW_IT_WORKS_CONFIG = {
  eyebrow: "Workflow",
  title: "A calm system for preparation",
  description:
    "Each step is designed to accept real user inputs when available and fall back to empty states when the workspace has no data yet.",
  steps: [
    {
      title: "Add your context",
      description:
        "Connect resume, goals, target companies, and coding profiles from authenticated product flows.",
    },
    {
      title: "Review AI guidance",
      description:
        "Use generated suggestions, practice prompts, and learning paths only after the app has enough user context.",
    },
    {
      title: "Track progress",
      description:
        "Keep applications, preparation notes, and next actions organized from the dashboard.",
    },
  ],
};

export const PRODUCT_PREVIEWS_CONFIG = {
  eyebrow: "Product previews",
  title: "Interfaces ready for real user data",
  description:
    "Preview panels show the product shape while avoiding fabricated scores, activity, or outcomes.",
  items: [
    {
      id: "resume-analyzer",
      title: "Resume Analyzer Preview",
      description: "Resume insights render after a user uploads a document.",
      icon: "FileText",
      state: "loading",
      placeholderTitle: "Analyzing resume",
      placeholderDescription: "Upload a resume in the app to generate review content.",
      rows: ["Document status", "Keyword coverage", "Improvement areas"],
    },
    {
      id: "dashboard",
      title: "Dashboard Preview",
      description: "Dashboard widgets stay empty until account activity exists.",
      icon: "LayoutDashboard",
      state: "empty",
      placeholderTitle: "No dashboard data available",
      placeholderDescription: "Metrics appear after authenticated user activity is available.",
      rows: ["Applications", "Practice sessions", "Learning tasks"],
    },
    {
      id: "company-prep",
      title: "Company Prep Preview",
      description: "Company research cards are populated from saved targets.",
      icon: "Building2",
      state: "empty",
      placeholderTitle: "No company prep data available",
      placeholderDescription: "Save a company or role to build a preparation view.",
      rows: ["Role context", "Company notes", "Preparation focus"],
    },
    {
      id: "learning-hub",
      title: "Learning Hub Preview",
      description: "Learning paths are generated from selected goals and gaps.",
      icon: "BookOpenCheck",
      state: "loading",
      placeholderTitle: "Preparing learning hub",
      placeholderDescription: "Personalized modules appear when goals are configured.",
      rows: ["Skill areas", "Recommended modules", "Next action"],
    },
  ],
};

export const TESTIMONIALS_CONFIG = {
  eyebrow: "Testimonials",
  title: "Customer stories load from the content API",
  description:
    "No testimonial copy is shown until the application receives approved content from an API.",
  skeletonCount: 3,
};

export const CTA_CONFIG = {
  title: "Start with your own preparation data",
  description:
    "Create an account or sign in to use PrepAI with authenticated resume, coding, job, and learning workflows.",
  primaryCta: { label: "Create account", to: "/register" },
  secondaryCta: { label: "Sign in", to: "/login" },
};

export const FOOTER_CONFIG = {
  brand: {
    name: "PrepAI",
    description: "AI career preparation workspace for resume, coding, job, and learning workflows.",
  },
  groups: [
    {
      title: "Product",
      links: [
        { label: "Resume Analyzer", href: "/dashboard/resume" },
        { label: "Coding Analyzer", href: "/dashboard/coding-profiles" },
        { label: "Job Tracker", href: "/dashboard/jobs" },
        { label: "Roadmap", href: "/dashboard/roadmap" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Create account", href: "/register" },
        { label: "Sign in", href: "/login" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
  ],
};

export const LANDING_ERROR_CONFIG = {
  title: "Unable to load landing content",
  description: "The landing page will retry when the content service is available.",
};
