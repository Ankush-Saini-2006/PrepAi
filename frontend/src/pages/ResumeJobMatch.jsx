import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import HistoryCard from "../components/ResumeJobMatch/HistoryCard";
import MatchScoreCard from "../components/ResumeJobMatch/MatchScoreCard";
import SkillsCard from "../components/ResumeJobMatch/SkillsCard";
import SuggestionsCard from "../components/ResumeJobMatch/SuggestionsCard";
import SummaryCard from "../components/ResumeJobMatch/SummaryCard";
import UploadSection from "../components/ResumeJobMatch/UploadSection";
import WeakAreasCard from "../components/ResumeJobMatch/WeakAreasCard";
import {
  analyzeResumeJobMatch,
  deleteResumeJobMatch,
  fetchResumeJobMatchById,
  fetchResumeJobMatchHistory,
  setActiveMatch,
} from "../redux/slices/resumeJobMatchSlice";

const ResumeJobMatch = () => {
  const dispatch = useDispatch();
  const { matches, activeMatch, loading, analyzing, deleting } = useSelector(
    (state) => state.resumeJobMatch
  );
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const selectedPreviewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    dispatch(fetchResumeJobMatchHistory());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  const previewUrl = selectedPreviewUrl || activeMatch?.fileUrl || "";

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!file) return toast.error("Please select a resume PDF");
    if (file.type !== "application/pdf") return toast.error("Only PDF files are supported");
    if (!jobDescription.trim()) return toast.error("Please paste a job description");

    const result = await dispatch(
      analyzeResumeJobMatch({ file, jobDescription: jobDescription.trim() })
    );

    if (analyzeResumeJobMatch.fulfilled.match(result)) {
      setFile(null);
      setJobDescription("");
      toast.success("Resume job match complete");
    } else {
      toast.error(result.payload || "Analysis failed");
    }
  };

  const handleSelect = (match) => {
    dispatch(setActiveMatch(match));
    dispatch(fetchResumeJobMatchById(match._id));
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteResumeJobMatch(id));
    if (deleteResumeJobMatch.fulfilled.match(result)) {
      toast.success("Analysis deleted");
    } else {
      toast.error(result.payload || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">
          Resume vs Job Description
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">
          Match readiness workspace
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">
          Compare a PDF resume against a pasted job description and get structured fit signals from Gemini.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <UploadSection
          file={file}
          jobDescription={jobDescription}
          loading={analyzing}
          onFileChange={setFile}
          onJobDescriptionChange={setJobDescription}
          onSubmit={handleAnalyze}
        />

        <section className="card min-h-[28rem] overflow-hidden">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[color:var(--page-text)]">PDF preview</h2>
            <p className="mt-1 text-sm theme-text-muted">
              {activeMatch?.originalName || file?.name || "No resume selected"}
            </p>
          </div>
          {previewUrl ? (
            <iframe
              title="Resume PDF preview"
              src={previewUrl}
              className="h-[32rem] w-full rounded-2xl border border-[color:var(--page-border)] bg-white"
            />
          ) : (
            <EmptyState title="No PDF selected" description="Upload a resume or choose a previous analysis." />
          )}
        </section>
      </div>

      {analyzing || loading ? (
        <section className="theme-surface rounded-2xl">
          <Spinner />
        </section>
      ) : activeMatch ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <MatchScoreCard match={activeMatch} />
          <SummaryCard summary={activeMatch.summary} />
          <SkillsCard
            matchingSkills={activeMatch.matchingSkills}
            missingSkills={activeMatch.missingSkills}
            missingKeywords={activeMatch.missingKeywords}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <WeakAreasCard items={activeMatch.weakAreas} />
            <SuggestionsCard items={activeMatch.improvementSuggestions} />
          </div>
        </motion.div>
      ) : (
        <EmptyState title="No analysis selected" description="Run a match analysis to see scores and recommendations." />
      )}

      <HistoryCard
        matches={matches}
        activeId={activeMatch?._id}
        loading={loading}
        deleting={deleting}
        onSelect={handleSelect}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ResumeJobMatch;
