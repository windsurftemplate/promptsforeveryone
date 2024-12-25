import { Metadata } from 'next';
import PromptClient from './PromptClient';

export const metadata: Metadata = {
  title: 'Prompt Details',
  description: 'View and edit prompt details',
};

interface PageParams {
  id: string;
}

export default function PromptPage({
  params,
}: {
  params: PageParams;
}) {
  return <PromptClient id={params.id} />;
}
