import { BriefcaseBusiness, Sparkles, UploadCloud } from "lucide-react";
import Button from "../common/Button";

const UploadSection = ({
  file,
  jobDescription,
  loading,
  onFileChange,
  onJobDescriptionChange,
  onSubmit,
}) => {
  return (
    <section className="card space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--page-text)]">Match resume to job</h2>
        <p className="mt-1 text-sm theme-text-muted">
          Upload a PDF resume and paste the job description to compare fit.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[color:var(--page-text)]">Resume PDF</span>
          <span className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[color:var(--page-border)] bg-[var(--page-surface-soft)] px-4 py-4 text-sm theme-text-muted transition hover:border-primary-400">
            <UploadCloud size={18} />
            <span className="min-w-0 flex-1 truncate">{file ? file.name : "Choose a PDF file"}</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[color:var(--page-text)]">
            <BriefcaseBusiness size={16} /> Job description
          </span>
          <textarea
            className="input-field min-h-56 resize-y leading-6"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
          />
        </label>

        <Button type="submit" loading={loading} className="w-full">
          <Sparkles size={16} /> Analyze match
        </Button>
      </form>
    </section>
  );
};

export default UploadSection;
