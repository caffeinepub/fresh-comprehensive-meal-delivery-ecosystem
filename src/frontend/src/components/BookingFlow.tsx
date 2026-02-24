import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Calendar } from 'lucide-react';
import { useCreateDabbaBooking } from '../hooks/useQueries';
import { PickupSlotEnum, SubscriptionTypeEnum } from '../types/local';
import { toast } from 'sonner';

interface BookingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function BookingFlow({ onComplete, onCancel }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [slotTime, setSlotTime] = useState<PickupSlotEnum>(PickupSlotEnum.morning);
  const [frequency, setFrequency] = useState<SubscriptionTypeEnum>(SubscriptionTypeEnum.daily);

  const createBooking = useCreateDabbaBooking();

  const handleNext = () => {
    if (step === 1 && (!pickupAddress || !dropAddress)) {
      toast.error('Please fill in both addresses');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      await createBooking.mutateAsync({
        pickupAddress,
        dropAddress,
        slotTime,
        frequency,
      });
      toast.success('Booking created successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Book Dabba Pickup</CardTitle>
          <CardDescription>Step {step} of 3</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Pickup Address (Home)
                </Label>
                <Input
                  id="pickup"
                  placeholder="Enter your home address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drop">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Drop Address (Office)
                </Label>
                <Input
                  id="drop"
                  placeholder="Enter your office address"
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>
                  <Clock className="inline h-4 w-4 mr-2" />
                  Pickup Time Slot
                </Label>
                <RadioGroup value={slotTime} onValueChange={(value) => setSlotTime(value as PickupSlotEnum)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={PickupSlotEnum.morning} id="morning" />
                    <Label htmlFor="morning" className="flex-1 cursor-pointer">
                      <div className="font-medium">Morning Slot</div>
                      <div className="text-sm text-muted-foreground">8:00 AM - 10:00 AM</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={PickupSlotEnum.midMorning} id="midMorning" />
                    <Label htmlFor="midMorning" className="flex-1 cursor-pointer">
                      <div className="font-medium">Mid-Morning Slot</div>
                      <div className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Frequency
                </Label>
                <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as SubscriptionTypeEnum)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={SubscriptionTypeEnum.daily} id="daily" />
                    <Label htmlFor="daily" className="flex-1 cursor-pointer">
                      <div className="font-medium">Daily</div>
                      <div className="text-sm text-muted-foreground">Monday to Friday</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={SubscriptionTypeEnum.weekly} id="weekly" />
                    <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                      <div className="font-medium">Weekly</div>
                      <div className="text-sm text-muted-foreground">Select specific days</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Pickup Address</div>
                  <div className="font-medium">{pickupAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Drop Address</div>
                  <div className="font-medium">{dropAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Slot</div>
                  <div className="font-medium">
                    {slotTime === PickupSlotEnum.morning ? '8:00 AM - 10:00 AM' : '10:00 AM - 12:00 PM'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Frequency</div>
                  <div className="font-medium capitalize">{frequency}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={createBooking.isPending} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                {createBooking.isPending ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            )}
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
