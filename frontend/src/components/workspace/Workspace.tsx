'use client';

import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from './CodeEditor';
import ConsolePanel from './ConsolePanel';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'next/navigation';

interface WorkspaceProps {
  problemDescription: React.ReactNode;
}

export default function Workspace({ problemDescription }: WorkspaceProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const problemSlug = params.slug as string;
  const [problemId, setProblemId] = useState<string | null>(null);

  React.useEffect(() => {
    api.get(`/problems/${problemSlug}`).then(res => {
      const id = res.data._id || res.data.data?._id;
      setProblemId(id);
    }).catch(err => {
      console.error(err);
    });
  }, [problemSlug]);

  const [language, setLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleRun = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please write some code before running.');
      return;
    }

    setIsRunning(true);
    setExecutionResult(null);
    setSubmissionResult(null);

    try {
      const response = await api.post('/execution/run', {
        sourceCode,
        language,
        customInput
      });
      setExecutionResult(response.data);
      if (response.data.verdict === 'Accepted') {
        toast.success('Execution Completed');
      } else {
        toast.warning(`Execution finished with status: ${response.data.verdict || response.data.status}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Execution failed.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please write some code before submitting.');
      return;
    }
    if (!problemId) {
      toast.error('Problem ID is missing. Please refresh the page.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setExecutionResult(null);

    try {
      const response = await api.post('/submissions/submit', {
        problemId,
        sourceCode,
        language,
        contestId: searchParams.get('contest')
      });
      setSubmissionResult(response.data);
      if (response.data.verdict === 'Accepted') {
        toast.success('Congratulations! Solution Accepted.');
      } else {
        toast.error(`Submission Failed: ${response.data.verdict}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-background flex flex-col md:flex-row overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="hidden md:flex w-full h-full">
        {/* Left Panel: Problem Description */}
        <ResizablePanel defaultSize={45} minSize={30} className="h-full bg-card">
          <div className="h-full overflow-auto custom-scrollbar p-6">
            {problemDescription}
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-border/40 hover:bg-primary/50 transition-colors cursor-col-resize flex items-center justify-center">
          <div className="h-8 w-1 rounded-full bg-muted-foreground/30" />
        </ResizableHandle>

        {/* Right Panel: Editor & Console */}
        <ResizablePanel defaultSize={55} minSize={30} className="flex flex-col h-full bg-[#1e1e1e]">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={20}>
              <CodeEditor 
                language={language}
                setLanguage={setLanguage}
                sourceCode={sourceCode}
                setSourceCode={setSourceCode}
              />
            </ResizablePanel>
            
            <ResizableHandle className="h-2 bg-border/40 hover:bg-primary/50 transition-colors cursor-row-resize flex items-center justify-center">
              <div className="w-8 h-1 rounded-full bg-muted-foreground/30" />
            </ResizableHandle>

            <ResizablePanel defaultSize={40} minSize={10}>
              <ConsolePanel 
                customInput={customInput}
                setCustomInput={setCustomInput}
                onRun={handleRun}
                onSubmit={handleSubmit}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                executionResult={executionResult}
                submissionResult={submissionResult}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Mobile Layout: Stacked/Tabs (Simplified version for mobile) */}
      <div className="md:hidden flex flex-col h-full w-full">
        <div className="flex-1 overflow-auto p-4 border-b border-border/40 bg-card">
          {problemDescription}
        </div>
        <div className="h-[50vh] flex flex-col">
          <div className="flex-1 border-b border-border/40 min-h-0">
            <CodeEditor 
              language={language}
              setLanguage={setLanguage}
              sourceCode={sourceCode}
              setSourceCode={setSourceCode}
            />
          </div>
          <div className="h-64 flex-shrink-0">
            <ConsolePanel 
              customInput={customInput}
              setCustomInput={setCustomInput}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              executionResult={executionResult}
              submissionResult={submissionResult}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
