import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Maximize, Volume2, VolumeX, Info, Settings, Share2, Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from 'react-router-dom';

interface TourHotspot {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number; z: number };
  type: 'info' | 'video' | 'audio' | 'link';
  content?: string;
  mediaUrl?: string;
  linkedTourId?: string;
}

interface Tour360 {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: number;
  panoramaUrl: string;
  audioUrl?: string;
  hotspots: TourHotspot[];
  relatedTours: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

// Sample 360° tours data
const sample360Tours: Tour360[] = [
  {
    id: 'marrakech-medina',
    title: 'Marrakech Medina Virtual Walk',
    description: 'Experience the bustling streets and vibrant souks of Marrakech\'s ancient medina',
    location: 'Marrakech, Morocco',
    duration: 15,
    panoramaUrl: '/panoramas/marrakech-medina-360.jpg',
    audioUrl: '/audio/marrakech-medina-guide.mp3',
    difficulty: 'Easy',
    category: 'Cultural Heritage',
    hotspots: [
      {
        id: 'souk1',
        title: 'Traditional Spice Market',
        description: 'Discover the aromatic world of Moroccan spices and herbs',
        position: { x: 45, y: 30, z: 20 },
        type: 'info',
        content: 'The spice markets of Marrakech have been trading exotic spices for over 1000 years...'
      },
      {
        id: 'fountain1',
        title: 'Historic Fountain',
        description: 'Learn about the traditional water systems',
        position: { x: -30, y: 15, z: 25 },
        type: 'video',
        mediaUrl: '/videos/marrakech-fountain-history.mp4'
      },
      {
        id: 'craftsman1',
        title: 'Master Craftsman at Work',
        description: 'Watch traditional metalworking techniques',
        position: { x: 60, y: -10, z: 15 },
        type: 'video',
        mediaUrl: '/videos/moroccan-metalwork.mp4'
      }
    ],
    relatedTours: ['fes-medina', 'chefchaouen-streets']
  }
];

export default function Enhanced360Tour() {
  const { tourId } = useParams();
  const [currentTour] = useState<Tour360>(sample360Tours[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<TourHotspot | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [volume, setVolume] = useState([70]);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Auto rotation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRotate) {
      interval = setInterval(() => {
        setRotation(prev => ({ ...prev, y: (prev.y + 0.5) % 360 }));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [autoRotate]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setAutoRotate(!autoRotate);
  };

  const handleReset = () => {
    setRotation({ x: 0, y: 0 });
    setIsPlaying(false);
    setAutoRotate(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleHotspotClick = (hotspot: TourHotspot) => {
    setSelectedHotspot(hotspot);
  };

  const getHotspotPosition = (hotspot: TourHotspot) => {
    const rotationOffset = (rotation.y / 360) * 100;
    const baseX = 50 + (hotspot.position.x / 50) * 30;
    const baseY = 50 + (hotspot.position.y / 50) * 20;
    
    return {
      left: `${(baseX + rotationOffset) % 100}%`,
      top: `${Math.max(10, Math.min(90, baseY))}%`
    };
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Link to="/gallery">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gallery
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{currentTour.title}</h1>
              <p className="text-sm text-white/80">{currentTour.location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentTour.duration} min
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentTour.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      {/* 360° Viewer */}
      <div 
        ref={viewerRef}
        className={`relative w-full ${isFullscreen ? 'h-screen' : 'h-screen'} overflow-hidden`}
      >
        {/* Panoramic Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-orange-900 transition-transform duration-100"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            backgroundImage: `url('${currentTour.panoramaUrl}'), linear-gradient(45deg, #1e3a8a, #7c3aed, #ea580c)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          {/* Simulated 360° environment elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-orange-400 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-10 right-1/3 w-18 h-18 bg-pink-400 rounded-full blur-lg animate-pulse delay-3000"></div>
          </div>
        </div>

        {/* Interactive Hotspots */}
        {showHotspots && currentTour.hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={getHotspotPosition(hotspot)}
          >
            <Button
              size="sm"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-black shadow-lg animate-pulse"
              onClick={() => handleHotspotClick(hotspot)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Control Panel */}
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <Card className="bg-black/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              {/* Main Controls */}
              <div className="flex items-center justify-between mb-4">
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
                  <Select value={quality} onValueChange={(value: 'high' | 'medium' | 'low') => setQuality(value)}>
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">HD</SelectItem>
                      <SelectItem value="medium">SD</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
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
                </div>
              </div>

              {/* Rotation Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm min-w-0">Horizontal:</span>
                  <Slider
                    value={[rotation.y]}
                    onValueChange={(value) => setRotation(prev => ({ ...prev, y: value[0] }))}
                    max={360}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-white text-sm min-w-0">{Math.round(rotation.y)}°</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm min-w-0">Vertical:</span>
                  <Slider
                    value={[rotation.x]}
                    onValueChange={(value) => setRotation(prev => ({ ...prev, x: value[0] }))}
                    min={-30}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-white text-sm min-w-0">{Math.round(rotation.x)}°</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tour Information */}
        <div className="absolute top-20 left-4 z-30 max-w-sm">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{currentTour.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{currentTour.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentTour.duration} min</Badge>
                <Badge variant="outline">{currentTour.hotspots.length} hotspots</Badge>
                <Badge variant="outline">{currentTour.category}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-20 right-4 z-30">
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" className="bg-white/90">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white/90">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="bg-white/90">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hotspot Details Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <Card className="bg-white max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedHotspot.title}</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setSelectedHotspot(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">{selectedHotspot.description}</p>
              
              {selectedHotspot.type === 'info' && selectedHotspot.content && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedHotspot.content}</p>
                </div>
              )}
              
              {selectedHotspot.type === 'video' && selectedHotspot.mediaUrl && (
                <div className="bg-slate-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-600">Video content available</p>
                  <Button size="sm" className="mt-2">
                    <Play className="h-4 w-4 mr-2" />
                    Play Video
                  </Button>
                </div>
              )}
              
              {selectedHotspot.type === 'audio' && selectedHotspot.mediaUrl && (
                <div className="bg-slate-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-slate-600">Audio content available</p>
                  <Button size="sm" className="mt-2">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Play Audio
                  </Button>
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
    </div>
  );
}