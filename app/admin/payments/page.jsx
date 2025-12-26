import React from 'react';
import PageTitle from '@/components/PageTitle';
import PaymentsClientComponent from './PaymentsClientComponent';
import '@/AdminStyles/AdminSettings.css';

function PaymentsPage() {
  return (
    <>
      <PageTitle title="Payment Settings" />
      <PaymentsClientComponent />
    </>
  );
}

export default PaymentsPage;
