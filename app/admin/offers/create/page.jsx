import React from 'react';
import PageTitle from '@/components/PageTitle';
import CreateOfferClientComponent from './CreateOfferClientComponent';
import '@/AdminStyles/AdminSettings.css';

function CreateOfferPage() {
  return (
    <>
      <PageTitle title="Add New Special Offer" />
      <CreateOfferClientComponent />
    </>
  );
}

export default CreateOfferPage;
