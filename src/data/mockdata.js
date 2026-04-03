// src/data/mockData.js
export const SCHEMES = [
  {
    id: 'PM-KISAN-2024-001',
    name: 'PM-KISAN Samman Nidhi',
    nameHi: 'पीएम किसान सम्मान निधि',
    category: 'Agriculture',
    amount: '₹6,000',
    amountNum: 6000,
    description: 'Direct income support for farmers',
    instalments: [
      { id: 'i1', label: '1st Instalment', amount: 2000, status: 'paid' },
      { id: 'i2', label: '2nd Instalment', amount: 2000, status: 'pending' },
    ],
  }
];

export const STAGE_CONFIG = [
  { id: 'applied',   label: 'Applied',   icon: '📋' },
  { id: 'verified',  label: 'Verified',  icon: '🔍' },
  { id: 'approved',  label: 'Approved',  icon: '✅' },
  { id: 'disbursed', label: 'Disbursed', icon: '💰' },
];