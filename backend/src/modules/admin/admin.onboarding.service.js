import CollegeOnboarding from "../../models/CollegeOnboarding.js";
import CompanyOnboarding from "../../models/CompanyOnboarding.js";


export const getPendingOnboardingsService = async (type) => {

  const collegeQuery = { status: "pending" };
  const companyQuery = { status: "pending" };

  if (type === "college") {
    const colleges = await CollegeOnboarding.find(collegeQuery)
      .sort({ createdAt: -1 });

    return { colleges, companies: [] };
  }

  if (type === "company") {
    const companies = await CompanyOnboarding.find(companyQuery)
      .sort({ createdAt: -1 });

    return { colleges: [], companies };
  }

  const [colleges, companies] = await Promise.all([
    CollegeOnboarding.find(collegeQuery).sort({ createdAt: -1 }),
    CompanyOnboarding.find(companyQuery).sort({ createdAt: -1 })
  ]);

  return { colleges, companies };
};



export const getVerifiedOnboardingsService = async (type) => {

  const filter = { status: "approved" };

  if (type === "college") {
    const colleges = await CollegeOnboarding.find(filter)
      .populate("college")
      .sort({ createdAt: -1 });

    return { colleges, companies: [] };
  }

  if (type === "company") {
    const companies = await CompanyOnboarding.find(filter)
      .populate("company")
      .sort({ createdAt: -1 });

    return { colleges: [], companies };
  }

  const [colleges, companies] = await Promise.all([
    CollegeOnboarding.find(filter)
      .populate("college")
      .sort({ createdAt: -1 }),

    CompanyOnboarding.find(filter)
      .populate("company")
      .sort({ createdAt: -1 })
  ]);

  return { colleges, companies };
};



export const getOnboardingDetailsService = async (type, id) => {

  if (type === "college") {
    return CollegeOnboarding.findById(id)
      .populate("college")
      .populate("createdUser", "email role")
      .populate("reviewedBy", "email");
  }

  if (type === "company") {
    return CompanyOnboarding.findById(id)
      .populate("company")
      .populate("createdUser", "email role")
      .populate("reviewedBy", "email");
  }

  throw new Error("Invalid type");
};