const landingContent = {
  hero: {
    badge: "AI-powered career and placement coach",
    heading: "Your AI-Powered Career & Placement Coach",
    description:
      "PrepAI helps students and professionals land their dream job with AI resume analysis, mock interviews, job tracking, and personalized career roadmaps.",
    primaryCta: { label: "Start Free Today", to: "/register" },
    secondaryCta: { label: "I already have an account", to: "/login" },
  },
  features: [
    {
      icon: "FileText",
      title: "AI Resume Analyzer",
      description:
        "Get instant ATS scoring, strengths, weaknesses and keyword suggestions.",
    },
    {
      icon: "MessageSquareText",
      title: "Mock Interviews",
      description:
        "Practice technical, HR, and coding interviews with real-time AI feedback.",
    },
    {
      icon: "BriefcaseBusiness",
      title: "Job Tracker",
      description:
        "Track every application from saved to offer with a clean visual board.",
    },
    {
      icon: "Target",
      title: "Career Roadmaps",
      description:
        "Personalized, milestone-based learning paths generated just for you.",
    },
  ],
};

export const getLandingContent = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return landingContent;
};
