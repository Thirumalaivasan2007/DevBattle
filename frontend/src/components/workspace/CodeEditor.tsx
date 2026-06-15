'use client';

import React, { useState, useRef, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Maximize, Minimize, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  language: string;
  setLanguage: (lang: string) => void;
  sourceCode: string;
  setSourceCode: (code: string) => void;
}

const DEFAULT_TEMPLATES: Record<string, string> = {
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}\n',
  python: 'def solve():\n    print("Hello World")\n\nif __name__ == "__main__":\n    solve()\n',
  javascript: 'function solve() {\n    console.log("Hello World");\n}\n\nsolve();\n'
};

const MONACO_LANGUAGES: Record<string, string> = {
  c: 'c',
  cpp: 'cpp',
  java: 'java',
  python: 'python',
  javascript: 'javascript'
};

export default function CodeEditor({ language, setLanguage, sourceCode, setSourceCode }: CodeEditorProps) {
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const monaco = useMonaco();

  // Initialize with template if empty
  useEffect(() => {
    if (!sourceCode) {
      setSourceCode(DEFAULT_TEMPLATES[language] || '');
    }
  }, []);

  const handleLanguageChange = (val: string | null) => {
    if (!val) return;
    setLanguage(val);
    // When language changes, update the source code to the new template
    // but only if it's currently matching the old template or empty
    setSourceCode(DEFAULT_TEMPLATES[val] || '');
  };

  const handleReset = () => {
    setSourceCode(DEFAULT_TEMPLATES[language] || '');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col bg-[#1e1e1e] border-l border-border/40 ${isFullscreen ? 'h-screen w-screen fixed top-0 left-0 z-50' : 'h-full w-full'}`}
    >
      <div className="flex items-center justify-between p-2 bg-muted/20 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[130px] h-8 bg-[#2d2d2d] border-none text-xs focus:ring-0">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-border/20">
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleReset} title="Reset Code">
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Select value={fontSize.toString()} onValueChange={(val: string | null) => { if (val) setFontSize(parseInt(val)) }}>
            <SelectTrigger className="w-[70px] h-8 bg-[#2d2d2d] border-none text-xs focus:ring-0">
              <Settings className="h-3 w-3 mr-1" />
              {fontSize}
            </SelectTrigger>
            <SelectContent className="bg-[#2d2d2d] border-border/20">
              {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={MONACO_LANGUAGES[language]}
          theme="vs-dark"
          value={sourceCode}
          onChange={(value) => setSourceCode(value || '')}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
          }}
          loading={
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Loading Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
