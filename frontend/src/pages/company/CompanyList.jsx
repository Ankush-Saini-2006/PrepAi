import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2 } from "lucide-react";
import CompanyCard from "../../components/CompanyPrep/CompanyCard";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import { fetchCompanies } from "../../redux/slices/companyPreparationSlice";

const CompanyList = () => {
  const dispatch = useDispatch();
  const { companies, loading } = useSelector((state) => state.companyPrep);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (loading && companies.length === 0) return <Spinner fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">AI Company Preparation Hub</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">Choose your target company</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">
          Explore company-specific hiring details, DSA topics, interview guidance, resume tips, project expectations, and curated resources.
        </p>
      </div>

      {companies.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {companies.map((company) => <CompanyCard key={company._id} company={company} />)}
        </div>
      ) : (
        <EmptyState title="No companies available" description="Supported companies will appear after the API initializes the company catalog." action={<Building2 size={22} className="text-primary-600" />} />
      )}
    </div>
  );
};

export default CompanyList;
