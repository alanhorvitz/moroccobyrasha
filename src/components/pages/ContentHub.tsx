"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, Tag, ArrowRight, Clock, CalendarDays, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { contentItems } from '@/lib/data/content';
import { ContentItem } from '@/lib/types';

export default function ContentHubPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Extract unique categories
  const allCategories = [...new Set(contentItems.flatMap(item => item.category || []))];
  
  // Filter content based on search, category, and content type
  const filteredContent = contentItems.filter(content => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (content.type === 'article' && content.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (content.author && content.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category
    const matchesCategory = !selectedCategory || 
      (content.category && content.category.includes(selectedCategory));
    
    // Filter by content type
    const matchesType = activeTab === "all" || content.type === activeTab;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  // Group content by type for rendering
  const articles = filteredContent.filter(item => item.type === 'article');
  const videos = filteredContent.filter(item => item.type === 'video');
  const podcasts = filteredContent.filter(item => item.type === 'podcast');
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Morocco Content Hub</h1>
        <p className="text-xl text-slate-600">
          Discover insights, guides, and stories about Moroccan culture, destinations, and experiences.
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search articles, videos, and podcasts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" onClick={resetFilters} className="shrink-0">
            Reset Filters
          </Button>
        </div>
        
        {/* Categories */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Tag className="h-4 w-4 mr-1" /> Categories:
          </h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
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
      </div>
      
      {/* Content Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 w-full md:w-[500px] mb-8">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="podcast">Podcasts</TabsTrigger>
        </TabsList>
        
        {/* All Content */}
        <TabsContent value="all">
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {/* Featured Content */}
              {filteredContent.filter(c => c.featured).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Featured Content</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredContent
                      .filter(c => c.featured)
                      .slice(0, 2)
                      .map(content => (
                        <FeaturedContentCard key={content.id} content={content} />
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Latest Content */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Latest Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .slice(0, 6)
                    .map(content => (
                      <ContentCard key={content.id} content={content} />
                    ))
                  }
                </div>
              </div>
            </div>
          ) : (
            <EmptyContentMessage resetFilters={resetFilters} />
          )}
        </TabsContent>
        
        {/* Articles Tab */}
        <TabsContent value="article">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ContentCard key={article.id} content={article} />
              ))}
            </div>
          ) : (
            <EmptyContentMessage resetFilters={resetFilters} />
          )}
        </TabsContent>
        
        {/* Videos Tab */}
        <TabsContent value="video">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <EmptyContentMessage resetFilters={resetFilters} />
          )}
        </TabsContent>
        
        {/* Podcasts Tab */}
        <TabsContent value="podcast">
          {podcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {podcasts.map(podcast => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          ) : (
            <EmptyContentMessage resetFilters={resetFilters} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Featured Content Card
const FeaturedContentCard = ({ content }: { content: ContentItem }) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-2/5 h-48 md:h-auto bg-slate-200">
          {/* Content image would go here in implementation */}
        </div>
        <div className="w-full md:w-3/5 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{content.type}</Badge>
              {content.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>
            <CardTitle className="line-clamp-2">
              {content.title}
            </CardTitle>
            <CardDescription className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {content.author || "Morocco Tourism"}
              <span className="mx-2">•</span>
              <CalendarDays className="h-3 w-3 mr-1" />
              {new Date(content.publishedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {content.type === "article" && (
              <p className="text-slate-600 line-clamp-3">{content.content.substring(0, 180)}...</p>
            )}
            {content.type === "video" && (
              <p className="text-slate-600">Video content about Moroccan experiences</p>
            )}
            {content.type === "podcast" && (
              <p className="text-slate-600">Audio podcast featuring travel insights</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {content.category?.slice(0, 3).map((cat, index) => (
                <Badge key={index} variant="outline">{cat}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/content/${content.id}`}>
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Standard Content Card
const ContentCard = ({ content }: { content: ContentItem }) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48 bg-slate-200">
        {/* Content image would go here in implementation */}
        <div className="absolute top-4 left-4">
          <Badge>{content.type}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{content.title}</CardTitle>
        <CardDescription className="flex items-center">
          <User className="h-3 w-3 mr-1" />
          {content.author || "Morocco Tourism"}
          <span className="mx-2">•</span>
          <CalendarDays className="h-3 w-3 mr-1" />
          {new Date(content.publishedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content.type === "article" && (
          <p className="text-slate-600 line-clamp-3">{content.content.substring(0, 120)}...</p>
        )}
        {content.category && (
          <div className="flex flex-wrap gap-2 mt-3">
            {content.category.slice(0, 2).map((cat, index) => (
              <Badge key={index} variant="outline">{cat}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/content/${content.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Video Card
const VideoCard = ({ video }: { video: ContentItem }) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-52 bg-slate-800 flex items-center justify-center">
        {/* Video thumbnail would go here in implementation */}
        <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center">
          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{video.title}</CardTitle>
        <CardDescription className="flex items-center">
          <User className="h-3 w-3 mr-1" />
          {video.author}
          <span className="mx-2">•</span>
          <CalendarDays className="h-3 w-3 mr-1" />
          {new Date(video.publishedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {video.category && (
          <div className="flex flex-wrap gap-2">
            {video.category.map((cat, index) => (
              <Badge key={index} variant="outline">{cat}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/content/${video.id}`}>
            Watch Video
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Podcast Card
const PodcastCard = ({ podcast }: { podcast: ContentItem }) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-1/3 h-32 sm:h-auto bg-slate-200">
          {/* Podcast image would go here in implementation */}
        </div>
        <div className="w-full sm:w-2/3 flex flex-col">
          <CardHeader>
            <Badge className="w-fit mb-2">Podcast</Badge>
            <CardTitle className="line-clamp-2">{podcast.title}</CardTitle>
            <CardDescription className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {podcast.author}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {podcast.category && (
              <div className="flex flex-wrap gap-2">
                {podcast.category.map((cat, index) => (
                  <Badge key={index} variant="outline">{cat}</Badge>
                ))}
              </div>
            )}
            <div className="flex items-center mt-4 text-sm text-slate-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>30 min</span>
              <span className="mx-2">•</span>
              <CalendarDays className="h-4 w-4 mr-1" />
              {new Date(podcast.publishedAt).toLocaleDateString()}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/content/${podcast.id}`}>
                Listen Now
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Empty Content Message
const EmptyContentMessage = ({ resetFilters }: { resetFilters: () => void }) => {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-slate-500">No content found matching your criteria.</p>
      <Button onClick={resetFilters} className="mt-4">
        Reset Filters
      </Button>
    </div>
  );
};