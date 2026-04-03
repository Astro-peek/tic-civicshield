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
  // Logic to move the tracker (Coming in Task 9)
  emit();
}