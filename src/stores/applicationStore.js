/**
 * In-memory application store — acts as a shared state between the
 * application form and the My Schemes tracker.
 *
 * Since we have no backend, we keep applied schemes in this module-level
 * array.  Any component that imports `getAppliedSchemes` / `addAppliedScheme`
 * will share the same data within the current browser session.
 */

import { SCHEMES as STATIC_SCHEMES, STAGE_TIMELINES, DOCUMENTS_MAP, STAGE_CONFIG } from '../data/mockData';
import { saveApplication } from '../firebase';

// ── runtime store ──────────────────────────────────────────────────────────────
let _schemes = [...STATIC_SCHEMES];
let _timelines = { ...STAGE_TIMELINES };
let _documents = { ...DOCUMENTS_MAP };
const _listeners = new Set();

const emit = () => _listeners.forEach(fn => fn());

export const subscribe = (fn) => {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
};

export const getAppliedSchemes = () => _schemes;
export const getTimelines      = () => _timelines;
export const getDocuments      = () => _documents;

/**
 * Hydrate the store from Firestore applications.
 */
export const setAppliedSchemes = (apps) => {
  // 1. Build schemes list
  _schemes = apps.map(a => ({
    id:          a.id,
    name:        a.schemeName,
    emoji:       a.schemeEmoji,
    category:    a.schemeCategory,
    appliedDate: a.appliedDate || (a.createdAt instanceof Date ? a.createdAt.toISOString().split('T')[0] : a.createdAt),
    amount:      a.schemeAmount,
    amountNum:   0,
    description: `Applied via ${a.applicantName}`,
    _applicant:  a.applicantName,
    _state:      a.state,
    status:      a.status || 'Pending'
  }));

  // 2. Build timelines (fallback to dummy based on status)
  apps.forEach(a => {
    const d = a.appliedDate || (a.createdAt instanceof Date ? a.createdAt.toISOString().split('T')[0] : a.createdAt);
    _timelines[a.id] = {
      applied:   { completedDate: d, expectedDate: d },
      verified:  { completedDate: a.status !== 'Pending' ? d : null, expectedDate: addDays(d, 8) },
      approved:  { completedDate: a.status === 'Approved' ? d : null, expectedDate: addDays(d, 21) },
      disbursed: { completedDate: null, expectedDate: addDays(d, 36) },
    };
    
    _documents[a.id] = [
      { id: 'd1', name: 'Aadhaar Card', status: 'pending', required: true },
      { id: 'd2', name: 'Income Certificate', status: 'pending', required: true },
    ];
  });

  emit();
};

// ── add a newly submitted application ─────────────────────────────────────────
export async function addAppliedScheme({ schemeName, schemeEmoji, schemeCategory, schemeAmount, applicantName, income, state, fileUrl, fileName }) {
  const today = new Date().toISOString().split('T')[0];
  const id = `APPLY-${Date.now()}`;

  // ── Sync to Firebase ──
  saveApplication({
    schemeName,
    schemeEmoji: schemeEmoji || '📄',
    schemeCategory,
    schemeAmount,
    applicantName,
    income,
    state,
    appliedDate: today,
    fileUrl: fileUrl || null,
    fileName: fileName || null,
  }).then(res => {
    if (res.success) console.log("✓ Firebase Sync Success:", res.id);
  });

  // Build a new scheme entry for the tracker list
  _schemes = [
    {
      id,
      name:        schemeName,
      nameHi:      schemeName,
      category:    schemeCategory || 'General',
      appliedDate: today,
      amount:      schemeAmount   || '₹ —',
      amountNum:   0,
      description: `Application submitted by ${applicantName}`,
      instalments: [],
      _new: true,
      _file: fileName || null,
      _fileUrl: fileUrl || null,
      _applicant: applicantName,
      _state: state,
    },
    ..._schemes,
  ];

  // Build a fresh timeline starting at "applied"
  _timelines = {
    ..._timelines,
    [id]: {
      applied:   { completedDate: today,    expectedDate: today },
      verified:  { completedDate: null,     expectedDate: addDays(today, 8) },
      approved:  { completedDate: null,     expectedDate: addDays(today, 21) },
      disbursed: { completedDate: null,     expectedDate: addDays(today, 36) },
    },
  };

  // Build basic document list
  _documents = {
    ..._documents,
    [id]: [
      { id: 'd1', name: 'Aadhaar Card',        status: 'pending',   required: true },
      { id: 'd2', name: 'Income Certificate',  status: 'pending',   required: true },
      { id: 'd3', name: uploadedFile?.name || 'Uploaded Document', status: 'submitted', required: true },
    ],
  };

  emit();
  return id;
}

// ── helper ─────────────────────────────────────────────────────────────────────
function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── activeStageIndex for dynamic schemes ──────────────────────────────────────
export function getDynActiveStageIndex(schemeId) {
  const tl = _timelines[schemeId];
  if (!tl) return 0;
  const stages = ['applied', 'verified', 'approved', 'disbursed'];
  let active = 0;
  stages.forEach((s, i) => { if (tl[s]?.completedDate) active = i + 1; });
  return Math.min(active, 3);
}
