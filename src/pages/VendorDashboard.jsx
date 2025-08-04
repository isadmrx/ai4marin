import React from 'react';
import { useTranslation } from 'react-i18next';

export default function VendorDashboard() {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h1 className="text-2xl">{t('serviceDashboard')}</h1>
      <p>Service management coming soon.</p>
    </div>
  );
}
