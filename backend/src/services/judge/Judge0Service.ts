import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

const headers = {
  'content-type': 'application/json',
};

const LANGUAGE_MAP: { [key: string]: number } = {
  javascript: 93, // Node.js
  python: 71,
  java: 62,
  c: 50,
  cpp: 54,
};

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  runtime: number;
  memory: number;
  verdict: string;
}

const mapJudge0Status = (statusId: number): string => {
  if (statusId === 3) return 'Accepted';
  if (statusId === 4) return 'Wrong Answer';
  if (statusId === 5) return 'Time Limit Exceeded';
  if (statusId === 6) return 'Compilation Error';
  if (statusId >= 7 && statusId <= 12) return 'Runtime Error';
  return 'Internal Error';
};

export const executeOnJudge0 = async (
  language: string,
  sourceCode: string,
  input: string = '',
  timeLimitMs: number = 3000,
  memoryLimitMb: number = 256
): Promise<ExecutionResult> => {
  const languageId = LANGUAGE_MAP[language.toLowerCase()];
  
  if (!languageId) {
    throw new Error(`Unsupported language on Judge0: ${language}`);
  }

  try {
    const payload = {
      source_code: Buffer.from(sourceCode).toString('base64'),
      language_id: languageId,
      stdin: input ? Buffer.from(input).toString('base64') : null,
      cpu_time_limit: timeLimitMs / 1000,
      memory_limit: memoryLimitMb * 1024,
    };

    // Use wait=true to get the result synchronously from Judge0 CE
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`,
      payload,
      { headers }
    );

    const data = response.data;
    
    // Decode base64 outputs
    const decodeB64 = (str: string | null) => str ? Buffer.from(str, 'base64').toString('utf-8') : '';

    return {
      stdout: decodeB64(data.stdout),
      stderr: decodeB64(data.stderr),
      compileOutput: decodeB64(data.compile_output),
      runtime: data.time ? parseFloat(data.time) * 1000 : 0,
      memory: data.memory || 0,
      verdict: mapJudge0Status(data.status?.id || 6)
    };

  } catch (error: any) {
    console.error('Judge0 API Error:', error.response?.data || error.message);
    
    // Fallback error payload
    return {
      stdout: '',
      stderr: error.message,
      compileOutput: '',
      runtime: 0,
      memory: 0,
      verdict: 'Internal Error'
    };
  }
};
