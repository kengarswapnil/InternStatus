import mongoose from "mongoose";
import CollegeOnboarding from "../../models/CollegeOnboarding.js";
import CompanyOnboarding from "../../models/CompanyOnboarding.js";

/* ---------------- SAFE REGEX ---------------- */
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/* ---------------- BUILD MATCH ---------------- */
const buildMatch = (status, search) => {
  const match = { status };

  const cleanSearch =
    typeof search === "string" ? search.trim() : "";

  if (cleanSearch.length > 0) {
    const safe = escapeRegex(cleanSearch);

    match.$or = [
      { requesterName: { $regex: safe, $options: "i" } },
      { requesterEmail: { $regex: safe, $options: "i" } },
      { collegeName: { $regex: safe, $options: "i" } },
      { companyName: { $regex: safe, $options: "i" } },
    ];
  }

  return match;
};

/* =========================================================
   🔹 VERIFIED ONBOARDINGS (UNIFIED)
========================================================= */
export const getVerifiedOnboardingsService = async ({
  type = "all",
  page = 1,
  limit = 10,
  search = "",
  sortField = "createdAt",
  sortOrder = "desc",
}) => {
  const match = buildMatch("approved", search);

  const sort = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  /* ---------------- COLLEGE PIPELINE ---------------- */
  const collegePipeline = [
    { $match: match },
    {
      $addFields: {
        type: "college",
        name: "$collegeName",
      },
    },
  ];

  /* ---------------- COMPANY PIPELINE ---------------- */
  const companyPipeline = [
    { $match: match },
    {
      $addFields: {
        type: "company",
        name: "$companyName",
      },
    },
  ];

  /* ---------------- MERGE ---------------- */
  const pipeline = [
  /* -------- COLLEGE FIRST -------- */
  {
    $match: match,
  },
  {
    $addFields: {
      type: "college",
      name: "$collegeName",
    },
  },

  /* -------- THEN UNION COMPANY -------- */
  {
    $unionWith: {
      coll: CompanyOnboarding.collection.name, // 🔥 IMPORTANT
      pipeline: [
        { $match: match },
        {
          $addFields: {
            type: "company",   // ✅ THIS FIXES EVERYTHING
            name: "$companyName",
          },
        },
      ],
    },
  },
];

  /* ---------------- FILTER TYPE ---------------- */
  if (type !== "all") {
    pipeline.push({
      $match: { type },
    });
  }

  /* ---------------- SORT ---------------- */
  pipeline.push({ $sort: sort });

  /* ---------------- PAGINATION ---------------- */
  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await CollegeOnboarding.aggregate(pipeline);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  return {
    data,
    counts: {
      all: total,
      college: type === "company" ? 0 : await CollegeOnboarding.countDocuments(match),
      company: type === "college" ? 0 : await CompanyOnboarding.countDocuments(match),
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* =========================================================
   🔹 PENDING (SAME LOGIC)
========================================================= */
export const getPendingOnboardingsService = async (params) => {
  return getVerifiedOnboardingsService({
    ...params,
    search: params.search,
    type: params.type,
    page: params.page,
    limit: params.limit,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: "pending",
  });
};

/* =========================================================
   🔹 DETAILS (UNCHANGED)
========================================================= */
export const getOnboardingDetailsService = async (type, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }

  if (type === "college") {
    return CollegeOnboarding.findById(id)
      .populate("college")
      .populate("createdUser", "email role")
      .populate("reviewedBy", "email")
      .lean();
  }

  if (type === "company") {
    return CompanyOnboarding.findById(id)
      .populate("company")
      .populate("createdUser", "email role")
      .populate("reviewedBy", "email")
      .lean();
  }

  throw new Error("Invalid type");
};