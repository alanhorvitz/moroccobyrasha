import ProductDetailPage from '@/components/pages/ProductDetailPage';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: PageProps) {
  return <ProductDetailPage />;
}