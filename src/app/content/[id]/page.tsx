import ContentDetail from '@/components/pages/ContentDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ContentDetailPage({ params }: PageProps) {
  return <ContentDetail />;
}