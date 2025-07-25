import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Search, 
  ShoppingBag, 
  Filter, 
  LayoutGrid, 
  List,
  Heart,
  MapPin
} from 'lucide-react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import ProductCard from '@/components/marketplace/ProductCard';
import CategoryFilter from '@/components/marketplace/CategoryFilter';
import FeaturedProducts from '@/components/marketplace/FeaturedProducts';
import MarketplaceBanner from '@/components/marketplace/MarketplaceBanner';

// Sample products data - this would come from an API in a real application
const initialProducts = [
  {
    id: 1,
    name: 'Handcrafted Moroccan Leather Pouf',
    description: 'Authentic handmade leather pouf, perfect for your living room.',
    price: 89.99,
    region: 'Fez',
    category: 'Home Decor',
    rating: 4.8,
    image: '/images/SoussMassaRegion.jpg',
    featured: true,
    artisan: 'Amine Crafts',
  },
  {
    id: 2,
    name: 'Traditional Berber Carpet',
    description: 'Handwoven Berber carpet with traditional patterns.',
    price: 249.99,
    region: 'Atlas Mountains',
    category: 'Home Decor',
    rating: 4.9,
    image: '/images/DraaTafilalet.jpg',
    featured: true,
    artisan: 'Atlas Weavers Cooperative',
  },
  {
    id: 3,
    name: 'Moroccan Ceramic Tagine Pot',
    description: 'Handcrafted ceramic tagine for authentic Moroccan cooking.',
    price: 59.99,
    region: 'Safi',
    category: 'Kitchen',
    rating: 4.7,
    image: '/images/Marrakech.jpg',
    featured: false,
    artisan: 'Safi Pottery Guild',
  },
  {
    id: 4,
    name: 'Argan Oil Set',
    description: 'Organic argan oil set for hair and skin care.',
    price: 34.99,
    region: 'Essaouira',
    category: 'Beauty & Wellness',
    rating: 4.6,
    image: '/images/beach.jpg',
    featured: true,
    artisan: "Women's Argan Cooperative",
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
    artisan: 'Silver Artisans of Tiznit',
  },
  {
    id: 6,
    name: 'Moroccan Mint Tea Set',
    description: 'Complete traditional tea set with ornate teapot and glasses.',
    price: 79.99,
    region: 'Marrakech',
    category: 'Kitchen',
    rating: 4.5,
    image: '/images/Rabat.jpg',
    featured: false,
    artisan: 'Marrakech Metal Craftsmen',
  },
  {
    id: 7,
    name: 'Hand-painted Ceramic Plates Set',
    description: 'Colorful hand-painted plates with traditional Moroccan designs.',
    price: 65.99,
    region: 'Fez',
    category: 'Kitchen',
    rating: 4.7,
    image: '/images/Casablanca.jpg',
    featured: false,
    artisan: 'Fez Ceramic Artists',
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
    artisan: 'Marrakech Light Crafters',
  },
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'home-decor', name: 'Home Decor' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'beauty-wellness', name: 'Beauty & Wellness' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'clothing', name: 'Traditional Clothing' },
  { id: 'art', name: 'Art & Crafts' },
];

const regions = [
  { id: 'all', name: 'All Regions' },
  { id: 'marrakech', name: 'Marrakech' },
  { id: 'fez', name: 'Fez' },
  { id: 'atlas', name: 'Atlas Mountains' },
  { id: 'essaouira', name: 'Essaouira' },
  { id: 'chefchaouen', name: 'Chefchaouen' },
  { id: 'safi', name: 'Safi' },
  { id: 'tiznit', name: 'Tiznit' },
];

const MarketplacePage = () => {
  const [products] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  // Filter products based on search, category, region, and price
  useEffect(() => {
    let result = products;

    // Search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artisan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.replace('-', ' & ')
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      result = result.filter(product => 
        product.region.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }

    // Price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedRegion, priceRange, sortBy]);

  // Handle price range changes
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <>
      <Helmet>
        <title>Marketplace - Morocco Tourism Platform</title>
        <meta name="description" content="Discover authentic Moroccan crafts, products, and artisanal goods in our marketplace." />
      </Helmet>

      <MarketplaceBanner />

      <div className="container py-8 md:py-12">
        {/* Featured Products Section */}
        <section className="mb-8 md:mb-12">
          <FeaturedProducts products={products.filter(p => p.featured)} />
        </section>

        {/* Search and Filter Bar */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products, artisans, or descriptions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md overflow-hidden">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Filter Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-medium text-lg">Filters</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Categories</h4>
                  <CategoryFilter 
                    categories={categories} 
                    selectedCategory={selectedCategory}
                    onChange={setSelectedCategory} 
                  />
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={[0, 300]}
                    min={0}
                    max={300}
                    step={5}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="my-4"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      type="number" 
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-20"
                    />
                    <span>to</span>
                    <Input 
                      type="number" 
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="font-medium mb-4">Artisan Spotlight</h4>
                  <div className="space-y-4">
                    <div className="aspect-video rounded-md overflow-hidden">
                      <img src="/images/beach.jpg" alt="Featured Artisan" className="w-full h-full object-cover" />
                    </div>
                    <h5 className="font-medium">Women's Argan Cooperative</h5>
                    <p className="text-sm text-muted-foreground">Supporting women's economic independence through traditional argan oil production in Essaouira.</p>
                    <Button variant="outline" size="sm" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Showing {filteredProducts.length} products</h3>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} viewMode="list" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Artisan Cooperatives Section */}
        <section className="mt-16 py-12 bg-slate-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 rounded-lg">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Supporting Moroccan Artisans & Cooperatives</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every purchase from our marketplace directly supports local Moroccan artisans and cooperative 
                initiatives, preserving traditional craftsmanship and contributing to sustainable community development.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" size="lg">
                Learn About Our Artisans
              </Button>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Become a Vendor
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MarketplacePage;