import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  TrendingUp,
  Shield,
  Code,
  Zap
} from 'lucide-react';

interface ReviewIssue {
  type: 'bug' | 'vulnerability' | 'improvement' | 'style';
  severity: 'low' | 'medium' | 'high' | 'critical';
  line?: number;
  title: string;
  description: string;
  suggestion?: string;
}

interface ReviewResultsProps {
  overallScore: number;
  issues: ReviewIssue[];
  strengths: string[];
  fileName: string;
  isLoading?: boolean;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'warning';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'bug': return XCircle;
    case 'vulnerability': return Shield;
    case 'improvement': return TrendingUp;
    case 'style': return Code;
    default: return AlertTriangle;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-success';
  if (score >= 6) return 'text-warning';
  return 'text-destructive';
};

export const ReviewResults: React.FC<ReviewResultsProps> = ({
  overallScore,
  issues,
  strengths,
  fileName,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-primary" />
            </motion.div>
            <span>Analyzing Code...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Code Quality Score</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
            >
              {overallScore}/10
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallScore * 10} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Overall assessment for <span className="font-medium">{fileName}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span>Code Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Issues Found ({issues.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issues.map((issue, index) => {
                const TypeIcon = getTypeIcon(issue.type);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{issue.title}</h4>
                        {issue.line && (
                          <Badge variant="outline" className="text-xs">
                            Line {issue.line}
                          </Badge>
                        )}
                      </div>
                      <Badge variant={getSeverityColor(issue.severity) as any} className="text-xs">
                        {issue.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                    
                    {issue.suggestion && (
                      <>
                        <Separator />
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-primary mb-1">
                              Suggested Fix:
                            </p>
                            <p className="text-sm">{issue.suggestion}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Issues */}
      {issues.length === 0 && (
        <Card className="glow-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="p-3 rounded-full bg-success/10 w-fit mx-auto"
              >
                <CheckCircle className="h-8 w-8 text-success" />
              </motion.div>
              <h3 className="text-lg font-semibold text-success">
                Excellent Code Quality!
              </h3>
              <p className="text-muted-foreground">
                No significant issues found in your code.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};