// src/components/SchemeFinder.jsx
import React, { useState } from 'react';
import EligibilityForm from './EligibilityForm';
import SchemeResultList from './schemeResultList';
import ApplyForm from './Applyform';
import { addAppliedScheme } from '../stores/applicationstore';

export default function SchemeFinder({ onApplicationSuccess, onDigiLocker }) {
  const [step, setStep] = useState('form'); // form | results | apply
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    addAppliedScheme({ 
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: selected.name, 
      amount: selected.benefit, 
      category: selected.category,
      status: 'Applied' 
    });
    onApplicationSuccess();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {step === 'form' && <EligibilityForm onFind={() => setStep('results')} onDigiLocker={onDigiLocker} />}
      {step === 'results' && <SchemeResultList onApply={(s) => { setSelected(s); setStep('apply'); }} />}
      {step === 'apply' && <ApplyForm scheme={selected} onSubmit={handleSubmit} onBack={() => setStep('results')} />}
    </div>
  );
}