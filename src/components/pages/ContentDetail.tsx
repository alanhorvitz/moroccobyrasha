'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Eye, Share, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { contentItems } from '@/lib/data/content';
import { ContentItem } from '@/lib/types';

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (id) {
      const foundContent = contentItems.find(c => c.id === id);
      setContent(foundContent || null);
      
      if (foundContent) {
        // Get related content based on category
        const related = contentItems
          .filter(c => c.id !== id && c.category?.some(cat => foundContent.category?.includes(cat)))
          .slice(0, 3);
        setRelatedContent(related);
      }
    }
  }, [id]);

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-slate-600 mb-6">The content you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/content-hub">Back to Content Hub</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Eye className="h-5 w-5" />;
      case 'podcast':
        return <Clock className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 bg-slate-50 border-b">
        <div className="container mx-auto px-4">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/content-hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Content Hub
            </Link>
          </Button>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1">
                {getContentIcon(content.type)}
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </Badge>
              {content.featured && (
                <Badge variant="outline">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{content.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(content.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {content.readTime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{content.readTime} min read</span>
                </div>
              )}
            </div>
            
            {content.category && content.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {content.category.map((cat: string, index: number) => (
                  <Badge key={index} variant="secondary">{cat}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  {content.type === 'article' && (
                    <div className="prose prose-slate max-w-none">
                      {content.content ? (
                        <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                          {content.content}
                        </div>
                      ) : (
                        <p className="text-slate-600">Article content will be displayed here.</p>
                      )}
                    </div>
                  )}
                  
                  {content.type === 'video' && (
                    <div className="space-y-6">
                      <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Eye className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                          <p className="text-slate-500">Video player would be embedded here</p>
                        </div>
                      </div>
                      {content.content && (
                        <div className="prose prose-slate max-w-none">
                          <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                            {content.content}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {content.type === 'podcast' && (
                    <div className="space-y-6">
                      <div className="bg-slate-100 p-8 rounded-lg text-center">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-slate-500 mb-4">Audio player would be embedded here</p>
                        {content.duration && (
                          <p className="text-sm text-slate-600">Duration: {content.duration}</p>
                        )}
                      </div>
                      {content.content && (
                        <div className="prose prose-slate max-w-none">
                          <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                            {content.content}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Share className="h-5 w-5 mr-2" />
                    Share This Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Copy Link
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share on Social
                  </Button>
                </CardContent>
              </Card>
              
              {/* Related Content */}
              {relatedContent.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Content</CardTitle>
                    <CardDescription>You might also like</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedContent.map((item) => (
                      <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <Link href={`/content/${item.id}`} className="block hover:text-emerald-600 transition-colors">
                          <h4 className="font-medium line-clamp-2 mb-2">{item.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Badge variant="outline" className="text-xs">
                              {getContentIcon(item.type)}
                              <span className="ml-1">{item.type}</span>
                            </Badge>
                            <span>{item.author}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/content-hub">View All Content</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Explore Morocco</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/discover">Discover Regions</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/tourism">Find Tours</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/gallery">View Gallery</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}