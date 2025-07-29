import VirtualTourDetail from '@/components/pages/VirtualTourDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function VirtualTourDetailPage({ params }: PageProps) {
  return <VirtualTourDetail />;
}