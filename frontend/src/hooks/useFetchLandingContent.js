import { useEffect, useState } from "react";
import { LANDING_ERROR_CONFIG } from "../config/hero";
import { getLandingContent } from "../services/api/landingContentApi";

const useFetchLandingContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await getLandingContent();
        if (!active) return;
        setContent(data);
        setError(null);
      } catch (fetchError) {
        if (!active) return;
        setError({
          ...LANDING_ERROR_CONFIG,
          description: fetchError.message || LANDING_ERROR_CONFIG.description,
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  return { content, loading, error };
};

export default useFetchLandingContent;
