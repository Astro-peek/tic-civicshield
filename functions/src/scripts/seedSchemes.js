const { getDb, getFirebaseAdmin } = require("../config/firebaseAdmin");

const sampleSchemes = [
  {
    id: "pm_kisan_support",
    name: "PM Kisan Support",
    description: "Income support for small and marginal farmers.",
    priority: 95,
    minimumScore: 60,
    active: true,
    metadata: {
      sector: "agriculture",
      level: "national",
    },
    conditions: [
      {
        field: "occupation",
        operator: "eq",
        value: "farmer",
        weight: 4,
        required: true,
        explanation: "Applicant must be a farmer.",
      },
      {
        field: "income",
        operator: "lte",
        value: 500000,
        weight: 3,
        required: false,
        explanation: "Household income should be up to ₹5,00,000.",
      },
      {
        field: "flags",
        operator: "contains",
        value: "landholder",
        weight: 2,
        required: false,
        explanation: "Landholder farmers are prioritized.",
      },
    ],
  },
  {
    id: "state_sc_scholarship",
    name: "State SC Scholarship",
    description: "Scholarship support for SC category students.",
    priority: 85,
    minimumScore: 55,
    active: true,
    metadata: {
      sector: "education",
      level: "state",
    },
    conditions: [
      {
        field: "category",
        operator: "eq",
        value: "sc",
        weight: 5,
        required: true,
        explanation: "Only SC category applicants are eligible.",
      },
      {
        field: "age",
        operator: "between",
        value: [14, 30],
        weight: 2,
        required: false,
        explanation: "Target age group is 14-30 years.",
      },
      {
        field: "income",
        operator: "lte",
        value: 300000,
        weight: 3,
        required: false,
        explanation: "Lower-income applicants are preferred.",
      },
    ],
  },
  {
    id: "women_entrepreneur_loan",
    name: "Women Entrepreneur Loan",
    description: "Credit support for women-led micro enterprises.",
    priority: 90,
    minimumScore: 60,
    active: true,
    metadata: {
      sector: "enterprise",
      level: "national",
    },
    conditions: [
      {
        field: "flags",
        operator: "contains",
        value: "female",
        weight: 5,
        required: true,
        explanation: "Scheme is for women applicants.",
      },
      {
        field: "occupation",
        operator: "in",
        value: ["self-employed", "entrepreneur", "business_owner"],
        weight: 3,
        required: false,
        explanation: "Self-employed or entrepreneur applicants are preferred.",
      },
      {
        field: "income",
        operator: "lte",
        value: 800000,
        weight: 2,
        required: false,
        explanation: "Targeted for small businesses with moderate income.",
      },
    ],
  },
];

async function seed() {
  const db = getDb();
  const admin = getFirebaseAdmin();
  const batch = db.batch();

  sampleSchemes.forEach((scheme) => {
    const ref = db.collection("schemes").doc(scheme.id);
    batch.set(ref, {
      ...scheme,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`Seeded ${sampleSchemes.length} schemes.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed schemes:", error);
    process.exit(1);
  });
