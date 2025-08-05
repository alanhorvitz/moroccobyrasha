import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";

interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  region: string;
  category: string;
  rating: number;
  image: string;
  featured?: boolean;
  artisan: string;
}

interface FeaturedProductsProps {
  products: ProductProps[];
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  // Only show up to 4 featured products
  const displayProducts = products.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="h-6 w-6 text-emerald-600" />
        <h2 className="text-2xl font-bold">Featured Products</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayProducts.map(product => (
          <Link to={`/marketplace/product/${product.id}`} key={product.id} className="block h-full">
            <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.region} • {product.category}
                </p>
              </CardContent>
              <CardFooter className="pt-0 px-4 pb-4">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-emerald-600">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-emerald-600">View Details</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;