import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { CodePreview } from './CodePreview';
import { ReviewResults } from './ReviewResults';
import { AnimatedBackground } from './AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Code, 
  History, 
  Settings,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

// Mock data for demonstration
const mockReviewResults = {
  overallScore: 7.5,
  issues: [
    {
      type: 'improvement' as const,
      severity: 'medium' as const,
      line: 15,
      title: 'Consider using const instead of let',
      description: 'Variable is never reassigned, const would be more appropriate',
      suggestion: 'Replace let with const for better code immutability'
    },
    {
      type: 'style' as const,
      severity: 'low' as const,
      line: 23,
      title: 'Inconsistent indentation',
      description: 'Mixed spaces and tabs detected',
      suggestion: 'Use consistent indentation (2 or 4 spaces) throughout the file'
    },
    {
      type: 'bug' as const,
      severity: 'high' as const,
      line: 42,
      title: 'Potential null reference error',
      description: 'Object property accessed without null check',
      suggestion: 'Add null check or use optional chaining (?.) operator'
    }
  ],
  strengths: [
    'Good function naming conventions',
    'Proper error handling implemented',
    'Clear code structure and organization',
    'Effective use of TypeScript types'
  ]
};

const mockHistory = [
  { id: 1, fileName: 'userService.js', score: 8.2, date: '2024-01-20', issues: 2 },
  { id: 2, fileName: 'apiClient.ts', score: 9.1, date: '2024-01-19', issues: 0 },
  { id: 3, fileName: 'utils.py', score: 6.8, date: '2024-01-18', issues: 5 },
];

export const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<{ file: File; content: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleFileSelect = (file: File, content: string) => {
    setSelectedFile({ file, content });
    setHasResults(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setHasResults(true);
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 glow-card"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-1.5 sm:p-2 rounded-lg bg-primary text-primary-foreground flex-shrink-0"
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold gradient-text truncate">
                   AI Code-Review 
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Intelligent code analysis powered by AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleTheme}
                className="rounded-full"
              >
                <ThemeIcon className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <Tabs defaultValue="review" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="review" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Review</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="samples" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Samples</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Upload & Preview */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <FileUpload onFileSelect={handleFileSelect} />
                </motion.div>
                
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CodePreview
                      code={selectedFile.content}
                      fileName={selectedFile.file.name}
                    />
                  </motion.div>
                )}
              </div>

              {/* Right Column - Analysis */}
              <div className="space-y-6">
                {selectedFile && !hasResults && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span>Ready for Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Your code is loaded and ready for AI-powered analysis. 
                          Click below to start the review process.
                        </p>
                        <Button 
                          onClick={handleAnalyze}
                          className="w-full"
                          size="lg"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Code
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {isAnalyzing && (
                  <ReviewResults
                    overallScore={0}
                    issues={[]}
                    strengths={[]}
                    fileName={selectedFile?.file.name || ''}
                    isLoading={true}
                  />
                )}

                {hasResults && selectedFile && (
                  <ReviewResults
                    overallScore={mockReviewResults.overallScore}
                    issues={mockReviewResults.issues}
                    strengths={mockReviewResults.strengths}
                    fileName={selectedFile.file.name}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Review History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHistory.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded bg-accent">
                            <Code className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{item.fileName}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={item.issues === 0 ? "default" : "secondary"}>
                            {item.issues} issues
                          </Badge>
                          <div className="text-right">
                            <div className="font-semibold">{item.score}/10</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="samples" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sample Code Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { name: 'react-component.jsx', desc: 'React functional component with hooks' },
                      { name: 'api-service.js', desc: 'RESTful API service implementation' },
                      { name: 'data-processor.py', desc: 'Python data processing script' },
                      { name: 'algorithm.java', desc: 'Java sorting algorithm implementation' }
                    ].map((sample, index) => (
                      <motion.div
                        key={sample.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                      >
                        <h4 className="font-medium">{sample.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sample.desc}
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          Try Sample
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};