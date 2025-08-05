import React from 'react';
import { Award, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketplaceBanner = () => {
  return (
    <div className="relative bg-slate-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{ backgroundImage: "url('/images/morocco-default.jpg')" }}
      ></div>
      <div className="relative container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Moroccan Artisan Marketplace
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto lg:mx-0">
              Discover authentic handcrafted treasures from across Morocco. 
              Support local artisans and bring home a piece of Moroccan heritage.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="default">
                Shop Now
              </Button>
              <Button size="lg" variant="outline">
                Meet Our Artisans
              </Button>
            </div>
          </div>
          <div className="hidden lg:block relative h-96">
            <div className="absolute top-0 left-[10%] w-60 h-60 rounded-lg overflow-hidden shadow-xl transform -rotate-6 z-30">
              <img src="/images/HassanTower.jpg" alt="Moroccan Craft" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-12 left-[30%] w-60 h-60 rounded-lg overflow-hidden shadow-xl transform rotate-6 z-20">
              <img src="/images/ParadiseValley.jpg" alt="Moroccan Craft" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-24 left-[50%] w-60 h-60 rounded-lg overflow-hidden shadow-xl transform -rotate-3 z-10">
              <img src="/images/Marrakech.jpg" alt="Moroccan Craft" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <Award className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Authentic Craftsmanship</h3>
            <p className="text-sm text-slate-300">Handcrafted by skilled artisans preserving centuries-old traditions</p>
          </div>
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Support Local Communities</h3>
            <p className="text-sm text-slate-300">Direct impact on artisan livelihoods and cultural preservation</p>
          </div>
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <Package className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Worldwide Shipping</h3>
            <p className="text-sm text-slate-300">Bringing Morocco's finest crafts directly to your doorstep</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceBanner;