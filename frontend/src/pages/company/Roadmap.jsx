import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Target } from "lucide-react";
import Button from "../../components/common/Button";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { fetchCompanyDetails, setTargetCompany } from "../../redux/slices/companyPreparationSlice";

const Roadmap = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { activeCompany: company } = useSelector((state) => state.companyPrep);

  useEffect(() => {
    dispatch(fetchCompanyDetails(slug));
  }, [dispatch, slug]);

  const handleTarget = async () => {
    const result = await dispatch(setTargetCompany(slug));
    toast[setTargetCompany.fulfilled.match(result) ? "success" : "error"](
      setTargetCompany.fulfilled.match(result)
        ? "Target company saved for future Career Roadmap and Smart Task AI plans"
        : result.payload || "Unable to set target company"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Roadmap Target</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">{company?.name || "Company"} preparation target</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">
            Company Preparation no longer generates a duplicate roadmap. Set this company as your target, then use Career Roadmap or Smart Task Manager to generate future plans with this company context.
          </p>
        </div>
        <Button type="button" onClick={handleTarget}><Target size={16} /> {company?.isTarget ? "Target Company" : "Set as Target Company"}</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard subtitle="Career Roadmap Sync" title="Generate role roadmap with company context">
          <p className="text-sm leading-6 theme-text-muted">
            After setting the target company, newly generated career roadmaps include this company as context while still living inside the existing Career Roadmap module.
          </p>
          <Link to="/dashboard/roadmap" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-violet-300">
            Open Career Roadmap <ArrowRight size={14} />
          </Link>
        </DashboardCard>
        <DashboardCard subtitle="Smart Task Manager Sync" title="Generate tasks from the selected target">
          <p className="text-sm leading-6 theme-text-muted">
            Future AI study plans use this target company when the planner form does not specify a different company.
          </p>
          <Link to="/dashboard/tasks/ai-planner" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-violet-300">
            Open AI Planner <ArrowRight size={14} />
          </Link>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Roadmap;
