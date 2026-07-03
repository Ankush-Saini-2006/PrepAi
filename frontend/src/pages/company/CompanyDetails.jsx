import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BookOpen, FileText, ListChecks, Map, Target } from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MetricCard from "../../components/dashboard/MetricCard";
import Button from "../../components/common/Button";
import FAQAccordion from "../../components/CompanyPrep/FAQAccordion";
import InterviewTimeline from "../../components/CompanyPrep/InterviewTimeline";
import ResourceCard from "../../components/CompanyPrep/ResourceCard";
import { fetchCompanyDetails, setTargetCompany } from "../../redux/slices/companyPreparationSlice";

const InfoList = ({ items = [] }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <p key={item} className="rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4 text-sm leading-6 theme-text-muted">
        {item}
      </p>
    ))}
  </div>
);

const CompanyDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { activeCompany: company, loading } = useSelector((state) => state.companyPrep);

  useEffect(() => {
    dispatch(fetchCompanyDetails(slug));
  }, [dispatch, slug]);

  const handleTarget = async () => {
    const result = await dispatch(setTargetCompany(slug));
    toast[setTargetCompany.fulfilled.match(result) ? "success" : "error"](
      setTargetCompany.fulfilled.match(result)
        ? "Target company saved for future roadmap and task generation"
        : result.payload || "Unable to update target company"
    );
  };

  if (loading && !company) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Company Information Hub</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">{company?.name || "Company"}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 theme-text-muted">{company?.overview || "Loading company preparation content."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/dashboard/company-prep/${slug}/resources`}><Button type="button" variant="secondary"><BookOpen size={16} /> Resources</Button></Link>
          <Link to={`/dashboard/company-prep/${slug}/roadmap`}><Button type="button" variant="secondary"><Map size={16} /> Roadmap</Button></Link>
          <Button type="button" onClick={handleTarget}><Target size={16} /> {company?.isTarget ? "Target Company" : "Set as Target Company"}</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ListChecks} title="DSA Topics" value={company?.mostAskedDsaTopics?.length || 0} description="Most asked topics" loading={loading} />
        <MetricCard icon={FileText} title="Core CS" value={company?.coreCsSubjects?.length || 0} description="Subjects to revise" loading={loading} />
        <MetricCard icon={BookOpen} title="Resources" value={company?.resources?.length || 0} description="Company-wise material" loading={loading} />
        <MetricCard icon={Target} title="Target" value={company?.isTarget ? "Selected" : "Not set"} description="Used by future generated plans" loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard subtitle="Hiring Process" title="What to expect">
          <InfoList items={company?.hiringProcess || []} />
        </DashboardCard>
        <DashboardCard subtitle="Eligibility" title="Common criteria">
          <InfoList items={company?.eligibility || []} />
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard subtitle="OA Pattern" title="Online assessment">
          <p className="text-sm leading-6 theme-text-muted">{company?.oaPattern || "Pattern varies by role and hiring cycle."}</p>
        </DashboardCard>
        <DashboardCard subtitle="Interview Pattern" title="Interview format">
          <p className="text-sm leading-6 theme-text-muted">{company?.interviewPattern || "Interview pattern varies by role and location."}</p>
        </DashboardCard>
      </div>

      <InterviewTimeline rounds={company?.interviewRounds || []} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard subtitle="Most Asked DSA Topics" title="DSA focus areas">
          <div className="grid gap-3 sm:grid-cols-2">
            {(company?.mostAskedDsaTopics || []).map((topic) => (
              <div key={topic.name} className="rounded-2xl border border-[color:var(--page-border)] bg-[var(--page-surface-soft)] p-4">
                <p className="text-sm font-semibold text-[color:var(--page-text)]">{topic.name}</p>
                <p className="mt-1 text-xs theme-text-muted">{topic.difficulty || "Medium"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(topic.recommendedQuestions || []).slice(0, 3).map((question) => (
                    <span key={question} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-slate-700 dark:text-violet-300">{question}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard subtitle="Core CS Subjects" title="CS revision">
          <InfoList items={company?.coreCsSubjects || []} />
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard subtitle="Resume Tips" title="Resume fit">
          <InfoList items={company?.resumeTips || []} />
        </DashboardCard>
        <DashboardCard subtitle="Projects Expected" title="Project signals">
          <InfoList items={company?.projectsExpected || []} />
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FAQAccordion questions={company?.frequentlyAskedQuestions || []} />
        <DashboardCard subtitle="Coding Languages Preferred" title="Language choices">
          <InfoList items={company?.codingLanguagesPreferred || []} />
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard subtitle="HR Questions" title="HR preparation">
          <InfoList items={company?.hrQuestions || []} />
        </DashboardCard>
        <DashboardCard subtitle="Behavioral Questions" title="Behavioral preparation">
          <InfoList items={company?.behavioralQuestions || []} />
        </DashboardCard>
      </div>

      {company?.systemDesign?.length ? (
        <DashboardCard subtitle="System Design" title="Role-dependent system design">
          <InfoList items={company.systemDesign} />
        </DashboardCard>
      ) : null}

      <DashboardCard subtitle="Company-wise Resources" title="Recommended material">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(company?.resources || []).slice(0, 6).map((resource) => <ResourceCard key={resource._id || resource.title} resource={resource} />)}
        </div>
      </DashboardCard>
    </div>
  );
};

export default CompanyDetails;
