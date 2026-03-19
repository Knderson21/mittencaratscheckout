import {useEffect, useState} from 'react';

const useOrderForm = () => {
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Load persisted form values on mount
  useEffect(() => {
    const storedPaymentMethod = localStorage.getItem('paymentMethod');
    const storedNotes = localStorage.getItem('notes');
    const storedReference = localStorage.getItem('reference');

    if (storedPaymentMethod) setPaymentMethod(storedPaymentMethod);
    if (storedNotes) setNotes(storedNotes);
    if (storedReference) setReference(storedReference);
  }, []);

  // Sync each field to localStorage on change
  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    localStorage.setItem('notes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('reference', reference);
  }, [reference]);

  const resetForm = () => {
    setPaymentMethod('cash');
    setReference('');
    setNotes('');
  };

  return {
    reference, notes, paymentMethod,
    setReference, setNotes, setPaymentMethod, resetForm,
  };
};

export default useOrderForm;
