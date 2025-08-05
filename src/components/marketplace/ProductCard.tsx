import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, MapPin } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface ProductCardProps {
  product: ProductProps;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="star-half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`star-empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden product-card h-full">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <Link to={`/marketplace/product/${product.id}`} className="block h-48 md:h-full">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              {product.featured && (
                <Badge className="absolute top-2 left-2 bg-emerald-600">
                  Featured
                </Badge>
              )}
            </Link>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <CardHeader className="pt-4 pb-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(product.rating)}
                <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-0">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{product.region}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {product.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              <p className="text-xs text-muted-foreground">By: {product.artisan}</p>
            </CardContent>
            <CardFooter className="pt-3 pb-4 mt-auto">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-emerald-600">${product.price.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/marketplace/product/${product.id}`}>
                      Details
                    </Link>
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden product-card h-full">
      <div className="relative">
        <Link to={`/marketplace/product/${product.id}`} className="block aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-emerald-600">
              Featured
            </Badge>
          )}
        </Link>
      </div>
      <CardHeader className="pt-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-2">{product.name}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(product.rating)}
          <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{product.region}</span>
        </div>
        <Badge variant="outline" className="mb-2">
          {product.category}
        </Badge>
        <p className="text-xs text-muted-foreground">By: {product.artisan}</p>
      </CardContent>
      <CardFooter className="pt-3 pb-4 mt-auto">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-emerald-600">${product.price.toFixed(2)}</span>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;