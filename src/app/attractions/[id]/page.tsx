import AttractionDetail from '@/components/pages/AttractionDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function AttractionDetailPage({ params }: PageProps) {
  return <AttractionDetail />;
}