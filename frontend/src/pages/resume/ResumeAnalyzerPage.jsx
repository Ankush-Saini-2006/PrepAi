import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  Download,
  FileText,
  Lightbulb,
  ListChecks,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  Wand2,
} from "lucide-react";
import {
  analyzeResume,
  deleteResume,
  fetchResumeById,
  fetchResumes,
  setActiveResume,
  uploadResume,
} from "../../features/resume/resumeSlice";
import axiosInstance from "../../utils/axiosInstance";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

const hasItems = (items) => Array.isArray(items) && items.length > 0;
const hasAnalysis = (resume) => Boolean(resume?.analyzedAt);

const SkeletonBlock = () => (
  <div className="space-y-3">
    <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
    <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
  </div>
);

const AnalysisCard = ({ icon: Icon, title, children }) => (
  <section className="theme-surface rounded-[1.75rem] p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.2)]">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
        <Icon size={18} />
      </span>
      <h3 className="text-base font-semibold text-[color:var(--page-text)]">{title}</h3>
    </div>
    {children}
  </section>
);

const TextList = ({ items, empty }) =>
  hasItems(items) ? (
    <ul className="space-y-2 text-sm leading-6 theme-text-muted">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-xl bg-[var(--page-surface-soft)] px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm theme-text-muted">{empty}</p>
  );

const ObjectList = ({ items, renderItem, empty }) =>
  hasItems(items) ? (
    <div className="space-y-3">{items.map((item, index) => renderItem(item, index))}</div>
  ) : (
    <p className="text-sm theme-text-muted">{empty}</p>
  );

