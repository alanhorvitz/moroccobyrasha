import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CreditCard, CheckCircle, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

export interface BookingItem {
  id: string;
  type: 'tour' | 'guide' | 'transport';
  title: string;
  description: string;
  price: number;
  duration?: string;
  maxParticipants?: number;
  availableDates?: Date[];
  location?: string;
  provider?: {
    name: string;
    rating: number;
    contact: {
      phone?: string;
      email?: string;
    };
  };
}

interface BookingSystemProps {
  item: BookingItem;
  onBookingComplete?: (bookingData: BookingFormData & { item: BookingItem; reference: string; totalAmount: number; bookingDate: Date }) => void;
  onClose?: () => void;
}

interface BookingFormData {
  selectedDate: Date | null;
  numberOfParticipants: number;
  duration: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests: string;
  paymentMethod: string;
}

export default function BookingSystem({ item, onBookingComplete, onClose }: BookingSystemProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    selectedDate: null,
    numberOfParticipants: 1,
    duration: item.duration || '1 day',
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    specialRequests: '',
    paymentMethod: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate available dates (next 30 days excluding weekends for demo)
  const availableDates = item.availableDates || Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return date.getDay() !== 0 && date.getDay() !== 6 ? date : null;
  }).filter(Boolean) as Date[];

  const totalPrice = bookingData.numberOfParticipants * item.price;
  const serviceFee = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!bookingData.selectedDate) newErrors.date = 'Please select a date';
      if (bookingData.numberOfParticipants < 1) newErrors.participants = 'Please select number of participants';
      if (item.maxParticipants && bookingData.numberOfParticipants > item.maxParticipants) {
        newErrors.participants = `Maximum ${item.maxParticipants} participants allowed`;
      }
    }

    if (step === 2) {
      if (!bookingData.contactInfo.firstName) newErrors.firstName = 'First name is required';
      if (!bookingData.contactInfo.lastName) newErrors.lastName = 'Last name is required';
      if (!bookingData.contactInfo.email) newErrors.email = 'Email is required';
      if (!bookingData.contactInfo.phone) newErrors.phone = 'Phone number is required';
      if (bookingData.contactInfo.email && !/\S+@\S+\.\S+/.test(bookingData.contactInfo.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if (step === 3) {
      if (!bookingData.paymentMethod) newErrors.payment = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmitBooking = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reference = `MOR-${Date.now().toString(36).toUpperCase()}`;
      setBookingReference(reference);
      setBookingCompleted(true);
      
      if (onBookingComplete) {
        onBookingComplete({
          ...bookingData,
          item,
          reference,
          totalAmount: finalTotal,
          bookingDate: new Date()
        });
      }
    } catch (error) {
      setErrors({ general: 'Booking failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">Booking Confirmed!</CardTitle>
          <CardDescription>Your booking has been successfully processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-green-600 mb-2">Booking Reference</p>
              <p className="text-xl font-mono font-bold text-green-800">{bookingReference}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="font-semibold">Service</Label>
              <p>{item.title}</p>
            </div>
            <div>
              <Label className="font-semibold">Date</Label>
              <p>{bookingData.selectedDate ? format(bookingData.selectedDate, 'PPP') : 'N/A'}</p>
            </div>
            <div>
              <Label className="font-semibold">Participants</Label>
              <p>{bookingData.numberOfParticipants} person(s)</p>
            </div>
            <div>
              <Label className="font-semibold">Total Amount</Label>
              <p className="font-bold">${finalTotal}</p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A confirmation email has been sent to {bookingData.contactInfo.email}. 
              Please check your inbox for booking details and instructions.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" className="flex-1">
              View My Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep >= step ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"
              )}>
                {step}
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium",
                currentStep >= step ? "text-emerald-600" : "text-gray-500"
              )}>
                {step === 1 && "Select Date"}
                {step === 2 && "Contact Info"}
                {step === 3 && "Payment"}
              </span>
              {step < 3 && (
                <div className={cn(
                  "w-8 h-0.5 ml-8",
                  currentStep > step ? "bg-emerald-600" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Select Date & Participants"}
                {currentStep === 2 && "Contact Information"}
                {currentStep === 3 && "Payment Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Date & Participants */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2",
                            !bookingData.selectedDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {bookingData.selectedDate ? format(bookingData.selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={bookingData.selectedDate || undefined}
                          onSelect={(date) => setBookingData(prev => ({ ...prev, selectedDate: date || null }))}
                          disabled={(date) => 
                            isBefore(date, new Date()) || 
                            !availableDates.some(availDate => 
                              format(availDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <Label htmlFor="participants">Number of Participants</Label>
                    <Select
                      value={bookingData.numberOfParticipants.toString()}
                      onValueChange={(value) => setBookingData(prev => ({ ...prev, numberOfParticipants: parseInt(value) }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select participants" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: item.maxParticipants || 10 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.participants && <p className="text-sm text-red-500 mt-1">{errors.participants}</p>}
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={bookingData.duration}
                      onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="half-day">Half Day (4 hours)</SelectItem>
                        <SelectItem value="full-day">Full Day (8 hours)</SelectItem>
                        <SelectItem value="2-days">2 Days</SelectItem>
                        <SelectItem value="3-days">3 Days</SelectItem>
                        <SelectItem value="custom">Custom Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={bookingData.contactInfo.firstName}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, firstName: e.target.value }
                        }))}
                        className="mt-2"
                      />
                      {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={bookingData.contactInfo.lastName}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, lastName: e.target.value }
                        }))}
                        className="mt-2"
                      />
                      {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.contactInfo.email}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      className="mt-2"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.contactInfo.phone}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="mt-2"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Any special requirements, dietary restrictions, or requests..."
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      {['credit-card', 'paypal', 'bank-transfer'].map((method) => (
                        <Button
                          key={method}
                          variant={bookingData.paymentMethod === method ? "default" : "outline"}
                          className="p-4 h-auto flex flex-col items-center gap-2"
                          onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: method }))}
                        >
                          <CreditCard className="h-6 w-6" />
                          <span className="capitalize">{method.replace('-', ' ')}</span>
                        </Button>
                      ))}
                    </div>
                    {errors.payment && <p className="text-sm text-red-500 mt-1">{errors.payment}</p>}
                  </div>

                  {bookingData.paymentMethod === 'credit-card' && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="**** **** **** ****" className="mt-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="***" className="mt-2" />
                        </div>
                      </div>
                    </div>
                  )}

                  {bookingData.paymentMethod === 'paypal' && (
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}

                  {bookingData.paymentMethod === 'bank-transfer' && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Bank transfer details will be provided after booking confirmation.</p>
                      <p className="text-xs text-gray-500">Note: Payment must be completed within 24 hours to secure your booking.</p>
                    </div>
                  )}

                  {errors.general && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 3 ? (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmitBooking} disabled={isLoading}>
                    {isLoading ? 'Processing...' : `Complete Booking ($${finalTotal})`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                {item.location && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.location}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{bookingData.selectedDate ? format(bookingData.selectedDate, 'MMM dd, yyyy') : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span>{bookingData.numberOfParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingData.duration}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span>${item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee:</span>
                  <span>${serviceFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${finalTotal}</span>
                </div>
              </div>

              {item.provider && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm mb-2">Service Provider</h4>
                    <div className="space-y-1 text-xs">
                      <p className="font-medium">{item.provider.name}</p>
                      <div className="flex items-center">
                        <span>Rating: ⭐ {item.provider.rating}/5</span>
                      </div>
                      {item.provider.contact.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {item.provider.contact.phone}
                        </div>
                      )}
                      {item.provider.contact.email && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {item.provider.contact.email}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}