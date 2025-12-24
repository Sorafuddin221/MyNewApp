import React from 'react';
import PageTitle from '@/components/PageTitle';
import CreateSlideClientComponent from './CreateSlideClientComponent';
import '@/AdminStyles/AdminSettings.css';

function CreateSlidePage() {
  return (
    <>
      <PageTitle title="Add New Slide" />
      <CreateSlideClientComponent />
    </>
  );
}

export default CreateSlidePage;
