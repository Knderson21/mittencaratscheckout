import {useEffect, useState} from 'react';

// useOrderForm manages the three order form fields:
//   - reference:     the cashier's name
//   - notes:         optional order notes
//   - paymentMethod: how the customer is paying (default: 'cash')
//
// All three are persisted in localStorage so they survive page refreshes.
// Each field syncs independently so one change never triggers unnecessary writes.
const useOrderForm = () => {
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Restore any previously saved values on mount.
  // The empty dependency array [] means this runs once after first render.
  useEffect(() => {
    const storedPaymentMethod = localStorage.getItem('paymentMethod');
    const storedNotes = localStorage.getItem('notes');
    const storedReference = localStorage.getItem('reference');

    if (storedPaymentMethod) setPaymentMethod(storedPaymentMethod);
    if (storedNotes) setNotes(storedNotes);
    if (storedReference) setReference(storedReference);
  }, []);

  // Each field has its own effect so only the changed field writes to
  // localStorage, rather than writing all three on every keystroke.
  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    localStorage.setItem('notes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('reference', reference);
  }, [reference]);

  // resetForm is called by useCheckout after a successful order submission.
  // It returns all fields to their defaults so the form is ready for the next sale.
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
