// ─── Schemes ──────────────────────────────────────────────────────────────────
export const SCHEMES = [
  {
    id: 'PM-KISAN-2024-001',
    name: 'PM-KISAN Samman Nidhi',
    nameHi: 'पीएम किसान सम्मान निधि',
    category: 'Agriculture',
    appliedDate: '2024-12-01',
    amount: '₹6,000',
    amountNum: 6000,
    description: 'Direct income support for small and marginal farmers',
    instalments: [
      { id: 'i1', label: '1st Instalment', labelHi: 'पहली किस्त', amount: 2000, date: '2024-04-15', status: 'paid' },
      { id: 'i2', label: '2nd Instalment', labelHi: 'दूसरी किस्त', amount: 2000, date: '2024-08-10', status: 'paid' },
      { id: 'i3', label: '3rd Instalment', labelHi: 'तीसरी किस्त', amount: 2000, date: '2024-12-31', status: 'pending' },
    ],
  },
  {
    id: 'PMAY-2024-002',
    name: 'Pradhan Mantri Awas Yojana',
    nameHi: 'प्रधानमंत्री आवास योजना',
    category: 'Housing',
    appliedDate: '2024-11-15',
    amount: '₹1,20,000',
    amountNum: 120000,
    description: 'Housing for All - affordable housing scheme',
    instalments: [
      { id: 'i1', label: '1st Tranche', labelHi: 'पहली किश्त', amount: 50000, date: '2024-12-10', status: 'paid' },
      { id: 'i2', label: '2nd Tranche', labelHi: 'दूसरी किश्त', amount: 40000, date: '2025-01-15', status: 'pending' },
      { id: 'i3', label: '3rd Tranche', labelHi: 'तीसरी किश्त', amount: 30000, date: '2025-03-01', status: 'upcoming' },
    ],
  },
  {
    id: 'AYUSH-2024-003',
    name: 'Ayushman Bharat PM-JAY',
    nameHi: 'आयुष्मान भारत पीएम-जेएवाई',
    category: 'Health',
    appliedDate: '2025-01-10',
    amount: '₹5,00,000',
    amountNum: 500000,
    description: 'Health insurance coverage for low income families',
    instalments: [
      { id: 'i1', label: 'Card Activation', labelHi: 'कार्ड सक्रियण', amount: 500000, date: '2025-01-25', status: 'upcoming' },
    ],
  },
]

// ─── Stages ────────────────────────────────────────────────────────────────────
export const STAGE_CONFIG = [
  { id: 'applied',   label: 'Applied',   labelHi: 'आवेदन',     icon: '📋', description: 'Application submitted successfully', descHi: 'आवेदन सफलतापूर्वक जमा' },
  { id: 'verified',  label: 'Verified',  labelHi: 'सत्यापित',   icon: '🔍', description: 'Documents & eligibility under review', descHi: 'दस्तावेज़ और पात्रता की जांच' },
  { id: 'approved',  label: 'Approved',  labelHi: 'स्वीकृत',    icon: '✅', description: 'Application approved by authority', descHi: 'प्राधिकरण द्वारा अनुमोदित' },
  { id: 'disbursed', label: 'Disbursed', labelHi: 'भुगतान',     icon: '💰', description: 'Benefit transferred to your account', descHi: 'लाभ आपके खाते में ट्रांसफर' },
]

// ─── Documents ─────────────────────────────────────────────────────────────────
export const DOCUMENTS_MAP = {
  'PM-KISAN-2024-001': [
    { id: 'd1', name: 'Aadhaar Card',               nameHi: 'आधार कार्ड',              status: 'submitted', required: true },
    { id: 'd2', name: 'Land Records (Khasra)',       nameHi: 'भूमि अभिलेख (खसरा)',     status: 'submitted', required: true },
    { id: 'd3', name: 'Bank Account Details',        nameHi: 'बैंक खाता विवरण',         status: 'submitted', required: true },
    { id: 'd4', name: 'Caste Certificate',           nameHi: 'जाति प्रमाण पत्र',         status: 'pending',   required: false },
    { id: 'd5', name: 'Income Certificate',          nameHi: 'आय प्रमाण पत्र',           status: 'missing',   required: true },
  ],
  'PMAY-2024-002': [
    { id: 'd1', name: 'Aadhaar Card',               nameHi: 'आधार कार्ड',              status: 'submitted', required: true },
    { id: 'd2', name: 'Income Certificate',          nameHi: 'आय प्रमाण पत्र',           status: 'submitted', required: true },
    { id: 'd3', name: 'Property Documents',          nameHi: 'संपत्ति दस्तावेज़',         status: 'pending',   required: true },
    { id: 'd4', name: 'Bank Passbook',              nameHi: 'बैंक पासबुक',              status: 'submitted', required: true },
    { id: 'd5', name: 'Ration Card',                nameHi: 'राशन कार्ड',              status: 'missing',   required: true },
    { id: 'd6', name: 'NOC from Gram Panchayat',    nameHi: 'ग्राम पंचायत से एनओसी',   status: 'pending',   required: true },
  ],
  'AYUSH-2024-003': [
    { id: 'd1', name: 'Aadhaar Card',               nameHi: 'आधार कार्ड',              status: 'submitted', required: true },
    { id: 'd2', name: 'Ration Card (BPL/SECC)',     nameHi: 'राशन कार्ड (बीपीएल)',     status: 'submitted', required: true },
    { id: 'd3', name: 'Family Composition Cert.',   nameHi: 'परिवार संरचना प्रमाण',    status: 'submitted', required: true },
    { id: 'd4', name: 'Income Proof',               nameHi: 'आय प्रमाण',               status: 'submitted', required: true },
  ],
}

