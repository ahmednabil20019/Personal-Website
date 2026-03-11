import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const Seed = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setSeedResult(data);
    } catch (error) {
      setSeedResult({
        success: false,
        message: 'Failed to connect to seeding API: ' + (error as Error).message
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Database Seeding</h1>
            <p className="text-muted-foreground text-lg">
              Initialize your portfolio with sample data
            </p>
          </div>

          <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Database className="w-5 h-5 text-white" />
                </div>
                Seed Portfolio Data
              </CardTitle>
              <CardDescription>
                This will populate your portfolio with sample content including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>About section content</li>
                  <li>Skills and technologies</li>
                  <li>Services offered</li>
                  <li>Sample projects</li>
                  <li>Contact information</li>
                </ul>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Note</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This will only create data if it doesn't already exist. Existing data will not be overwritten.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                size="lg"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Seed Database
                  </>
                )}
              </Button>

              {seedResult && (
                <div className={`rounded-lg p-4 ${
                  seedResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {seedResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium ${
                        seedResult.success 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {seedResult.success ? 'Success!' : 'Error'}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        seedResult.success 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {seedResult.message}
                      </p>
                      {seedResult.success && (
                        <div className="mt-3">
                          <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            size="sm"
                          >
                            View Portfolio
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              After seeding, you can customize all content through the{' '}
              <a href="/admin" className="text-primary hover:underline">
                Admin Panel
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
