import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ResourceCard from "../../components/CompanyPrep/ResourceCard";
import { fetchCompanyDetails } from "../../redux/slices/companyPreparationSlice";

const resourceGroups = [
  "YouTube Playlist",
  "Article",
  "Official Documentation",
  "Practice Link",
  "Book",
];

const Resources = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { activeCompany: company } = useSelector((state) => state.companyPrep);

  useEffect(() => {
    dispatch(fetchCompanyDetails(slug));
  }, [dispatch, slug]);

  const groupedResources = useMemo(() => {
    const resources = company?.resources || [];
    return resourceGroups.map((group) => ({
      group,
      resources: resources.filter((resource) => resource.type === group || resource.type?.includes(group.split(" ")[0])),
    }));
  }, [company]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Resources</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">{company?.name || "Company"} resources</h1>
      </div>
      {groupedResources.map(({ group, resources }) => (
        resources.length ? (
          <DashboardCard key={group} subtitle="Company-wise Resources" title={group}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => <ResourceCard key={resource._id || resource.title} resource={resource} />)}
            </div>
          </DashboardCard>
        ) : null
      ))}
      <DashboardCard subtitle="All Resources" title="Full resource list">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(company?.resources || []).map((resource) => <ResourceCard key={resource._id || resource.title} resource={resource} />)}
        </div>
      </DashboardCard>
    </div>
  );
};

export default Resources;
