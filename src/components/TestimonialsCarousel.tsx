'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Star } from 'lucide-react'

// Mock data - in real app this would come from your data layer
const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: '/images/SarahJohnson.jpg',
    rating: 5,
    text: 'An absolutely magical experience! The tour guides were knowledgeable and the accommodations were perfect. Morocco exceeded all my expectations.',
    tour: 'Imperial Cities Tour'
  },
  {
    id: '2', 
    name: 'Marco Rodriguez',
    location: 'Barcelona, Spain',
    avatar: '/images/avatars/marco.jpg',
    rating: 5,
    text: 'The Sahara Desert adventure was life-changing. Sleeping under the stars in the desert is something I\'ll never forget. Highly recommended!',
    tour: 'Sahara Desert Adventure'
  },
  {
    id: '3',
    name: 'Emily Chen',
    location: 'Toronto, Canada', 
    avatar: '/images/avatars/emily.jpg',
    rating: 5,
    text: 'The Atlas Mountains trek was challenging but incredibly rewarding. The Berber hospitality was exceptional and the landscapes were breathtaking.',
    tour: 'Atlas Mountains Trek'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    location: 'London, UK',
    avatar: '/images/avatars/ahmed.jpg', 
    rating: 5,
    text: 'As someone of Moroccan heritage, this trip allowed me to reconnect with my roots. The cultural experiences were authentic and meaningful.',
    tour: 'Cultural Heritage Tour'
  }
]

export default function TestimonialsCarousel() {
  const [testimonials] = useState(mockTestimonials)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Read authentic reviews from travelers who have experienced the magic of Morocco with us
          </p>
        </div>

        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-slate-600 mb-6 italic">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center">
                      <Avatar className="mr-4">
                        <AvatarImage 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/defaultavatar.jpg'
                          }}
                        />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">{testimonial.location}</div>
                        <div className="text-sm text-emerald-600">{testimonial.tour}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}