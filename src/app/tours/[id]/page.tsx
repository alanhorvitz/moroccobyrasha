import TourPackageDetail from '@/components/pages/TourPackageDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TourDetailPage({ params }: PageProps) {
  return <TourPackageDetail />;
}