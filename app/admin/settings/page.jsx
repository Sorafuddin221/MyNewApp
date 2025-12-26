import React from 'react';
import PageTitle from '@/components/PageTitle';
import GeneralSettingsClientComponent from './GeneralSettingsClientComponent';
import '@/AdminStyles/AdminSettings.css';

function GeneralSettingsPage() {
  return (
    <>
      <PageTitle title="General Settings" />
      <GeneralSettingsClientComponent />
    </>
  );
}

export default GeneralSettingsPage;
