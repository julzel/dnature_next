import React from 'react';
import Page from '../../components/Page';
import PlanDNA from '../../features/PlanDNA';

export const metadata = {
  title: 'Plan Nutricional DNAture',
  description: 'Plan Nutricional DNAture',
};

export default function PlanDNAturePage() {
  return (
    <Page>
      <PlanDNA headTitle={'Plan Nutricional DNAture'} />
    </Page>
  );
}