// ─── Officers ──────────────────────────────────────────────────────────────────
export const OFFICERS_MAP = {
  'PM-KISAN-2024-001': { name: 'Shri Ramesh Kumar Verma', id: 'MP-AGR-2019-0431', department: 'Agriculture Department, MP', maxProcessingDays: 30, assignedDate: '2024-12-03' },
  'PMAY-2024-002':     { name: 'Smt. Priya Sharma',       id: 'MP-HOU-2020-0218', department: 'Housing & Urban Dev, MP',   maxProcessingDays: 45, assignedDate: '2024-11-18' },
  'AYUSH-2024-003':    { name: 'Dr. Anil Patel',          id: 'MP-HLT-2018-0872', department: 'Health Department, MP',     maxProcessingDays: 15, assignedDate: '2025-01-12' },
}

// ─── Timelines ─────────────────────────────────────────────────────────────────
export const STAGE_TIMELINES = {
  'PM-KISAN-2024-001': {
    applied:   { completedDate: '2024-12-01', expectedDate: '2024-12-01' },
    verified:  { completedDate: '2024-12-08', expectedDate: '2024-12-10' },
    approved:  { completedDate: null,         expectedDate: '2024-12-20' },
    disbursed: { completedDate: null,         expectedDate: '2024-12-31' },
  },
  'PMAY-2024-002': {
    applied:   { completedDate: '2024-11-15', expectedDate: '2024-11-15' },
    verified:  { completedDate: '2024-11-25', expectedDate: '2024-11-28' },
    approved:  { completedDate: '2024-12-10', expectedDate: '2024-12-15' },
    disbursed: { completedDate: null,         expectedDate: '2025-01-15' },
  },
  'AYUSH-2024-003': {
    applied:   { completedDate: '2025-01-10', expectedDate: '2025-01-10' },
    verified:  { completedDate: null,         expectedDate: '2025-01-18' },
    approved:  { completedDate: null,         expectedDate: '2025-01-22' },
    disbursed: { completedDate: null,         expectedDate: '2025-01-25' },
  },
}

