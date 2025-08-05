import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  MapPin, 
  Info, 
  Truck, 
  ChevronLeft,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define product type interface
interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  region: string;
  category: string;
  rating: number;
  image: string;
  additionalImages?: string[];
  featured: boolean;
  artisan: string;
  artisanStory?: string;
  dimensions?: string;
  weight?: string;
  materials?: string;
  colors?: string[];
  shipping?: string;
  reviews?: Review[];
  relatedProducts?: number[];
}

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

// Sample products data - would come from an API in a real application
const products: Product[] = [
  {
    id: 1,
    name: 'Handcrafted Moroccan Leather Pouf',
    description: 'Authentic handmade leather pouf, perfect for your living room.',
    longDescription: `
      <p>This authentic handcrafted Moroccan leather pouf is the perfect addition to any home. Each piece is meticulously made by skilled artisans in Fez, following centuries-old traditions passed down through generations.</p>
      
      <p>The pouf features intricate embroidery and is made from 100% genuine leather that's been naturally tanned using traditional methods. The vibrant colors are achieved through natural vegetable dyes that maintain their richness over time.</p>
      
      <p>These versatile pieces can serve as footstools, casual seating, or decorative accents. They're stuffed with sustainable materials that provide both comfort and durability.</p>
      
      <p>By purchasing this product, you're directly supporting the artisan communities of Fez and helping to preserve traditional Moroccan craftsmanship.</p>
    `,
    price: 89.99,
    region: 'Fez',
    category: 'Home Decor',
    rating: 4.8,
    image: '/images/SoussMassaRegion.jpg',
    additionalImages: [
      '/images/Fes.jpg',
      '/images/MerenidArchitecture.jpg',
      '/images/Marrakech.jpg'
    ],
    featured: true,
    artisan: 'Amine Crafts',
    artisanStory: 'Amine Crafts is a family-owned business that has been creating traditional Moroccan leather goods for over four generations. Based in the ancient tannery district of Fez, their workshop employs 12 local artisans who specialize in various aspects of leatherwork.',
    dimensions: '20" diameter x 13" height',
    weight: '6 lbs',
    materials: 'Genuine leather, cotton stuffing',
    colors: ['Tan', 'Brown', 'Camel', 'Black', 'Red'],
    shipping: '2-3 weeks international delivery',
    reviews: [
      { id: 1, user: 'Sarah M.', rating: 5, date: '2025-02-15', comment: 'Beautiful craftsmanship! Looks even better in person than in the photos.' },
      { id: 2, user: 'Michael T.', rating: 4, date: '2025-01-20', comment: 'Great quality, though shipping took a bit longer than expected.' },
      { id: 3, user: 'Emily W.', rating: 5, date: '2024-12-08', comment: 'This pouf completes my living room. The colors are stunning and the leather smell is divine.' }
    ],
    relatedProducts: [2, 5, 8]
  },
  {
    id: 2,
    name: 'Traditional Berber Carpet',
    description: 'Handwoven Berber carpet with traditional patterns.',
    longDescription: 'Handwoven by skilled artisans in the Atlas Mountains, this traditional Berber carpet features authentic geometric patterns that tell stories of Amazigh culture and heritage.',
    price: 249.99,
    region: 'Atlas Mountains',
    category: 'Home Decor',
    rating: 4.9,
    image: '/images/DraaTafilalet.jpg',
    featured: true,
    artisan: 'Atlas Weavers Cooperative',
    dimensions: '6\'x9\'',
    materials: '100% wool',
    shipping: '2-3 weeks international delivery'
  },
  {
    id: 5,
    name: 'Handmade Silver Berber Jewelry',
    description: 'Traditional silver jewelry with Amazigh symbols.',
    price: 119.99,
    region: 'Tiznit',
    category: 'Jewelry',
    rating: 4.8,
    image: '/images/HassanTower.jpg',
    featured: false,
    artisan: 'Silver Artisans of Tiznit'
  },
  {
    id: 8,
    name: 'Moroccan Lantern',
    description: 'Intricately designed metal lantern casting beautiful light patterns.',
    price: 45.99,
    region: 'Marrakech',
    category: 'Home Decor',
    rating: 4.6,
    image: '/images/restaurant.jpg',
    featured: true,
    artisan: 'Marrakech Light Crafters'
  }
];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [relatedProductsData, setRelatedProductsData] = useState<Product[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      setLoading(true);
      const foundProduct = products.find(p => p.id === parseInt(id || '0'));
      
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.image);
        setSelectedColor(foundProduct.colors?.[0] || '');
        
        // Get related products
        if (foundProduct.relatedProducts) {
          const related = products.filter(p => 
            foundProduct.relatedProducts?.includes(p.id)
          );
          setRelatedProductsData(related);
        }
      }
      
      setLoading(false);
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };
  
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
  
  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="loading-spinner h-12 w-12 border-4 border-t-emerald-600 border-gray-200 rounded-full"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link to="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{product.name} - Marketplace - Morocco Tourism Platform</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="hover:bg-transparent hover:text-emerald-600 -ml-3">
            <Link to="/marketplace" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border bg-white">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-contain p-4" 
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.additionalImages && (
              <div className="grid grid-cols-4 gap-2">
                <div 
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === product.image ? 'border-emerald-600' : 'border-transparent'}`}
                  onClick={() => handleImageClick(product.image)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                
                {product.additionalImages.map((img: string, index: number) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-emerald-600' : 'border-transparent'}`}
                    onClick={() => handleImageClick(img)}
                  >
                    <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Information */}
          <div>
            {product.featured && (
              <Badge className="mb-4 bg-emerald-600">Featured</Badge>
            )}
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-2">
              {renderStars(product.rating)}
              <span className="text-muted-foreground ml-1">({product.rating}) · {product.reviews?.length || 0} reviews</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{product.region}</span>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">By: {product.artisan}</p>
            </div>
            
            <div className="text-2xl font-bold text-emerald-600 mb-6">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-muted-foreground mb-8">
              {product.description}
            </p>
            
            {/* Color Selection */}
            {product.colors && (
              <div className="mb-8">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      className={selectedColor === color ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div className="mb-8">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to Cart / Wishlist */}
            <div className="flex gap-4 mb-8">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Shipping / Dimensions Info */}
            <div className="space-y-2 mb-8">
              {product.shipping && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>{product.shipping}</span>
                </div>
              )}
              
              {product.dimensions && (
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>Dimensions: {product.dimensions}</span>
                </div>
              )}
              
              {product.materials && (
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span>Materials: {product.materials}</span>
                </div>
              )}
            </div>
            
            {/* Free shipping notice */}
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-md text-sm flex items-center gap-2 mb-4">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Free shipping on orders over $150</span>
            </div>
          </div>
        </div>
        
        {/* Tabs for Product Information */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="description" className="rounded-none">Description</TabsTrigger>
              <TabsTrigger value="artisan" className="rounded-none">Artisan Story</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none">Reviews</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <div dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }} />
            </TabsContent>
            <TabsContent value="artisan" className="py-6">
              {product.artisanStory ? (
                <>
                  <h3 className="text-lg font-medium mb-4">About {product.artisan}</h3>
                  <p>{product.artisanStory}</p>
                </>
              ) : (
                <p>Information about this artisan will be available soon.</p>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review: Review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.user}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No reviews yet. Be the first to leave a review for this product!</p>
              )}
            </TabsContent>
            <TabsContent value="shipping" className="py-6">
              <h3 className="text-lg font-medium mb-4">Shipping & Returns</h3>
              <p className="mb-4">
                All items are shipped directly from Morocco by our artisan partners. Please allow 2-3 weeks for international delivery. 
                Customs fees may apply depending on your country's import regulations.
              </p>
              <h4 className="font-medium mt-4 mb-2">Return Policy</h4>
              <p>
                We accept returns within 14 days of delivery if the item is unused and in its original packaging. 
                Please note that return shipping costs are the responsibility of the customer.
              </p>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProductsData.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsData.map(relatedProduct => (
                <Link key={relatedProduct.id} to={`/marketplace/product/${relatedProduct.id}`}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105" 
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{relatedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {relatedProduct.region} • {relatedProduct.category}
                      </p>
                      <span className="font-medium text-emerald-600">${relatedProduct.price.toFixed(2)}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;