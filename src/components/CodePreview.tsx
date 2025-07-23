import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useState } from 'react';

interface CodePreviewProps {
  code: string;
  fileName: string;
  language?: string;
}

const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'cpp': 'cpp',
    'c': 'c',
    'java': 'java',
    'cs': 'csharp',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
  };
  return languageMap[extension || ''] || 'text';
};

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  fileName,
  language,
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const detectedLanguage = language || getLanguageFromFileName(fileName);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full glow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-accent">
                <FileCode className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">{fileName}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {detectedLanguage.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {code.split('\n').length} lines
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative max-h-96 overflow-auto border-t">
            <SyntaxHighlighter
              language={detectedLanguage}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: isDark ? '#6b7280' : '#9ca3af',
                borderRight: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                marginRight: '1em',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};