// ─── Next Step messages (bilingual) ────────────────────────────────────────────
export const NEXT_STEPS = {
  'PM-KISAN-2024-001': {
    en: 'Upload your Income Certificate to avoid delays in approval.',
    hi: 'देरी से बचने के लिए आय प्रमाण पत्र अपलोड करें।',
    action: 'आय प्रमाण पत्र अपलोड करें',
    urgency: 'high',
  },
  'PMAY-2024-002': {
    en: 'Approved! Disbursement is being processed to your bank account.',
    hi: 'स्वीकृत! आपके बैंक खाते में राशि भेजी जा रही है।',
    action: 'बैंक खाता जांचें',
    urgency: 'low',
  },
  'AYUSH-2024-003': {
    en: 'Keep Aadhaar ready. Officer will verify within 8 days.',
    hi: 'आधार तैयार रखें। अधिकारी 8 दिनों में सत्यापन करेंगे।',
    action: 'दस्तावेज़ तैयार रखें',
    urgency: 'medium',
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const getActiveStageIndex = (schemeId) => {
  const tl = STAGE_TIMELINES[schemeId]
  const stages = ['applied','verified','approved','disbursed']
  let active = 0
  stages.forEach((s, i) => { if (tl[s].completedDate) active = i + 1 })
  return Math.min(active, 3)
}

export const getDelayDays = (schemeId) => {
  const officer = OFFICERS_MAP[schemeId]
  const applied = SCHEMES.find(s => s.id === schemeId)?.appliedDate
  if (!applied) return 0
  const days = Math.floor((new Date() - new Date(applied)) / 86400000)
  return Math.max(0, days - officer.maxProcessingDays)
}

export const getTotalEntitled = () => SCHEMES.reduce((s, sc) => s + sc.amountNum, 0)

export const getTotalReceived = () => SCHEMES.reduce((sum, sc) => {
  const paid = (sc.instalments || []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  return sum + paid
}, 0)

export const WEBHOOK_URL = 'https://alwysaashish.app.n8n.cloud/webhook-test/report-issue'

// ─── Phase 2: Complete 35-Scheme Database ───────────────────────────────────────
export const ALL_AVAILABLE_SCHEMES = [
  { id: 1, name: 'Ayushman Bharat PM-JAY', nameHi: 'आयुष्मान भारत पीएम-जेएवाई', emoji: '🏥', category: 'Health', color: '#00E5A0', benefit: '₹5 lakh health insurance per year', benefitNum: 500000, description: 'Free hospitalisation at empanelled govt & private hospitals for BPL and low-income families.', descHi: 'बीपीएल और कम आय वाले परिवारों के लिए सरकारी व निजी अस्पतालों में मुफ्त इलाज।', eligibility: { maxIncome: 500000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer','unemployed','homemaker','salaried','self','student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Ration Card / BPL Certificate','Family Composition Certificate','Income Certificate'], applyLink: 'https://pmjay.gov.in', ministry: 'Ministry of Health & Family Welfare', deadline: 'Ongoing' },
  { id: 2, name: 'Pradhan Mantri Suraksha Bima Yojana', nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना', emoji: '🛡️', category: 'Health', color: '#00E5A0', benefit: '₹2 lakh accident insurance at ₹20/year', benefitNum: 200000, description: 'Accidental death and disability cover of ₹2 lakh for just ₹20 premium per year.', descHi: 'सिर्फ ₹20 सालाना प्रीमियम पर ₹2 लाख का दुर्घटना बीमा।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer','unemployed','homemaker','salaried','self','student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Bank Account Details','Mobile Number'], applyLink: 'https://jansuraksha.gov.in', ministry: 'Ministry of Finance', deadline: 'Ongoing — enroll before 31 May' },
  { id: 3, name: 'Janani Suraksha Yojana', nameHi: 'जननी सुरक्षा योजना', emoji: '🤱', category: 'Health', color: '#00E5A0', benefit: 'Cash assistance up to ₹1,400 for delivery', benefitNum: 1400, description: 'Cash incentive to pregnant women from BPL families for institutional delivery at govt hospitals.', descHi: 'बीपीएल गर्भवती महिलाओं को सरकारी अस्पताल में प्रसव के लिए नकद सहायता।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['homemaker','unemployed','farmer'], genders: ['female'], states: ['all'] }, requiredDocs: ['Aadhaar Card','BPL Card','MCH Card','Bank Account'], applyLink: 'https://nhm.gov.in', ministry: 'Ministry of Health & Family Welfare', deadline: 'Ongoing' },
  { id: 4, name: 'PM Jeevan Jyoti Bima Yojana', nameHi: 'पीएम जीवन ज्योति बीमा योजना', emoji: '💉', category: 'Health', color: '#00E5A0', benefit: '₹2 lakh life cover at ₹436/year', benefitNum: 200000, description: 'Life insurance cover of ₹2 lakh for death due to any reason at very low premium.', descHi: 'किसी भी कारण से मृत्यु पर ₹2 लाख का जीवन बीमा, केवल ₹436 वार्षिक प्रीमियम।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer','unemployed','homemaker','salaried','self','student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Bank Account','Mobile Number'], applyLink: 'https://jansuraksha.gov.in', ministry: 'Ministry of Finance', deadline: 'Ongoing' },
  { id: 5, name: 'Rashtriya Swasthya Bima Yojana', nameHi: 'राष्ट्रीय स्वास्थ्य बीमा योजना', emoji: '🩺', category: 'Health', color: '#00E5A0', benefit: '₹30,000 health cover for BPL families', benefitNum: 30000, description: 'Smart card based cashless health insurance for BPL workers in unorganised sector.', descHi: 'असंगठित क्षेत्र के बीपीएल कार्यकर्ताओं के लिए स्मार्ट कार्ड आधारित कैशलेस स्वास्थ्य बीमा।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer','unemployed','homemaker','self'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['BPL Card','Aadhaar Card','Family Photo'], applyLink: 'https://labour.gov.in', ministry: 'Ministry of Labour & Employment', deadline: 'Ongoing' },
  { id: 6, name: 'National Scholarship Portal (NSP)', nameHi: 'राष्ट्रीय छात्रवृत्ति पोर्टल', emoji: '🎓', category: 'Education', color: '#60A5FA', benefit: 'Up to ₹12,000/year for studies', benefitNum: 12000, description: 'Central platform for all govt scholarships — pre-matric, post-matric and merit-based.', descHi: 'सभी सरकारी छात्रवृत्ति के लिए केंद्रीय मंच।', eligibility: { maxIncome: 500000, categories: ['obc','sc','st','minority'], occupations: ['student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Mark Sheets','Income Certificate','Caste Certificate','Bank Account'], applyLink: 'https://scholarships.gov.in', ministry: 'Ministry of Education', deadline: 'Oct–Nov every year' },
  { id: 7, name: 'PM Vidya Lakshmi Education Loan', nameHi: 'पीएम विद्या लक्ष्मी एजुकेशन लोन', emoji: '📚', category: 'Education', color: '#60A5FA', benefit: 'Education loan up to ₹6.5 lakh at low interest', benefitNum: 650000, description: 'Single window platform for education loans for students pursuing higher studies.', descHi: 'उच्च शिक्षा के लिए एजुकेशन लोन का एकल खिड़की मंच।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Admission Letter','Mark Sheets','Income Proof'], applyLink: 'https://vidyalakshmi.co.in', ministry: 'Ministry of Finance', deadline: 'Ongoing' },
  { id: 8, name: 'SC Post Matric Scholarship', nameHi: 'अनुसूचित जाति पोस्ट मैट्रिक छात्रवृत्ति', emoji: '📖', category: 'Education', color: '#60A5FA', benefit: 'Full tuition + ₹550–₹1,200 maintenance/month', benefitNum: 14400, description: 'Scholarship for SC students pursuing post-matriculation or post-secondary education.', descHi: 'अनुसूचित जाति के छात्रों के लिए पोस्ट मैट्रिक शिक्षा हेतु छात्रवृत्ति।', eligibility: { maxIncome: 250000, categories: ['sc'], occupations: ['student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Caste Certificate','Income Certificate','Mark Sheets','Aadhaar Card','Bank Account'], applyLink: 'https://scholarships.gov.in', ministry: 'Ministry of Social Justice', deadline: 'Oct–Nov every year' },
  { id: 9, name: 'Begum Hazrat Mahal Scholarship', nameHi: 'बेगम हजरत महल छात्रवृत्ति', emoji: '🌟', category: 'Education', color: '#60A5FA', benefit: '₹5,000–₹6,000/year for minority girls', benefitNum: 6000, description: 'Scholarship for meritorious girls from minority communities studying in class 9–12.', descHi: 'अल्पसंख्यक समुदाय की मेधावी बालिकाओं के लिए छात्रवृत्ति।', eligibility: { maxIncome: 250000, categories: ['obc','minority'], occupations: ['student'], genders: ['female'], states: ['all'] }, requiredDocs: ['Minority Certificate','Income Certificate','Mark Sheets','Aadhaar Card'], applyLink: 'https://scholarships.gov.in', ministry: 'Maulana Azad Education Foundation', deadline: 'Sep–Oct every year' },
  { id: 10, name: 'Ishan Uday Scholarship (NE States)', nameHi: 'ईशान उदय छात्रवृत्ति', emoji: '🏔️', category: 'Education', color: '#60A5FA', benefit: '₹5,400–₹7,800/month for NE students', benefitNum: 93600, description: 'Special scholarship for students from North East states pursuing higher education.', descHi: 'उत्तर पूर्वी राज्यों के छात्रों के लिए विशेष छात्रवृत्ति।', eligibility: { maxIncome: 500000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['student'], genders: ['male','female','other'], states: ['other'] }, requiredDocs: ['Domicile Certificate (NE State)','Income Certificate','Admission Letter','Mark Sheets'], applyLink: 'https://scholarships.gov.in', ministry: 'UGC / Ministry of Education', deadline: 'Sep–Oct every year' },
  { id: 11, name: 'MGNREGA', nameHi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी', emoji: '⛏️', category: 'Employment', color: '#FB923C', benefit: '100 days guaranteed wage employment', benefitNum: 20400, description: 'Provides at least 100 days of unskilled manual work per year to rural households.', descHi: 'ग्रामीण परिवारों को प्रति वर्ष कम से कम 100 दिन का रोजगार।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['unemployed','farmer','homemaker'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Job Card (from Gram Panchayat)','Bank Account'], applyLink: 'https://nrega.nic.in', ministry: 'Ministry of Rural Development', deadline: 'Ongoing' },
  { id: 12, name: 'PM Kaushal Vikas Yojana', nameHi: 'प्रधानमंत्री कौशल विकास योजना', emoji: '🔧', category: 'Employment', color: '#FB923C', benefit: 'Free skill training + ₹8,000 reward', benefitNum: 8000, description: 'Free short-term skill training in industry-relevant courses with certification and placement support.', descHi: 'उद्योग-प्रासंगिक पाठ्यक्रमों में मुफ्त कौशल प्रशिक्षण।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['unemployed','student','homemaker'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','10th Marksheet','Bank Account'], applyLink: 'https://pmkvyofficial.org', ministry: 'Ministry of Skill Development', deadline: 'Ongoing (batch-wise)' },
  { id: 13, name: 'Startup India Seed Fund', nameHi: 'स्टार्टअप इंडिया सीड फंड', emoji: '🚀', category: 'Employment', color: '#FB923C', benefit: 'Seed funding up to ₹20 lakh for startups', benefitNum: 2000000, description: 'Financial assistance to startups for proof of concept, prototype development and market entry.', descHi: 'स्टार्टअप के लिए प्रूफ ऑफ कॉन्सेप्ट और मार्केट एंट्री हेतु वित्तीय सहायता।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['self','student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['DPIIT Recognition Certificate','Business Plan','Aadhaar Card','PAN Card'], applyLink: 'https://seedfund.startupindia.gov.in', ministry: 'DPIIT, Ministry of Commerce', deadline: 'Rolling applications' },
  { id: 14, name: 'PM SVANidhi (Street Vendor Loan)', nameHi: 'पीएम स्वनिधि (पथ विक्रेता ऋण)', emoji: '🛒', category: 'Employment', color: '#FB923C', benefit: 'Working capital loan up to ₹50,000', benefitNum: 50000, description: 'Collateral-free loans for street vendors to restart livelihoods with digital payment incentives.', descHi: 'पथ विक्रेताओं के लिए बिना गारंटी के ऋण।', eligibility: { maxIncome: 100000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['self','unemployed'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Vendor Certificate / LoR from ULB','Bank Account'], applyLink: 'https://pmsvanidhi.mohua.gov.in', ministry: 'Ministry of Housing & Urban Affairs', deadline: 'Ongoing' },
  { id: 15, name: 'Deen Dayal Upadhyaya Grameen Kaushalya', nameHi: 'दीन दयाल उपाध्याय ग्रामीण कौशल्या', emoji: '🏭', category: 'Employment', color: '#FB923C', benefit: 'Free training + guaranteed placement', benefitNum: 15000, description: 'Skilling rural youth with placement-linked training in manufacturing, services and agriculture sectors.', descHi: 'ग्रामीण युवाओं को रोजगार से जुड़ा नि:शुल्क प्रशिक्षण।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['unemployed','student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Age Proof','Education Certificate','BPL Card (if applicable)'], applyLink: 'https://ddugky.gov.in', ministry: 'Ministry of Rural Development', deadline: 'Batch-wise enrollment' },
  { id: 16, name: 'PM-Kisan Samman Nidhi', nameHi: 'पीएम किसान सम्मान निधि', emoji: '👨‍🌾', category: 'Agriculture', color: '#FFD93D', benefit: '₹6,000/year directly in bank account', benefitNum: 6000, description: 'Direct income support of ₹6,000/year in 3 instalments to small and marginal farmers.', descHi: 'छोटे और सीमांत किसानों को ₹6,000 वार्षिक तीन किस्तों में सीधे बैंक खाते में।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Land Records (Khasra/Khatauni)','Bank Account','Mobile Number'], applyLink: 'https://pmkisan.gov.in', ministry: 'Ministry of Agriculture', deadline: 'Ongoing' },
  { id: 17, name: 'PM Fasal Bima Yojana', nameHi: 'प्रधानमंत्री फसल बीमा योजना', emoji: '🌾', category: 'Agriculture', color: '#FFD93D', benefit: 'Crop insurance at just 2% premium', benefitNum: 100000, description: 'Comprehensive crop insurance against natural calamities, pests and diseases at very low premium.', descHi: 'प्राकृतिक आपदाओं, कीटों और बीमारियों के खिलाफ फसल बीमा।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Land Records','Bank Account','Sowing Certificate'], applyLink: 'https://pmfby.gov.in', ministry: 'Ministry of Agriculture', deadline: 'Kharif: July | Rabi: December' },
  { id: 18, name: 'Kisan Credit Card (KCC)', nameHi: 'किसान क्रेडिट कार्ड', emoji: '💳', category: 'Agriculture', color: '#FFD93D', benefit: 'Credit up to ₹3 lakh at 4% interest', benefitNum: 300000, description: 'Easy and timely credit access for farmers to meet agricultural and allied activity needs.', descHi: 'किसानों को कृषि आवश्यकताओं के लिए आसान और समय पर ऋण।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Land Records','Bank Account','Passport Photo'], applyLink: 'https://www.nabard.org', ministry: 'Ministry of Agriculture / NABARD', deadline: 'Ongoing' },
  { id: 19, name: 'PM Krishi Sinchai Yojana', nameHi: 'प्रधानमंत्री कृषि सिंचाई योजना', emoji: '💧', category: 'Agriculture', color: '#FFD93D', benefit: 'Subsidy on drip & sprinkler irrigation', benefitNum: 50000, description: 'More crop per drop — subsidised micro-irrigation systems to improve water use efficiency.', descHi: 'अधिक फसल प्रति बूंद — सूक्ष्म सिंचाई पर सब्सिडी।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Land Records','Bank Account'], applyLink: 'https://pmksy.gov.in', ministry: 'Ministry of Jal Shakti', deadline: 'Ongoing' },
  { id: 20, name: 'Soil Health Card Scheme', nameHi: 'मृदा स्वास्थ्य कार्ड योजना', emoji: '🌱', category: 'Agriculture', color: '#FFD93D', benefit: 'Free soil testing + fertiliser advice', benefitNum: 2000, description: 'Free soil health card with crop-wise nutrient recommendations to reduce input costs.', descHi: 'मुफ्त मिट्टी परीक्षण और फसलवार पोषक तत्व सिफारिश।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Land Records'], applyLink: 'https://soilhealth.dac.gov.in', ministry: 'Ministry of Agriculture', deadline: 'Ongoing' },
  { id: 21, name: 'PM Awas Yojana (Urban)', nameHi: 'प्रधानमंत्री आवास योजना (शहरी)', emoji: '🏙️', category: 'Housing', color: '#A78BFA', benefit: 'Subsidy up to ₹2.67 lakh on home loan', benefitNum: 267000, description: 'Interest subsidy on home loans for EWS, LIG and MIG categories under Housing for All mission.', descHi: 'सभी के लिए आवास मिशन के तहत गृह ऋण पर ब्याज सब्सिडी।', eligibility: { maxIncome: 500000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['salaried','self','farmer','unemployed','homemaker'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Income Certificate','Property Documents','Bank Account','NOC from Gram Panchayat'], applyLink: 'https://pmaymis.gov.in', ministry: 'Ministry of Housing & Urban Affairs', deadline: 'Ongoing' },
  { id: 22, name: 'PM Awas Yojana (Gramin)', nameHi: 'प्रधानमंत्री आवास योजना (ग्रामीण)', emoji: '🏡', category: 'Housing', color: '#A78BFA', benefit: '₹1.2–1.3 lakh grant for rural house', benefitNum: 130000, description: 'Financial assistance to homeless or kutcha house dwellers in rural areas for pucca house construction.', descHi: 'ग्रामीण क्षेत्रों में बेघर या कच्चे मकान वालों को पक्का मकान बनाने के लिए सहायता।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['farmer','unemployed','homemaker'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','BPL Card','Bank Account','Land Proof'], applyLink: 'https://pmayg.nic.in', ministry: 'Ministry of Rural Development', deadline: 'Ongoing (SECC list based)' },
  { id: 23, name: 'Rajiv Awas Yojana', nameHi: 'राजीव आवास योजना', emoji: '🏘️', category: 'Housing', color: '#A78BFA', benefit: 'Affordable housing for slum dwellers', benefitNum: 100000, description: 'Housing and infrastructure support for slum dwellers and urban poor.', descHi: 'झुग्गी-झोपड़ी वासियों और शहरी गरीबों के लिए आवास।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['unemployed','self','homemaker'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Slum Resident Proof','Income Certificate','Bank Account'], applyLink: 'https://mhupa.gov.in', ministry: 'Ministry of Housing & Urban Affairs', deadline: 'Ongoing' },
  { id: 24, name: 'NHB Subsidy Scheme', nameHi: 'एनएचबी सब्सिडी योजना', emoji: '🏦', category: 'Housing', color: '#A78BFA', benefit: 'Interest subsidy on housing loans', benefitNum: 200000, description: 'National Housing Bank offers interest subsidy under Credit Linked Subsidy Scheme for home buyers.', descHi: 'राष्ट्रीय आवास बैंक की क्रेडिट लिंक्ड सब्सिडी योजना।', eligibility: { maxIncome: 500000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['salaried','self'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Income Proof','Property Documents','Bank Statement'], applyLink: 'https://nhb.org.in', ministry: 'National Housing Bank', deadline: 'Ongoing' },
  { id: 25, name: 'Indira Awaas Yojana', nameHi: 'इंदिरा आवास योजना', emoji: '🛖', category: 'Housing', color: '#A78BFA', benefit: '₹75,000 grant for BPL rural housing', benefitNum: 75000, description: 'Grant for construction of dwelling units for BPL families in rural areas.', descHi: 'ग्रामीण क्षेत्रों में बीपीएल परिवारों के लिए आवास अनुदान।', eligibility: { maxIncome: 100000, categories: ['sc','st','obc','ews','minority'], occupations: ['farmer','unemployed','homemaker'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['BPL Card','Aadhaar Card','Land Proof','Bank Account'], applyLink: 'https://pmayg.nic.in', ministry: 'Ministry of Rural Development', deadline: 'Ongoing' },
  { id: 26, name: 'Sukanya Samriddhi Yojana', nameHi: 'सुकन्या समृद्धि योजना', emoji: '👧', category: 'Women', color: '#F472B6', benefit: '8.2% interest savings for girl child', benefitNum: 150000, description: 'High interest savings scheme for girl child with tax benefits under Section 80C.', descHi: 'बालिका के लिए उच्च ब्याज बचत योजना, धारा 80C के तहतकर लाभ।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['student','homemaker','salaried','self','farmer','unemployed'], genders: ['female'], states: ['all'] }, requiredDocs: ["Girl Child's Birth Certificate","Parent's Aadhaar Card","Parent's PAN Card"], applyLink: 'https://www.indiapost.gov.in', ministry: 'Ministry of Finance', deadline: 'Ongoing (open account before girl turns 10)' },
  { id: 27, name: 'Beti Bachao Beti Padhao', nameHi: 'बेटी बचाओ बेटी पढ़ाओ', emoji: '🌸', category: 'Women', color: '#F472B6', benefit: 'Education & welfare support for girls', benefitNum: 50000, description: 'Addresses declining child sex ratio and promotes welfare, education and empowerment of girl child.', descHi: 'बालिकाओं के कल्याण, शिक्षा और सशक्तिकरण को बढ़ावा।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['student','homemaker'], genders: ['female'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Birth Certificate','School Enrollment Proof'], applyLink: 'https://wcd.nic.in', ministry: 'Ministry of Women & Child Development', deadline: 'Ongoing' },
  { id: 28, name: 'Ujjwala Yojana', nameHi: 'उज्ज्वला योजना', emoji: '🔥', category: 'Women', color: '#F472B6', benefit: 'Free LPG connection for BPL women', benefitNum: 1600, description: 'Free LPG connections to women from BPL households to provide clean cooking fuel.', descHi: 'बीपीएल महिलाओं को मुफ्त एलपीजी कनेक्शन।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['homemaker','unemployed','farmer'], genders: ['female'], states: ['all'] }, requiredDocs: ['Aadhaar Card','BPL Card / Ration Card','Bank Account','Passport Photo'], applyLink: 'https://pmuy.gov.in', ministry: 'Ministry of Petroleum & Natural Gas', deadline: 'Ongoing' },
  { id: 29, name: 'Mahila Shakti Kendra Scheme', nameHi: 'महिला शक्ति केंद्र योजना', emoji: '💪', category: 'Women', color: '#F472B6', benefit: 'Skill training + awareness for rural women', benefitNum: 10000, description: 'Empowers rural women through community engagement, skill development and digital literacy.', descHi: 'ग्रामीण महिलाओं को कौशल विकास और डिजिटल साक्षरता से सशक्त बनाना।', eligibility: { maxIncome: 500000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['homemaker','unemployed','farmer'], genders: ['female'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Bank Account'], applyLink: 'https://wcd.nic.in', ministry: 'Ministry of Women & Child Development', deadline: 'Ongoing' },
  { id: 30, name: 'Janani Suraksha Yojana (Women)', nameHi: 'जननी सुरक्षा योजना (महिला)', emoji: '🤱', category: 'Women', color: '#F472B6', benefit: 'Cash up to ₹1,400 for safe delivery', benefitNum: 1400, description: 'Cash incentive to pregnant BPL women for institutional delivery at government hospitals.', descHi: 'सरकारी अस्पताल में प्रसव के लिए बीपीएल गर्भवती महिलाओं को नकद प्रोत्साहन।', eligibility: { maxIncome: 250000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['homemaker','unemployed','farmer'], genders: ['female'], states: ['all'] }, requiredDocs: ['BPL Card','MCH Card','Aadhaar Card','Bank Account'], applyLink: 'https://nhm.gov.in', ministry: 'Ministry of Health & Family Welfare', deadline: 'Ongoing' },
  { id: 31, name: 'PM Mudra Yojana', nameHi: 'प्रधानमंत्री मुद्रा योजना', emoji: '💼', category: 'Business', color: '#34D399', benefit: 'Business loan up to ₹10 lakh', benefitNum: 1000000, description: 'Collateral-free loans for non-corporate small businesses — Shishu, Kishor and Tarun tiers.', descHi: 'छोटे व्यवसायों के लिए बिना गारंटी के ऋण — शिशु, किशोर और तरुण।', eligibility: { maxIncome: 1000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['self','farmer'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','PAN Card','Business Proof','Bank Statement (6 months)','Passport Photo'], applyLink: 'https://mudra.org.in', ministry: 'Ministry of Finance / MUDRA', deadline: 'Ongoing' },
  { id: 32, name: 'Stand Up India', nameHi: 'स्टैंड अप इंडिया', emoji: '🏅', category: 'Business', color: '#34D399', benefit: 'Loan ₹10 lakh–₹1 crore for SC/ST/Women', benefitNum: 10000000, description: 'Bank loans for SC, ST and women entrepreneurs to set up greenfield enterprises.', descHi: 'एससी, एसटी और महिला उद्यमियों के लिए बैंक ऋण।', eligibility: { maxIncome: 10000000, categories: ['sc','st','minority'], occupations: ['self'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Caste Certificate','Business Plan','PAN Card','Bank Account'], applyLink: 'https://standupindia.in', ministry: 'Ministry of Finance', deadline: 'Ongoing' },
  { id: 33, name: 'Startup India Initiative', nameHi: 'स्टार्टअप इंडिया पहल', emoji: '🚀', category: 'Business', color: '#34D399', benefit: 'Tax exemption + funding + mentorship', benefitNum: 5000000, description: '3-year tax holiday, patent support, fast-track exit and access to ₹10,000 crore fund of funds.', descHi: '3 साल की टैक्स छूट, पेटेंट सहायता और फंड ऑफ फंड्स तक पहुंच।', eligibility: { maxIncome: 10000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['self','student'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['DPIIT Recognition','Business Plan','PAN Card','Incorporation Certificate'], applyLink: 'https://startupindia.gov.in', ministry: 'DPIIT, Ministry of Commerce', deadline: 'Rolling applications' },
  { id: 34, name: 'CGTMSE Scheme', nameHi: 'सीजीटीएमएसई योजना', emoji: '🏛️', category: 'Business', color: '#34D399', benefit: 'Collateral-free loan up to ₹2 crore', benefitNum: 20000000, description: 'Credit guarantee for MSMEs — get business loans without collateral or third party guarantee.', descHi: 'एमएसएमई के लिए बिना संपार्श्विक के ऋण गारंटी।', eligibility: { maxIncome: 20000000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['self'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Business Registration','PAN Card','Bank Statement','Project Report','Aadhaar Card'], applyLink: 'https://cgtmse.in', ministry: 'Ministry of MSME', deadline: 'Ongoing' },
  { id: 35, name: 'PM SVANidhi (Street Vendors)', nameHi: 'पीएम स्वनिधि (पथ विक्रेता)', emoji: '🛒', category: 'Business', color: '#34D399', benefit: 'Working capital loan up to ₹50,000', benefitNum: 50000, description: 'Collateral-free working capital loans for street vendors with digital payment cashback rewards.', descHi: 'पथ विक्रेताओं के लिए डिजिटल भुगतान कैशबैक के साथ ऋण।', eligibility: { maxIncome: 100000, categories: ['general','obc','sc','st','ews','minority'], occupations: ['self','unemployed'], genders: ['male','female','other'], states: ['all'] }, requiredDocs: ['Aadhaar Card','Vendor Certificate','Bank Account','Mobile Number'], applyLink: 'https://pmsvanidhi.mohua.gov.in', ministry: 'Ministry of Housing & Urban Affairs', deadline: 'Ongoing' },
];
