"use client";

import { useParams, Link } from 'react-router-dom';
import { virtualTours } from '@/lib/data/virtual-tours';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRef, useEffect, useState } from 'react';
import { PanoViewer } from '@egjs/view360';
import { Play, Pause } from 'lucide-react';

export default function VirtualTourDetail() {
  const { id } = useParams<{ id: string }>();
  const tour = virtualTours.find(t => t.id === id);
  const viewerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let panoViewer: any = null;
    if (viewerRef.current && videoRef.current) {
      // Clean up any previous instance
      if ((viewerRef.current as any)._view360Instance) {
        (viewerRef.current as any)._view360Instance.destroy();
      }
      panoViewer = new PanoViewer(viewerRef.current, {
        video: videoRef.current,
        projectionType: 'equirectangular',
        autoplay: true,
        loop: true,
        muted: false,
        showPolePoint: false,
        useZoom: true,
        useKeyboard: true,
      });
      (viewerRef.current as any)._view360Instance = panoViewer;
    }
    return () => {
      if (panoViewer) {
        panoViewer.destroy();
      }
    };
  }, [viewerRef, videoRef, tour]);

  // Set video to highest available resolution (if multiple sources, pick highest)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // If there are multiple sources, pick the highest
      // For now, we assume /video360.mp4 is the highest available
      // If you have multiple sources, you can add <source> tags and pick the highest here
      video.setAttribute('playsinline', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('loop', 'true');
      // Try to set resolution if supported (for adaptive streaming, not for static mp4)
      // For static mp4, browser will use the file as is
    }
  }, []);

  // Play/pause control
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Keep isPlaying state in sync with video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Virtual Tour Not Found</h1>
        <p className="text-slate-600 mb-6">The virtual tour you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/tourism">Back to Tourism</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
        <p className="text-lg text-slate-600 mb-6">{tour.description}</p>
        {/* 360° Tour Viewer */}
        <div className="mb-8">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* Video element for 360° video */}
            <video
              ref={videoRef}
              src="/video360.mp4"
              crossOrigin="anonymous"
              style={{ display: 'none' }}
              playsInline
              muted
              loop
              autoPlay
            />
            {/* View360 container */}
            <div
              ref={viewerRef}
              className="w-full h-full"
              style={{ minHeight: '500px' }}
            />
            {/* Play/Pause Button Overlay */}
            <button
              onClick={handlePlayPause}
              className="absolute top-4 left-4 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg focus:outline-none"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              type="button"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          </div>
          {/* Tour Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500">Duration</div>
              <div className="font-semibold">{tour.duration} minutes</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500">Created</div>
              <div className="font-semibold">{tour.createdDate}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-500">Hotspots</div>
              <div className="font-semibold">{tour.hotspots?.length || 0} points of interest</div>
            </div>
          </div>
        </div>
        {/* Hotspots Information */}
        {tour.hotspots && tour.hotspots.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Points of Interest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.hotspots.map((hotspot) => (
                <div key={hotspot.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">{hotspot.title}</h4>
                      <p className="text-slate-600 text-sm">{hotspot.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {hotspot.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button asChild variant="outline">
          <Link href="/tourism">Back to Tourism</Link>
        </Button>
      </div>
    </div>
  );
} 