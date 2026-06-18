import { IExecutionJob } from '../../models/ExecutionJob';
import Problem from '../../models/Problem';
import { executeOnJudge0 } from './Judge0Service';

export const executeCode = async (job: IExecutionJob) => {
  if (job.isCustomExecution) {
    // Single execution against custom input
    const result = await executeOnJudge0(job.language, job.sourceCode, job.customInput || '', 5000); // 5 sec limit for custom run
    return result;
  }

  // Full problem submission evaluation
  if (!job.problemId) {
    throw new Error('Problem ID is missing for submission job');
  }

  const problem = await Problem.findById(job.problemId);
  if (!problem) {
    throw new Error('Problem not found');
  }

  const allTestCases = [
    ...problem.examples.map((ex: any) => ({ input: ex.input, output: ex.output })),
    ...problem.testCases.map((tc: any) => ({ input: tc.input, output: tc.output }))
  ];

  if (allTestCases.length === 0) {
    throw new Error('No test cases found');
  }

  let finalVerdict = 'Accepted';
  let maxRuntime = 0;
  let maxMemory = 0;
  let passedCount = 0;
  let lastStdout = '';
  let lastStderr = '';
  let compileOutput = '';

  for (let i = 0; i < allTestCases.length; i++) {
    const { input, output: expectedOutput } = allTestCases[i];
    
    const result = await executeOnJudge0(job.language, job.sourceCode, input, 3000); // 3 sec strict limit for test cases
    
    compileOutput = result.compileOutput || '';
    lastStdout = result.stdout;
    lastStderr = result.stderr;

    if (result.runtime > maxRuntime) maxRuntime = result.runtime;
    if (result.memory > maxMemory) maxMemory = result.memory;

    if (result.verdict === 'Compilation Error' || result.verdict === 'Time Limit Exceeded' || result.verdict === 'Runtime Error') {
      finalVerdict = result.verdict;
      break;
    }

    // Compare output
    const cleanOutput = result.stdout.trim().replace(/\r\n/g, '\n');
    const cleanExpected = expectedOutput.trim().replace(/\r\n/g, '\n');

    if (cleanOutput !== cleanExpected) {
      finalVerdict = 'Wrong Answer';
      break;
    }

    passedCount++;
  }

  return {
    verdict: finalVerdict,
    runtime: maxRuntime,
    memory: maxMemory,
    stdout: lastStdout,
    stderr: lastStderr,
    compileOutput,
    passedCount,
    totalCount: allTestCases.length
  };
};
