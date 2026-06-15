import axios from 'axios';

const JUDGE0_API_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

const LANGUAGE_MAP: Record<string, number> = {
  'c': 50,
  'cpp': 54,
  'java': 62,
  'python': 71,
  'javascript': 63,
};

export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0SubmissionResponse {
  token: string;
  stdout: string | null;
  time: string | null;
  memory: number | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}

export const getLanguageId = (language: string): number => {
  const id = LANGUAGE_MAP[language.toLowerCase()];
  if (!id) throw new Error(`Unsupported language: ${language}`);
  return id;
};

export const submitCodeToJudge0 = async (
  sourceCode: string,
  languageId: number,
  stdin: string = '',
  expectedOutput: string = ''
): Promise<Judge0SubmissionResponse> => {
  try {
    const payload = {
      source_code: Buffer.from(sourceCode).toString('base64'),
      language_id: languageId,
      stdin: stdin ? Buffer.from(stdin).toString('base64') : null,
      expected_output: expectedOutput ? Buffer.from(expectedOutput).toString('base64') : null,
    };

    // Use wait=true to get the result synchronously from Judge0 CE
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Decode base64 outputs
    const data = response.data;
    if (data.stdout) data.stdout = Buffer.from(data.stdout, 'base64').toString('utf-8');
    if (data.stderr) data.stderr = Buffer.from(data.stderr, 'base64').toString('utf-8');
    if (data.compile_output) data.compile_output = Buffer.from(data.compile_output, 'base64').toString('utf-8');
    if (data.message) data.message = Buffer.from(data.message, 'base64').toString('utf-8');

    return data;
  } catch (error: any) {
    console.error('Judge0 Submission Error:', error?.response?.data || error.message);
    throw new Error('Failed to execute code on Judge0');
  }
};

export const mapJudge0StatusToVerdict = (statusId: number): string => {
  // Judge0 status IDs: https://ce.judge0.com/#statuses-and-languages-status-get
  switch (statusId) {
    case 1:
    case 2:
      return 'Pending';
    case 3:
      return 'Accepted';
    case 4:
      return 'Wrong Answer';
    case 5:
      return 'Time Limit Exceeded';
    case 6:
      return 'Compilation Error';
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return 'Runtime Error';
    case 13:
    case 14:
      return 'Internal Error';
    default:
      return 'Internal Error';
  }
};
