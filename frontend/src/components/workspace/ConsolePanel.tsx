'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Send, Terminal, Clock, Cpu, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ExecutionResult {
  stdout?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  message?: string | null;
  time?: string | null;
  memory?: number | null;
  verdict?: string;
  status?: string;
}

interface ConsolePanelProps {
  customInput: string;
  setCustomInput: (val: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  executionResult: ExecutionResult | null;
  submissionResult: any | null;
}

export default function ConsolePanel({ 
  customInput, setCustomInput, onRun, onSubmit, isRunning, isSubmitting, executionResult, submissionResult 
}: ConsolePanelProps) {
  const [activeTab, setActiveTab] = useState<'input' | 'output' | 'verdict'>('input');

  // Automatically switch tabs based on results
  React.useEffect(() => {
    if (executionResult && !submissionResult) setActiveTab('output');
    if (submissionResult) setActiveTab('verdict');
  }, [executionResult, submissionResult]);

  const getVerdictColor = (verdict?: string) => {
    if (!verdict) return 'text-muted-foreground';
    if (verdict === 'Accepted') return 'text-success border-success bg-success/10';
    if (verdict === 'Pending' || verdict === 'Running') return 'text-warning border-warning bg-warning/10';
    return 'text-destructive border-destructive bg-destructive/10';
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-border/40 text-sm">
      <div className="flex items-center justify-between px-4 h-10 border-b border-border/20 bg-muted/10">
        <div className="flex space-x-1">
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'input' ? 'bg-[#2d2d2d] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('input')}
          >
            Testcases
          </button>
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'output' ? 'bg-[#2d2d2d] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('output')}
          >
            Execution Result
          </button>
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'verdict' ? 'bg-[#2d2d2d] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('verdict')}
          >
            Verdict
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {activeTab === 'input' && (
          <div className="flex flex-col h-full">
            <label className="text-xs text-muted-foreground mb-2 flex items-center">
              <Terminal className="h-3 w-3 mr-1" /> Custom Input
            </label>
            <Textarea 
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom input here..."
              className="flex-1 bg-[#0d0d0d] border-border/20 font-mono text-sm resize-none focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
        )}

        {activeTab === 'output' && (
          <div className="flex flex-col h-full">
            {!executionResult && !isRunning && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Run your code to see the output here.
              </div>
            )}
            
            {isRunning && (
              <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p>Executing Code on Judge0...</p>
              </div>
            )}

            {executionResult && !isRunning && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`px-2 py-1 ${getVerdictColor(executionResult.verdict)}`}>
                    {executionResult.verdict || executionResult.status}
                  </Badge>
                  {executionResult.time && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {parseFloat(executionResult.time) * 1000} ms
                    </span>
                  )}
                  {executionResult.memory && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Cpu className="h-3 w-3 mr-1" /> {executionResult.memory} KB
                    </span>
                  )}
                </div>

                {executionResult.compileOutput && (
                  <div>
                    <div className="text-xs text-destructive mb-1">Compilation Output</div>
                    <pre className="bg-[#0d0d0d] p-3 rounded-md overflow-x-auto text-destructive/90 border border-destructive/20 whitespace-pre-wrap font-mono text-xs">
                      {executionResult.compileOutput}
                    </pre>
                  </div>
                )}

                {executionResult.stderr && (
                  <div>
                    <div className="text-xs text-destructive mb-1">Standard Error</div>
                    <pre className="bg-[#0d0d0d] p-3 rounded-md overflow-x-auto text-destructive/90 border border-destructive/20 whitespace-pre-wrap font-mono text-xs">
                      {executionResult.stderr}
                    </pre>
                  </div>
                )}

                {executionResult.stdout !== undefined && !executionResult.compileOutput && !executionResult.stderr && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Standard Output</div>
                    <pre className="bg-[#0d0d0d] p-3 rounded-md overflow-x-auto border border-border/20 whitespace-pre-wrap font-mono text-xs text-zinc-300 min-h-[60px]">
                      {executionResult.stdout || 'Program exited with no output.'}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'verdict' && (
          <div className="flex flex-col h-full">
            {!submissionResult && !isSubmitting && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Submit your code to see the final verdict against all hidden test cases.
              </div>
            )}

            {isSubmitting && (
              <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-success" />
                <p>Evaluating against all hidden test cases...</p>
              </div>
            )}

            {submissionResult && !isSubmitting && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {submissionResult.verdict === 'Accepted' ? (
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  ) : (
                    <XCircle className="h-8 w-8 text-destructive" />
                  )}
                  <h3 className={`text-2xl font-bold ${submissionResult.verdict === 'Accepted' ? 'text-success' : 'text-destructive'}`}>
                    {submissionResult.verdict}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted/10 rounded-lg p-3 border border-border/10">
                    <div className="text-xs text-muted-foreground mb-1">Test Cases</div>
                    <div className="text-lg font-mono">
                      <span className={submissionResult.testCasesPassed === submissionResult.totalTestCases ? 'text-success' : 'text-warning'}>
                        {submissionResult.testCasesPassed}
                      </span>
                      <span className="text-muted-foreground"> / {submissionResult.totalTestCases}</span>
                    </div>
                  </div>
                  <div className="bg-muted/10 rounded-lg p-3 border border-border/10">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center"><Clock className="h-3 w-3 mr-1" /> Runtime</div>
                    <div className="text-lg font-mono">{submissionResult.runtime} ms</div>
                  </div>
                  <div className="bg-muted/10 rounded-lg p-3 border border-border/10">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center"><Cpu className="h-3 w-3 mr-1" /> Memory</div>
                    <div className="text-lg font-mono">{submissionResult.memory} KB</div>
                  </div>
                  <div className="bg-muted/10 rounded-lg p-3 border border-border/10">
                    <div className="text-xs text-muted-foreground mb-1">Score</div>
                    <div className="text-lg font-mono font-bold text-primary">{submissionResult.score}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="h-14 border-t border-border/20 bg-[#1e1e1e] flex items-center justify-end px-4 gap-3">
        <Button 
          variant="secondary" 
          onClick={onRun} 
          disabled={isRunning || isSubmitting}
          className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-foreground min-w-[100px]"
        >
          {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 text-primary" />}
          Run Code
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isRunning || isSubmitting}
          className="bg-success/20 text-success hover:bg-success/30 hover:text-success border border-success/30 min-w-[100px]"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Submit
        </Button>
      </div>
    </div>
  );
}
