import { Metadata } from 'next';
import PromptClient from './PromptClient';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Prompt ${resolvedParams.id}`,
    description: 'View prompt details',
  };
}

export default async function Page({
  params,
}: {
  params: Params;
}) {
  const resolvedParams = await params;
  return <PromptClient id={resolvedParams.id} />;
}
