import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Sparkles, Trash2 } from "lucide-react";
import {
  uploadResume,
  analyzeResume,
  fetchResumes,
  deleteResume,
} from "../../features/resume/resumeSlice";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

const ResumeAnalyzerPage = () => {
  const dispatch = useDispatch();
  const { resumes, activeResume, loading, analyzing } = useSelector((state) => state.resume);
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a resume file (PDF)");

    const result = await dispatch(uploadResume({ file, targetRole }));
    if (uploadResume.fulfilled.match(result)) {
      toast.success("Resume uploaded! Now analyzing...");
      const analyzeResult = await dispatch(analyzeResume(result.payload._id));
      if (analyzeResume.fulfilled.match(analyzeResult)) {
        toast.success("Analysis complete!");
      } else {
        toast.error(analyzeResult.payload || "Analysis failed");
      }
    } else {
      toast.error(result.payload || "Upload failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(result)) {
      toast.success("Resume deleted");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Resume Analyzer</h1>
        <p className="text-sm text-gray-500">
          Upload your resume to get an ATS score, strengths, weaknesses, and tailored suggestions.
        </p>
      </div>

      <form onSubmit={handleUpload} className="card flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Resume (PDF)</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-primary-400">
            <UploadCloud size={18} />
            {file ? file.name : "Click to choose a PDF file"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Target Role</label>
          <input
            className="input-field"
            placeholder="e.g. Frontend Developer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>
        <Button type="submit" loading={loading || analyzing}>
          <Sparkles size={16} /> Upload &amp; Analyze
        </Button>
      </form>

      {activeResume && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Latest Analysis</h3>
            <div className="rounded-full bg-primary-50 px-4 py-1 text-sm font-semibold text-primary-700">
              ATS Score: {activeResume.atsScore || 0}%
            </div>
          </div>

          {activeResume.aiSummary && (
            <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              {activeResume.aiSummary}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-green-700">Strengths</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {(activeResume.strengths || []).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-red-700">Weaknesses</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {(activeResume.weaknesses || []).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-blue-700">Suggestions</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {(activeResume.suggestions || []).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-amber-700">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {(activeResume.missingKeywords || []).map((k, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <h3 className="mb-4 font-semibold text-gray-900">Resume History</h3>
        {resumes.length === 0 ? (
          <EmptyState title="No resumes yet" description="Upload your first resume above." />
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div key={r._id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary-600" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.originalName}</p>
                    <p className="text-xs text-gray-500">
                      ATS Score: {r.atsScore || 0}% • {r.targetRole || "No target role"}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(r._id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
