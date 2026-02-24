import { ExternalLink, Smartphone, Truck, UtensilsCrossed, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LazyImage from './LazyImage';

export default function AppDirectory() {
  const baseUrl = window.location.origin;

  const apps = [
    {
      name: 'Fresh Customer App',
      description: 'Order home-cooked meals and schedule dabba pickup services',
      icon: Smartphone,
      color: 'fresh',
      url: `${baseUrl}?app=customer`,
      features: ['Browse restaurant meals', 'Schedule dabba pickups', 'Track deliveries', 'Manage subscriptions'],
      targetUsers: 'For customers ordering meals and dabba services',
    },
    {
      name: 'Fresh Delivery App',
      description: 'Manage deliveries and track your earnings as a delivery partner',
      icon: Truck,
      color: 'delivery',
      url: `${baseUrl}?app=delivery`,
      features: ['Accept delivery orders', 'Update delivery status', 'Track earnings', 'Manage availability'],
      targetUsers: 'For delivery partners and drivers',
    },
    {
      name: 'Fresh Restaurant App',
      description: 'Manage your restaurant menu and incoming orders',
      icon: UtensilsCrossed,
      color: 'restaurant',
      url: `${baseUrl}?app=restaurant`,
      features: ['Create and edit meals', 'Upload meal images', 'Manage orders', 'Track revenue'],
      targetUsers: 'For restaurant partners and food providers',
    },
    {
      name: 'Fresh Admin App',
      description: 'Oversee platform operations and manage all users',
      icon: Shield,
      color: 'admin',
      url: `${baseUrl}?app=admin`,
      features: ['User management', 'Analytics dashboard', 'Restaurant activation', 'System controls'],
      targetUsers: 'For platform administrators',
    },
  ];

  const handleInstall = (url: string) => {
    window.location.href = url;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-50 via-white to-fresh-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <LazyImage 
              src="/assets/generated/fresh-logo.dim_200x200.png" 
              alt="Fresh Logo" 
              className="h-12 w-12" 
              priority={true}
            />
            <div>
              <h1 className="text-2xl font-bold text-fresh-900">Fresh Ecosystem</h1>
              <p className="text-sm text-fresh-600">Choose your app to get started</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Fresh
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access our suite of Progressive Web Apps designed for customers, delivery partners, 
              restaurant owners, and administrators. Click any link below to install and launch your app.
            </p>
          </div>

          {/* App Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <Card 
                  key={app.name} 
                  className={`border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-${app.color}-50/30`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-${app.color}-100`}>
                        <Icon className={`h-8 w-8 text-${app.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{app.name}</CardTitle>
                        <CardDescription className="text-base">{app.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Target Users */}
                    <div className={`px-4 py-2 rounded-lg bg-${app.color}-100/50 border border-${app.color}-200`}>
                      <p className={`text-sm font-medium text-${app.color}-800`}>{app.targetUsers}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Key Features:</p>
                      <ul className="space-y-1">
                        {app.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full bg-${app.color}-500`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Installation URL */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Installation URL:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-xs text-gray-800 overflow-x-auto">
                          {app.url}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(app.url)}
                          className="shrink-0"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleInstall(app.url)}
                        className={`flex-1 bg-${app.color}-600 hover:bg-${app.color}-700 text-white`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open & Install App
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Installation Instructions */}
          <Card className="bg-gradient-to-br from-gray-50 to-white border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Installation Instructions</CardTitle>
              <CardDescription>How to install Fresh apps on your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mobile Instructions */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-fresh-600" />
                  Mobile Devices (iOS & Android)
                </h3>
                <ol className="space-y-2 ml-7 list-decimal text-gray-700">
                  <li>Click "Open & Install App" button for your desired app</li>
                  <li>On iOS: Tap the Share button, then "Add to Home Screen"</li>
                  <li>On Android: Tap the menu (⋮), then "Install app" or "Add to Home screen"</li>
                  <li>Follow the prompts to complete installation</li>
                  <li>Launch the app from your home screen</li>
                </ol>
              </div>

              {/* Desktop Instructions */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-fresh-600" />
                  Desktop (Chrome, Edge, Safari)
                </h3>
                <ol className="space-y-2 ml-7 list-decimal text-gray-700">
                  <li>Click "Open & Install App" button for your desired app</li>
                  <li>Look for the install icon in your browser's address bar</li>
                  <li>Click "Install" when prompted</li>
                  <li>The app will open in a standalone window</li>
                  <li>Access it anytime from your applications menu</li>
                </ol>
              </div>

              {/* Direct URL Access */}
              <div className="bg-fresh-50 p-4 rounded-lg border border-fresh-200">
                <h3 className="font-semibold text-lg mb-2 text-fresh-900">Direct URL Access</h3>
                <p className="text-sm text-fresh-800 mb-3">
                  You can also bookmark or share these URLs directly. Each URL will automatically 
                  load the correct app with proper PWA installation capabilities.
                </p>
                <p className="text-xs text-fresh-700">
                  <strong>Note:</strong> All apps work across mobile and desktop browsers with full 
                  offline support once installed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025. Built with love using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fresh-600 hover:text-fresh-700 font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
