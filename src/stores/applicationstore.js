// src/stores/applicationStore.js
import { SCHEMES as STATIC_SCHEMES } from '../data/mockdata';

let _schemes = [...STATIC_SCHEMES];
const _listeners = new Set();

const emit = () => _listeners.forEach(fn => fn());

export const subscribe = (fn) => {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
};

export const getAppliedSchemes = () => _schemes;

export function addAppliedScheme(appData) {
  _schemes = [..._schemes, { ...appData, id: `APP-${Date.now()}` }];
  emit();
}

export function updateApplicationStage(id, stage) {

  emit();
}


export const getTimelines = () => ({
  'PM-KISAN-2024-001': {
    applied:  { completedDate: '2024-03-01' },
    verified: { expectedDate: '2024-03-15' },
    approved: { expectedDate: '2024-04-01' },
    disbursed: { expectedDate: '2024-04-15' },
  }
});

export const getDocuments = () => ({
  'PM-KISAN-2024-001': [
    { id: 'd1', name: 'Aadhaar Card', status: 'submitted' },
    { id: 'd2', name: 'Land Records', status: 'pending' },
  ]
});

export const getDynActiveStageIndex = (id) => 0; 