import axiosInstance from "../utils/axiosInstance";

export const getCompanies = async () => {
  const { data } = await axiosInstance.get("/company-prep/companies");
  return data.data;
};

export const getCompanyDetails = async (slug) => {
  const { data } = await axiosInstance.get(`/company-prep/companies/${slug}`);
  return data.data;
};

export const setTargetCompany = async (slug) => {
  const { data } = await axiosInstance.post(`/company-prep/companies/${slug}/target`);
  return data.data.target;
};
