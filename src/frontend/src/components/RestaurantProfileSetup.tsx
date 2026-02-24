import { useState } from 'react';
import { useSaveCallerUserProfile, useCreateRestaurantProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function RestaurantProfileSetup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveProfile = useSaveCallerUserProfile();
  const createRestaurantProfile = useCreateRestaurantProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter restaurant name');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (!operatingHours.trim()) {
      toast.error('Please enter operating hours');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save user profile first
      await saveProfile.mutateAsync({ name: name.trim(), userType: 'restaurant' });
      
      // Then create restaurant-specific profile
      await createRestaurantProfile.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        operatingHours: operatingHours.trim(),
      });
      
      toast.success('Profile created successfully! Awaiting admin activation.');
      
      // Small delay to ensure queries refetch before UI updates
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
      console.error('Profile creation error:', error);
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || saveProfile.isPending || createRestaurantProfile.isPending;

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-background to-orange-100/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Welcome to Fresh Restaurant!</CardTitle>
          <CardDescription>Let's set up your restaurant profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                placeholder="Enter restaurant name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your restaurant and cuisine"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input
                id="operatingHours"
                placeholder="e.g., Mon-Fri: 9AM-9PM"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
