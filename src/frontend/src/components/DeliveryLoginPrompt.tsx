import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useOtpAuth } from '../hooks/useOtpAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Truck, DollarSign, MapPin, Mail, Phone, Shield, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryLoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const { sendOtp, verifyOtp, resendOtp, clearSession, status, error, session, canResend } = useOtpAuth();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [activeTab, setActiveTab] = useState('identity');

  const isLoggingIn = loginStatus === 'logging-in';
  const isSending = status === 'sending';
  const isVerifying = status === 'verifying';

  useEffect(() => {
    setOtp('');
  }, [activeTab]);

  // Validate Indian phone number format
  const isValidIndianPhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/\s/g, '');
    return cleaned.startsWith('+91') && cleaned.length >= 13;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      await sendOtp('email', email);
      toast.success('Verification code sent! Check your email.', {
        description: 'The code will expire in 5 minutes.',
      });
    } catch (error) {
      toast.error('Failed to send verification code', {
        description: error instanceof Error ? error.message : 'Please check your email and try again.',
      });
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter your phone number');
      return;
    }

    // Frontend validation for Indian phone numbers
    if (!isValidIndianPhone(phone)) {
      toast.error('Invalid phone number', {
        description: 'Only Indian phone numbers (+91) are supported. Please enter a valid Indian phone number.',
      });
      return;
    }

    try {
      await sendOtp('phone', phone);
      toast.success('Verification code sent! Check your phone.', {
        description: 'The code will expire in 5 minutes.',
      });
    } catch (error) {
      toast.error('Failed to send verification code', {
        description: error instanceof Error ? error.message : 'Please check your phone number and try again.',
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      const isValid = await verifyOtp(otp);
      if (isValid) {
        toast.success('Login successful!', {
          description: 'Welcome to Fresh Delivery. Redirecting...',
        });
      } else {
        toast.error('Invalid verification code', {
          description: 'Please check the code and try again.',
        });
      }
    } catch (error) {
      toast.error('Verification failed', {
        description: 'Network error. Please try again.',
      });
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) {
      toast.error('Please wait before resending', {
        description: 'You can resend the code after 30 seconds.',
      });
      return;
    }

    try {
      await resendOtp();
      toast.success('New verification code sent!', {
        description: 'Check your ' + (session?.method === 'email' ? 'email' : 'phone') + ' for the new code.',
      });
      setOtp('');
    } catch (error) {
      toast.error('Failed to resend code', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleBackToInput = () => {
    clearSession();
    setOtp('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-blue-100/50 px-4 py-12">
      <div className="container max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Fresh{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Delivery
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your deliveries, track earnings, and serve customers with Fresh.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Accept Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle availability and accept delivery assignments
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Route Management</h3>
                  <p className="text-sm text-muted-foreground">
                    View assigned pickups and deliveries with optimized routes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                <DollarSign className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Track Earnings</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your daily and weekly earnings in real-time
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-blue-200 dark:border-blue-800 shadow-lg">
              <CardHeader>
                <CardTitle>Delivery Partner Login</CardTitle>
                <CardDescription>Choose your preferred login method</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {status === 'success' && session?.verified && (
                  <Alert className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900 dark:text-blue-100">
                      Successfully verified! Logging you in...
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="identity">
                      <Shield className="h-4 w-4 mr-2" />
                      Identity
                    </TabsTrigger>
                    <TabsTrigger value="email">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="identity" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Secure login with Internet Identity - no passwords needed
                    </p>
                    <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-5 w-5" />
                          Login with Internet Identity
                        </>
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="email" className="space-y-4">
                    {!session || session.method !== 'email' ? (
                      <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSending}
                          />
                        </div>
                        <Button type="submit" disabled={isSending} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                          {isSending ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="otp">Verification Code</Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            disabled={isVerifying}
                            autoFocus
                            className="text-center text-2xl tracking-widest"
                          />
                          <p className="text-xs text-muted-foreground">
                            Code sent to {session.identifier}
                          </p>
                        </div>
                        <Button type="submit" disabled={isVerifying || otp.length !== 6} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                          {isVerifying ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Verifying...
                            </>
                          ) : (
                            'Verify & Login'
                          )}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={handleResendOtp}
                            disabled={!canResend || isSending}
                          >
                            {isSending ? 'Sending...' : 'Resend Code'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={handleBackToInput}
                          >
                            Use different email
                          </Button>
                        </div>
                      </form>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="phone" className="space-y-4">
                    {!session || session.method !== 'phone' ? (
                      <form onSubmit={handlePhoneLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Indian Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            disabled={isSending}
                          />
                          <p className="text-xs text-muted-foreground">
                            Only Indian phone numbers (+91) are supported
                          </p>
                        </div>
                        <Button type="submit" disabled={isSending} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                          {isSending ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="otp-phone">Verification Code</Label>
                          <Input
                            id="otp-phone"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            disabled={isVerifying}
                            autoFocus
                            className="text-center text-2xl tracking-widest"
                          />
                          <p className="text-xs text-muted-foreground">
                            Code sent to {session.identifier}
                          </p>
                        </div>
                        <Button type="submit" disabled={isVerifying || otp.length !== 6} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                          {isVerifying ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Verifying...
                            </>
                          ) : (
                            'Verify & Login'
                          )}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={handleResendOtp}
                            disabled={!canResend || isSending}
                          >
                            {isSending ? 'Sending...' : 'Resend Code'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={handleBackToInput}
                          >
                            Use different phone
                          </Button>
                        </div>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="relative hidden lg:block">
            <img
              src="/assets/generated/delivery-hero.dim_800x600.jpg"
              alt="Fresh Delivery Partner"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
