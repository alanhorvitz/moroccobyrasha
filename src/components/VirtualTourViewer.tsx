import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Maximize, Volume2, VolumeX, Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { VirtualTour, VirtualTourHotspot } from '@/lib/types';

interface VirtualTourViewerProps {
  tour: VirtualTour;
  onClose?: () => void;
}

export default function VirtualTourViewer({ tour, onClose }: VirtualTourViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<VirtualTourHotspot | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Simulate 360° rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setRotation(0);
    setIsPlaying(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleHotspotClick = (hotspot: VirtualTourHotspot) => {
    setSelectedHotspot(hotspot);
  };

  const handleCloseHotspot = () => {
    setSelectedHotspot(null);
  };

  // Enhanced 3D coordinates to 2D screen position conversion
  const getHotspotPosition = (hotspot: VirtualTourHotspot) => {
    // More realistic coordinate mapping with rotation
    const baseX = 50 + (hotspot.coordinates.x / 100) * 40;
    const baseY = 50 + (hotspot.coordinates.y / 100) * 30;
    const baseZ = hotspot.coordinates.z || 0;
    
    // Apply rotation transformation
    const rotationOffset = (rotation / 360) * 80;
    const adjustedX = (baseX + rotationOffset + (baseZ * 10)) % 100;
    const adjustedY = Math.max(15, Math.min(85, baseY + Math.sin(rotation * Math.PI / 180) * 5));
    
    // Add depth effect based on Z coordinate
    const scale = Math.max(0.8, 1 - Math.abs(baseZ) * 0.3);
    
    return {
      left: `${adjustedX}%`,
      top: `${adjustedY}%`,
      transform: `scale(${scale})`,
      opacity: Math.max(0.6, 1 - Math.abs(baseZ) * 0.4)
    };
  };

  return (
    <div 
      ref={viewerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'} bg-black rounded-lg overflow-hidden`}
    >
      {/* Enhanced 360° Viewer Background */}
      <div 
        className="absolute inset-0 transition-transform duration-100 overflow-hidden"
        style={{ 
          transform: `rotateY(${rotation}deg) rotateX(${Math.sin(rotation * Math.PI / 180) * 2}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Primary panoramic background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-100 via-emerald-200 to-blue-300"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Moroccan architectural elements simulation */}
        <div className="absolute inset-0 opacity-40">
          {/* Simulated building silhouettes that move with rotation */}
          <div 
            className="absolute bottom-0 left-0 w-32 h-40 bg-gradient-to-t from-amber-800 to-amber-600"
            style={{ 
              clipPath: 'polygon(0 100%, 20% 80%, 40% 85%, 60% 75%, 80% 80%, 100% 70%, 100% 100%)',
              transform: `translateX(${(rotation * 2) % 100}px)`
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-40 h-48 bg-gradient-to-t from-red-800 to-red-600"
            style={{ 
              clipPath: 'polygon(0 70%, 15% 85%, 30% 75%, 50% 80%, 70% 70%, 85% 85%, 100% 75%, 100% 100%, 0 100%)',
              transform: `translateX(${-(rotation * 1.5) % 100}px)`
            }}
          />
          
          {/* Simulated desert/mountain elements in background */}
          <div 
            className="absolute top-1/3 left-0 w-full h-20 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 opacity-60"
            style={{ 
              clipPath: 'polygon(0 100%, 10% 80%, 25% 90%, 40% 70%, 55% 85%, 70% 75%, 85% 90%, 100% 80%, 100% 100%)',
              transform: `translateX(${(rotation * 0.5) % 50}px)`
            }}
          />
        </div>
        
        {/* Dynamic lighting effects */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-50"
            style={{
              top: '20%',
              left: `${30 + Math.sin(rotation * Math.PI / 180) * 20}%`,
              transform: `scale(${1 + Math.cos(rotation * Math.PI / 180) * 0.2})`
            }}
          />
          <div 
            className="absolute w-24 h-24 bg-orange-400 rounded-full blur-xl opacity-40"
            style={{
              top: '60%',
              right: `${20 + Math.cos(rotation * Math.PI / 180) * 15}%`,
              transform: `scale(${0.8 + Math.sin(rotation * Math.PI / 180) * 0.3})`
            }}
          />
        </div>
        
        {/* Atmospheric particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${(i * 8 + rotation * 0.3) % 100}%`,
                top: `${20 + (i * 5) % 60}%`,
                animationDelay: `${i * 0.5}s`,
                animation: 'float 3s ease-in-out infinite alternate'
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Interactive Hotspots */}
      {showHotspots && tour.hotspots.map((hotspot, index) => {
        const position = getHotspotPosition(hotspot);
        return (
          <div
            key={hotspot.id}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={position}
          >
            <div className="relative group">
              {/* Hotspot ripple effect */}
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-white/30 animate-ping"></div>
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-white/20 animate-pulse animation-delay-500"></div>
              
              {/* Main hotspot button */}
              <Button
                size="sm"
                className={`w-8 h-8 rounded-full shadow-xl border-2 border-white/50 transition-all duration-300 hover:scale-110 ${
                  hotspot.type === 'info' ? 'bg-blue-500 hover:bg-blue-600' :
                  hotspot.type === 'video' ? 'bg-red-500 hover:bg-red-600' :
                  hotspot.type === 'audio' ? 'bg-green-500 hover:bg-green-600' :
                  'bg-purple-500 hover:bg-purple-600'
                }`}
                onClick={() => handleHotspotClick(hotspot)}
              >
                {hotspot.type === 'video' && <Play className="h-3 w-3 text-white" />}
                {hotspot.type === 'audio' && <Volume2 className="h-3 w-3 text-white" />}
                {(hotspot.type === 'info' || !hotspot.type) && <Info className="h-3 w-3 text-white" />}
                {hotspot.type === 'link' && <Navigation className="h-3 w-3 text-white" />}
              </Button>
              
              {/* Hotspot preview tooltip */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap max-w-32 text-center">
                  {hotspot.title}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Tour Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handlePlayPause}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowHotspots(!showHotspots)}
              >
                {showHotspots ? 'Hide' : 'Show'} Hotspots
              </Button>
              
              <Button size="sm" variant="outline" onClick={handleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
              
              {onClose && (
                <Button size="sm" variant="outline" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Rotation Control */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm min-w-0">Rotation:</span>
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              max={360}
              step={1}
              className="flex-1"
            />
            <span className="text-white text-sm min-w-0">{rotation}°</span>
          </div>
        </div>
      </div>

      {/* Tour Info */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{tour.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 line-clamp-2">{tour.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{tour.duration} min</Badge>
              <Badge variant="outline">{tour.hotspots.length} hotspots</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotspot Details Popup */}
      {selectedHotspot && (
        <div className="absolute inset-4 z-30 flex items-center justify-center">
          <Card className="bg-white max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedHotspot.title}</CardTitle>
                <Button size="sm" variant="ghost" onClick={handleCloseHotspot}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">{selectedHotspot.description}</p>
              
              {selectedHotspot.type === 'video' && selectedHotspot.mediaUrl && (
                <div className="bg-slate-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-600">Video content available</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedHotspot.mediaUrl}</p>
                </div>
              )}
              
              {selectedHotspot.type === 'audio' && selectedHotspot.mediaUrl && (
                <div className="bg-slate-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-600">Audio content available</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedHotspot.mediaUrl}</p>
                </div>
              )}
              
              {selectedHotspot.type === 'link' && selectedHotspot.linkedTourId && (
                <div className="mt-4">
                  <Button className="w-full">
                    Visit Linked Tour
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading overlay (for realism) */}
      <div className="absolute top-4 right-4 z-20">
        <Badge variant="secondary" className="bg-green-500 text-white">
          360° Tour Active
        </Badge>
      </div>
    </div>
  );
}