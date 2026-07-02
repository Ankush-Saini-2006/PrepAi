import {
  CTA_CONFIG,
  FOOTER_CONFIG,
  HERO_CONFIG,
  HOW_IT_WORKS_CONFIG,
  PRODUCT_PREVIEWS_CONFIG,
  TESTIMONIALS_CONFIG,
} from "../../config/hero";
import { FAQ_CONFIG, FAQ_SECTION_CONFIG } from "../../config/faq";
import { FEATURES_CONFIG, FEATURES_SECTION_CONFIG } from "../../config/features";
import axiosInstance from "../../utils/axiosInstance";

const landingContent = {
  hero: HERO_CONFIG,
  featuresSection: FEATURES_SECTION_CONFIG,
  features: FEATURES_CONFIG,
  howItWorks: HOW_IT_WORKS_CONFIG,
  productPreviews: PRODUCT_PREVIEWS_CONFIG,
  testimonialsSection: TESTIMONIALS_CONFIG,
  testimonials: [],
  faqSection: FAQ_SECTION_CONFIG,
  faq: FAQ_CONFIG,
  cta: CTA_CONFIG,
  footer: FOOTER_CONFIG,
};

export const getLandingContent = async () => {
  const endpoint = import.meta.env.VITE_LANDING_CONTENT_ENDPOINT;

  if (!endpoint) {
    return landingContent;
  }

  const { data } = await axiosInstance.get(endpoint);
  return {
    ...landingContent,
    ...data?.data,
    testimonials: data?.data?.testimonials || [],
  };
};
