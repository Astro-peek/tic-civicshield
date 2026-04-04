import React, { useState } from 'react';
import EligibilityForm from './EligibilityForm';
import DigiLockerModal from './DigiLockerModal';
import SchemeResultList from './SchemeResultList';
import ApplyForm from './ApplyForm';
import MySchemes from './MySchemes';
import SuccessPopup from './SuccessPopup';
import { addAppliedScheme } from '../stores/applicationStore';
import { ALL_AVAILABLE_SCHEMES } from '../data/mockData';
import { uploadDocument } from "../config/firebase";

export default function SchemeFinder({ onApplicationSuccess }) {
  const [view, setView] = useState('eligibility'); // eligibility | results | my-schemes
  const [modal, setModal] = useState(null); // null | digilocker | apply | success | description
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [matchedSchemes, setMatchedSchemes] = useState([]);

  const handleFindSchemes = (profile) => {
    // ── Real-World Matching Engine ──
    const matches = ALL_AVAILABLE_SCHEMES.filter(s => {
      const { eligibility } = s;
      
      // 1. Income Check
      // (Original project uses ranges, we'll convert to simple numeric cap for this logic)
      if (profile.income > eligibility.maxIncome) return false;

      // 2. Category Check
      if (!eligibility.categories.includes(profile.category)) return false;

      // 3. Occupation Check
      if (!eligibility.occupations.includes(profile.occupation)) return false;

      // 4. Gender Check
      if (!eligibility.genders.includes(profile.gender)) return false;

      // 5. State Check
      if (!eligibility.states.includes('all') && !eligibility.states.includes(profile.state)) return false;

      return true;
    });

    setMatchedSchemes(matches);
    setView('results');
  };
  const handleDigiLocker = () => setModal('digilocker');
  const handleApply = (scheme) => {
    setSelectedScheme(scheme);
    setModal('apply');
  };
  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
    setModal('description');
  };
  
  const handleSubmitApp = async (formData) => {
    // 1. Storage Upload
    let docUrl = null;
    if (formData.file) {
      const uploadRes = await uploadDocument(formData.file, Date.now());
      if (uploadRes.success) {
        docUrl = uploadRes.url;
      }
    }

    // 2. Data Sync
    const appId = await addAppliedScheme({
      schemeName:     selectedScheme.name,
      schemeEmoji:    selectedScheme.emoji || '📄',
      schemeCategory: selectedScheme.category || 'General',
      schemeAmount:   selectedScheme.benefit,
      applicantName:  formData.name,
      income:         formData.income,
      state:          'India',
      fileUrl:        docUrl,
      fileName:       formData.file?.name || null,
    });

    if (onApplicationSuccess) {
      onApplicationSuccess(appId);
    }

    setModal('success');
  };

  const handleViewDashboard = () => {
    setModal(null);
    setView('my-schemes');
  };

  return (
    <div style={{ padding: '20px', maxWidth: 860, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: 12 }}>
        {['eligibility', 'results', 'my-schemes'].map(v => (
          <button 
            key={v}
            onClick={() => setView(v)}
            style={{ 
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: view === v ? '#4f8ef7' : 'transparent',
              color: view === v ? '#fff' : '#6b7fa8',
              fontSize: 12, fontWeight: 700, textTransform: 'capitalize'
            }}
          >
            {v.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Main Views */}
      <div style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        
        {view === 'eligibility' && (
          <EligibilityForm 
            onFind={handleFindSchemes} 
            onDigiLocker={handleDigiLocker} 
          />
        )}

        {view === 'results' && (
          <SchemeResultList 
            schemes={matchedSchemes}
            onApply={handleApply} 
            onViewDetails={handleViewDetails} 
          />
        )}

        {view === 'my-schemes' && (
          <MySchemes />
        )}
      </div>

      {/* Modals */}
      {modal === 'digilocker' && (
        <DigiLockerModal 
          onClose={() => setModal(null)} 
          onSuccess={() => setModal(null)} 
        />
      )}

      {modal === 'apply' && (
        <ApplyForm 
          scheme={selectedScheme}
          onBack={() => setModal(null)}
          onSubmit={handleSubmitApp}
        />
      )}

      {modal === 'success' && (
        <SuccessPopup 
          onClose={() => setModal(null)}
          onViewDashboard={handleViewDashboard}
        />
      )}

      {modal === 'description' && selectedScheme && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModal(null)}>
          <div style={{ background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 500, padding: 24, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b7fa8', fontSize: 22, cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 50, marginBottom: 12 }}>{selectedScheme.emoji || '📄'}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{selectedScheme.name}</h3>
              <div style={{ display: 'inline-block', background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{selectedScheme.category || 'General'}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa8', textTransform: 'uppercase', marginBottom: 8 }}>SCHEME DESCRIPTION</div>
              <div style={{ fontSize: 14, color: '#8b9cc8', lineHeight: 1.6 }}>{selectedScheme.description}</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7fa8', textTransform: 'uppercase', marginBottom: 8 }}>KEY BENEFIT</div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ color: '#22c55e', fontWeight: 800, fontSize: 16 }}>{selectedScheme.benefit}</div>
                <div style={{ color: '#6b7fa8', fontSize: 12, marginTop: 4 }}>Direct Financial Assistance</div>
              </div>
            </div>
            <button 
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #4f8ef7, #7c6fef)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }} 
              onClick={() => { setModal('apply'); }}
            >
              Continue to Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