const ResumeAnalyzerPage = () => {
  const dispatch = useDispatch();
  const { resumes, activeResume, loading, analyzing } = useSelector((state) => state.resume);
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [downloading, setDownloading] = useState(false);

  const selectedPreviewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    };
  }, [selectedPreviewUrl]);

  const previewUrl = selectedPreviewUrl || activeResume?.fileUrl || "";
  const analysisReady = hasAnalysis(activeResume);
  const scoreAvailable = analysisReady && activeResume?.atsScore !== null && activeResume?.atsScore !== undefined;

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return toast.error("Please select a resume PDF");
    if (file.type !== "application/pdf") return toast.error("Only PDF files are supported");

    const uploadResult = await dispatch(uploadResume({ file, targetRole }));
    if (!uploadResume.fulfilled.match(uploadResult)) {
      return toast.error(uploadResult.payload || "Upload failed");
    }

    toast.success("Resume uploaded. Starting analysis...");
    const analyzeResult = await dispatch(analyzeResume(uploadResult.payload._id));
    if (analyzeResume.fulfilled.match(analyzeResult)) {
      setFile(null);
      toast.success("Resume analysis complete");
    } else {
      toast.error(analyzeResult.payload || "Analysis failed");
    }
  };

  const handleSelectResume = async (resume) => {
    dispatch(setActiveResume(resume));
    dispatch(fetchResumeById(resume._id));
  };

  const handleAnalyze = async (resumeId) => {
    const result = await dispatch(analyzeResume(resumeId));
    if (analyzeResume.fulfilled.match(result)) {
      toast.success("Analysis refreshed");
    } else {
      toast.error(result.payload || "Analysis failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(result)) {
      toast.success("Resume deleted");
    } else {
      toast.error(result.payload || "Delete failed");
    }
  };

  const handleDownload = async () => {
    if (!activeResume?._id) return;
    setDownloading(true);
    try {
      const response = await axiosInstance.get(`/resumes/${activeResume._id}/download-improved`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeResume.originalName?.replace(/\.[^/.]+$/, "") || "resume"}-improved.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.response?.data?.message || "Improved resume is not available yet");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">
            AI Resume Analyzer
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">
            Resume review workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">
            Upload a PDF resume, preview the file, parse its content, and generate structured feedback with Gemini.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={!activeResume?._id || !activeResume?.improvedResumeText || downloading}
          loading={downloading}
          onClick={handleDownload}
        >
          <Download size={16} /> Download improved resume
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="card space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--page-text)]">Upload resume PDF</h2>
            <p className="mt-1 text-sm theme-text-muted">PDF parsing runs before Gemini analysis.</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--page-text)]">Resume file</span>
              <span className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[color:var(--page-border)] bg-[var(--page-surface-soft)] px-4 py-4 text-sm theme-text-muted transition hover:border-primary-400">
                <UploadCloud size={18} />
                {file ? file.name : "Choose a PDF file"}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--page-text)]">Target role</span>
              <input
                className="input-field"
                placeholder="Frontend Developer"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
              />
            </label>

            <Button type="submit" loading={loading || analyzing} className="w-full">
              <Sparkles size={16} /> Upload and analyze
            </Button>
          </form>

          <div className="rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[color:var(--page-text)]">ATS score</p>
                <p className="text-xs theme-text-muted">Available after analysis completes.</p>
              </div>
              <div className="rounded-full bg-[var(--page-surface-solid)] px-4 py-2 text-sm font-semibold text-primary-700 dark:text-violet-300">
                {scoreAvailable ? `${activeResume.atsScore}%` : "No data"}
              </div>
            </div>
          </div>
        </section>

        <section className="card min-h-[28rem] overflow-hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--page-text)]">PDF preview</h2>
              <p className="mt-1 text-sm theme-text-muted">
                {activeResume?.originalName || file?.name || "No resume selected"}
              </p>
            </div>
            {activeResume?._id ? (
              <Button
                type="button"
                variant="secondary"
                disabled={analyzing}
                loading={analyzing}
                onClick={() => handleAnalyze(activeResume._id)}
              >
                <RefreshCw size={16} /> Re-analyze
              </Button>
            ) : null}
          </div>
          {previewUrl ? (
            <iframe
              title="Resume PDF preview"
              src={previewUrl}
              className="h-[32rem] w-full rounded-2xl border border-[color:var(--page-border)] bg-white"
            />
          ) : (
            <EmptyState title="No PDF selected" description="Upload a resume or choose one from history to preview it." />
          )}
        </section>
      </div>

      {analyzing ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <section key={item} className="theme-surface rounded-[1.75rem] p-5">
              <SkeletonBlock />
            </section>
          ))}
        </div>
      ) : activeResume ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <AnalysisCard icon={FileText} title="Resume summary">
            {activeResume.aiSummary ? (
              <p className="text-sm leading-6 theme-text-muted">{activeResume.aiSummary}</p>
            ) : (
              <p className="text-sm theme-text-muted">No summary available. Run analysis to generate one.</p>
            )}
          </AnalysisCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <AnalysisCard icon={ListChecks} title="Strengths">
              <TextList items={activeResume.strengths} empty="No strengths available yet." />
            </AnalysisCard>
            <AnalysisCard icon={Search} title="Weaknesses">
              <TextList items={activeResume.weaknesses} empty="No weaknesses available yet." />
            </AnalysisCard>
            <AnalysisCard icon={Wand2} title="Grammar analysis">
              <ObjectList
                items={activeResume.grammarAnalysis}
                empty="No grammar feedback available yet."
                renderItem={(item, index) => (
                  <div key={index} className="rounded-xl bg-[var(--page-surface-soft)] p-3 text-sm">
                    <p className="font-medium text-[color:var(--page-text)]">{item.issue || "Issue"}</p>
                    <p className="mt-1 theme-text-muted">{item.suggestion || "No suggestion available."}</p>
                  </div>
                )}
              />
            </AnalysisCard>
            <AnalysisCard icon={Lightbulb} title="Keyword optimization">
              <ObjectList
                items={activeResume.keywordOptimization}
                empty="No keyword optimization data available yet."
                renderItem={(item, index) => (
                  <div key={index} className="rounded-xl bg-[var(--page-surface-soft)] p-3 text-sm">
                    <p className="font-medium text-[color:var(--page-text)]">{item.keyword || "Keyword"}</p>
                    <p className="mt-1 theme-text-muted">{item.reason || "No reason available."}</p>
                  </div>
                )}
              />
            </AnalysisCard>
            <AnalysisCard icon={Sparkles} title="Missing skills">
              <TextList items={activeResume.missingSkills} empty="No missing skills available yet." />
            </AnalysisCard>
            <AnalysisCard icon={BookOpenCheck} title="Project suggestions">
              <ObjectList
                items={activeResume.projectSuggestions}
                empty="No project suggestions available yet."
                renderItem={(item, index) => (
                  <div key={index} className="rounded-xl bg-[var(--page-surface-soft)] p-3 text-sm">
                    <p className="font-medium text-[color:var(--page-text)]">{item.title || "Project"}</p>
                    <p className="mt-1 theme-text-muted">{item.description || "No description available."}</p>
                    {hasItems(item.skills) ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-slate-800 dark:text-violet-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              />
            </AnalysisCard>
          </div>

          <AnalysisCard icon={RefreshCw} title="Resume rewrite suggestions">
            <ObjectList
              items={activeResume.rewriteSuggestions}
              empty="No rewrite suggestions available yet."
              renderItem={(item, index) => (
                <div key={index} className="grid gap-3 rounded-xl bg-[var(--page-surface-soft)] p-3 text-sm lg:grid-cols-2">
                  <div>
                    <p className="font-medium text-[color:var(--page-text)]">{item.section || "Section"}</p>
                    <p className="mt-2 theme-text-muted">{item.original || "No original text available."}</p>
                  </div>
                  <div className="rounded-xl bg-[var(--page-surface-solid)] p-3">
                    <p className="font-medium text-primary-700 dark:text-violet-300">Improved</p>
                    <p className="mt-2 theme-text-muted">{item.improved || "No improved text available."}</p>
                  </div>
                </div>
              )}
            />
          </AnalysisCard>

          <AnalysisCard icon={FileText} title="Improved resume draft">
            {activeResume.improvedResumeText ? (
              <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-[var(--page-surface-soft)] p-4 text-sm leading-6 theme-text-muted">
                {activeResume.improvedResumeText}
              </pre>
            ) : (
              <p className="text-sm theme-text-muted">No improved resume draft available yet.</p>
            )}
          </AnalysisCard>
        </motion.div>
      ) : (
        <EmptyState title="No resume selected" description="Upload a PDF resume to begin analysis." />
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--page-text)]">Resume history</h2>
          <p className="mt-1 text-sm theme-text-muted">Select a previous upload to preview, analyze, or download its improved draft.</p>
        </div>

        {resumes.length === 0 ? (
          <EmptyState title="No resumes yet" description="Upload your first resume above." />
        ) : (
          <div className="grid gap-3">
            {resumes.map((resume) => {
              const isActive = activeResume?._id === resume._id;
              const analyzed = hasAnalysis(resume);
              return (
                <div
                  key={resume._id}
                  className={`theme-surface flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between ${
                    isActive ? "ring-2 ring-primary-500/30" : ""
                  }`}
                >
                  <button type="button" onClick={() => handleSelectResume(resume)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300">
                      <FileText size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[color:var(--page-text)]">{resume.originalName}</span>
                      <span className="mt-1 block text-xs theme-text-muted">
                        {resume.targetRole || "No target role"} - {analyzed ? "Analyzed" : "Not analyzed"}
                      </span>
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="secondary" disabled={analyzing} onClick={() => handleAnalyze(resume._id)}>
                      <RefreshCw size={15} />
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDelete(resume._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--page-border)] text-slate-400 transition hover:border-red-200 hover:text-red-500"
                      aria-label="Delete resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ResumeAnalyzerPage;
