import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CrewDashboard() {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h1 className="text-2xl">{t('myProfile')}</h1>
      <p>Profile details will appear here.</p>
    </div>
  );
}
