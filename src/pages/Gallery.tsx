import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { mediaGallery } from '@/lib/data/media';
import { moroccanRegions as regions } from '@/lib/data/regions';
import { MediaItem } from '@/lib/types';

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Extract unique categories and media types for filtering
  const categories = [...new Set(mediaGallery.flatMap(item => item.category || []))];
  const mediaTypes = [...new Set(mediaGallery.map(item => item.type))];
  
  // Apply filters to media gallery
  const filteredMedia = mediaGallery.filter(media => {
    const matchesSearch = !searchTerm || 
      media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      (media.category && media.category.includes(selectedCategory));
    
    const matchesRegion = !selectedRegion || media.regionId === selectedRegion;
    
    const matchesType = !selectedMediaType || media.type === selectedMediaType;
    
    return matchesSearch && matchesCategory && matchesRegion && matchesType;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedRegion(null);
    setSelectedMediaType(null);
  };
  
  // Handle media item click
  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Morocco Gallery</h1>
        <p className="text-xl text-slate-600">
          Explore Morocco through stunning images, videos, and immersive 360° experiences.
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search media..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" onClick={resetFilters} className="shrink-0">
            Reset Filters
          </Button>
        </div>
        
        {/* Filter Tags */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium py-2">Filters:</span>
            {selectedMediaType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {selectedMediaType}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedMediaType(null)} 
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedCategory(null)} 
                />
              </Badge>
            )}
            {selectedRegion && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Region: {regions.find(r => r.id === selectedRegion)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedRegion(null)} 
                />
              </Badge>
            )}
          </div>
          
          {/* Media Type Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Media Type:</h3>
            <div className="flex flex-wrap gap-2">
              {mediaTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedMediaType === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedMediaType(type === selectedMediaType ? null : type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Categories Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Regions Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Regions:</h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Badge
                  key={region.id}
                  variant={selectedRegion === region.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedRegion(region.id === selectedRegion ? null : region.id)}
                >
                  {region.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Media Gallery */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((media) => (
            <div 
              key={media.id} 
              className="aspect-square relative overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleMediaClick(media)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Media placeholder - would be actual images in implementation */}
              <div className="h-full w-full bg-slate-200">
                {/* Image would be displayed here */}
              </div>
              
              {/* Media type indicator */}
              <div className="absolute top-2 right-2">
                {media.type === "video" && (
                  <Badge className="bg-red-500">Video</Badge>
                )}
                {media.type === "360" && (
                  <Badge className="bg-purple-500">360°</Badge>
                )}
              </div>
              
              {/* Media info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-medium line-clamp-1">{media.title}</h3>
                {media.regionId && (
                  <p className="text-xs opacity-80">
                    {regions.find(r => r.id === media.regionId)?.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-500">No media found matching your criteria.</p>
          <Button onClick={resetFilters} className="mt-4">
            Reset Filters
          </Button>
        </div>
      )}
      
      {/* Media Viewer Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-5xl w-full">
          {selectedMedia && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMedia.title}</DialogTitle>
                <DialogDescription>
                  {selectedMedia.regionId && (
                    <span className="text-slate-500">
                      {regions.find(r => r.id === selectedMedia.regionId)?.name} - 
                    </span>
                  )}
                  {" "}
                  <span className="text-slate-500">
                    {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                {/* Media content */}
                <div className="aspect-video bg-slate-800 rounded-md overflow-hidden mb-4">
                  {selectedMedia.type === "image" && (
                    <div className="h-full w-full bg-slate-300 flex items-center justify-center text-slate-500">
                      Image Placeholder: {selectedMedia.url}
                    </div>
                  )}
                  {selectedMedia.type === "video" && (
                    <div className="h-full w-full bg-slate-700 flex items-center justify-center text-white">
                      Video Placeholder: {selectedMedia.url}
                    </div>
                  )}
                  {selectedMedia.type === "360" && (
                    <div className="h-full w-full bg-slate-600 flex items-center justify-center text-white">
                      360° Experience Placeholder: {selectedMedia.url}
                    </div>
                  )}
                </div>
                
                <p className="text-slate-600">{selectedMedia.description}</p>
                
                {/* Media categories */}
                {selectedMedia.category && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedMedia.category.map((cat) => (
                      <Badge key={cat} variant="outline">{cat}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}