import RegionDetail from '@/components/pages/RegionDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function RegionDetailPage({ params }: PageProps) {
  return <RegionDetail />;
}