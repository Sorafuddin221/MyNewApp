import React from 'react';
import PageTitle from '@/components/PageTitle';
import AllSlidesClientComponent from './AllSlidesClientComponent';
import '@/AdminStyles/AdminSettings.css';

function AllSlidesPage() {
  return (
    <>
      <PageTitle title="All Slides" />
      <AllSlidesClientComponent />
    </>
  );
}

export default AllSlidesPage;
