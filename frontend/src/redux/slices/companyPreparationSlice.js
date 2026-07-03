import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCompanies,
  getCompanyDetails,
  setTargetCompany as setTargetCompanyApi,
} from "../../services/companyPreparationApi";

const rejectMessage = (err, fallback) => err.response?.data?.message || fallback;

export const fetchCompanies = createAsyncThunk("companyPrep/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    return await getCompanies();
  } catch (err) {
    return rejectWithValue(rejectMessage(err, "Failed to fetch companies"));
  }
});

export const fetchCompanyDetails = createAsyncThunk("companyPrep/fetchDetails", async (slug, { rejectWithValue }) => {
  try {
    return await getCompanyDetails(slug);
  } catch (err) {
    return rejectWithValue(rejectMessage(err, "Failed to fetch company details"));
  }
});

export const setTargetCompany = createAsyncThunk("companyPrep/setTarget", async (slug, { rejectWithValue }) => {
  try {
    return await setTargetCompanyApi(slug);
  } catch (err) {
    return rejectWithValue(rejectMessage(err, "Failed to set target company"));
  }
});

const companyPreparationSlice = createSlice({
  name: "companyPrep",
  initialState: {
    companies: [],
    activeCompany: null,
    target: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.companies || [];
        state.target = action.payload.target || null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCompany = action.payload.company;
        state.target = action.payload.target || null;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setTargetCompany.fulfilled, (state, action) => {
        state.target = action.payload;
        state.companies = state.companies.map((company) => ({
          ...company,
          isTarget: company.slug === action.payload.companySlug,
        }));
        if (state.activeCompany) {
          state.activeCompany = {
            ...state.activeCompany,
            isTarget: state.activeCompany.slug === action.payload.companySlug,
          };
        }
      });
  },
});

export const { clearCompanyError } = companyPreparationSlice.actions;

export default companyPreparationSlice.reducer;
