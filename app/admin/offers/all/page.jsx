import React from 'react';
import PageTitle from '@/components/PageTitle';
import AllOffersClientComponent from './AllOffersClientComponent';
import '@/AdminStyles/AdminSettings.css';

function AllOffersPage() {
  return (
    <>
      <PageTitle title="All Special Offers" />
      <AllOffersClientComponent />
    </>
  );
}

export default AllOffersPage;
