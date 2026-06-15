import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem';
import User from '../models/User';

dotenv.config();

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    inputFormat: 'The first line contains an integer n (the length of the array). The second line contains n space-separated integers. The third line contains the target integer.',
    outputFormat: 'Return a JSON array or comma separated array of two indices.',
    constraints: '- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9\n- Only one valid answer exists.',
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: '3\n3 2 4\n6',
        output: '[1, 2]',
      }
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9', output: '[0, 1]', isHidden: false },
      { input: '3\n3 2 4\n6', output: '[1, 2]', isHidden: false },
      { input: '2\n3 3\n6', output: '[0, 1]', isHidden: true },
      { input: '5\n1 2 3 4 5\n9', output: '[3, 4]', isHidden: true },
    ],
    hints: ['A really brute force way would be to search for all possible pairs of numbers.', 'Can we use a hash map?'],
    editorial: 'Use a hash map to store the elements as you iterate. For each element `nums[i]`, check if `target - nums[i]` exists in the map.',
    tags: ['Array', 'Hash Table'],
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Apple'],
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a **palindrome**, or* \`false\` *otherwise*.`,
    inputFormat: 'A single string `s`.',
    outputFormat: 'Print `true` if it is a palindrome, else `false`.',
    constraints: '- 1 <= s.length <= 2 * 10^5\n- `s` consists only of printable ASCII characters.',
    examples: [
      {
        input: 'A man, a plan, a canal: Panama',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 'race a car',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      }
    ],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', output: 'true', isHidden: false },
      { input: 'race a car', output: 'false', isHidden: false },
      { input: ' ', output: 'true', isHidden: true },
      { input: '0P', output: 'false', isHidden: true },
      { input: 'ab_a', output: 'true', isHidden: true },
    ],
    hints: ['Two pointers can be used here. One starting from the beginning, one from the end.'],
    editorial: 'Initialize two pointers left and right. Move them towards the center, skipping non-alphanumeric characters. Compare the characters at both pointers (case-insensitive).',
    tags: ['Two Pointers', 'String'],
    companyTags: ['Facebook', 'Microsoft', 'Spotify'],
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`ith\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    inputFormat: 'First line contains an integer `n`. Second line contains `n` space-separated integers representing `height`.',
    outputFormat: 'Print the maximum area of water.',
    constraints: '- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4',
    examples: [
      {
        input: '9\n1 8 6 2 5 4 8 3 7',
        output: '49',
        explanation: 'The vertical lines are [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.',
      }
    ],
    testCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', output: '49', isHidden: false },
      { input: '2\n1 1', output: '1', isHidden: false },
      { input: '3\n4 3 2', output: '4', isHidden: true },
      { input: '5\n1 2 1 2 1', output: '4', isHidden: true },
    ],
    hints: ['If you simulate the brute force approach, it is O(n^2). Try to optimize it to O(n) using two pointers.'],
    editorial: 'Use two pointers, one at the beginning and one at the end. Calculate the area, then move the pointer that points to the shorter line inward.',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    companyTags: ['Amazon', 'Bloomberg', 'Goldman Sachs'],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    inputFormat: 'A string `s` on a single line.',
    outputFormat: 'Print an integer representing the length of the longest substring.',
    constraints: '- 0 <= s.length <= 5 * 10^4\n- `s` consists of English letters, digits, symbols and spaces.',
    examples: [
      {
        input: 'abcabcbb',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 'bbbbb',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      }
    ],
    testCases: [
      { input: 'abcabcbb', output: '3', isHidden: false },
      { input: 'bbbbb', output: '1', isHidden: false },
      { input: 'pwwkew', output: '3', isHidden: false },
      { input: 'a', output: '1', isHidden: true },
      { input: 'aab', output: '2', isHidden: true },
    ],
    hints: ['Use sliding window approach to keep track of the current substring without duplicates.'],
    editorial: 'Maintain a window `[left, right]`. If the character at `s[right]` is already in the window, shrink the window from the left until it is removed.',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companyTags: ['Amazon', 'Google', 'Facebook'],
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    inputFormat: 'First line: number of intervals N. Following N lines: two space-separated integers representing start and end of interval.',
    outputFormat: 'Print each merged interval on a new line as two space-separated integers.',
    constraints: '- 1 <= intervals.length <= 10^4\n- intervals[i].length == 2\n- 0 <= starti <= endi <= 10^4',
    examples: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        output: '1 6\n8 10\n15 18',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      }
    ],
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18', isHidden: false },
      { input: '2\n1 4\n4 5', output: '1 5', isHidden: false },
      { input: '1\n1 4', output: '1 4', isHidden: true },
      { input: '3\n1 4\n0 4\n5 6', output: '0 4\n5 6', isHidden: true },
    ],
    hints: ['Sort the intervals by their start time before trying to merge them.'],
    editorial: 'Sort intervals by starting time. Then iterate through them, keeping track of the current merged interval. If the next interval overlaps, extend the current one; otherwise, add it to the result.',
    tags: ['Array', 'Sorting'],
    companyTags: ['Facebook', 'LinkedIn', 'Google'],
  },
  {
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return *the **minimum window substring** of* \`s\` *such that every character in* \`t\` *(**including duplicates**) is included in the window*. If there is no such substring, return *the empty string* \`""\`.`,
    inputFormat: 'Two lines containing strings `s` and `t` respectively.',
    outputFormat: 'A single string, the minimum window substring.',
    constraints: '- m == s.length\n- n == t.length\n- 1 <= m, n <= 10^5\n- `s` and `t` consist of uppercase and lowercase English letters.',
    examples: [
      {
        input: 'ADOBECODEBANC\nABC',
        output: 'BANC',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.',
      }
    ],
    testCases: [
      { input: 'ADOBECODEBANC\nABC', output: 'BANC', isHidden: false },
      { input: 'a\na', output: 'a', isHidden: false },
      { input: 'a\nxyz', output: 'NONE', isHidden: false },
      { input: 'ab\nb', output: 'b', isHidden: true },
    ],
    hints: ['Use two pointers to create a window of letters in s, which would have all the characters from t.'],
    editorial: 'Use a sliding window. Expand `right` pointer until all characters of `t` are covered. Then advance `left` pointer to minimize the window while still covering all characters.',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companyTags: ['LinkedIn', 'Snapchat', 'Uber'],
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    inputFormat: 'First line contains an integer N. Second line contains N space-separated non-negative integers.',
    outputFormat: 'A single integer, the total water trapped.',
    constraints: '- n == height.length\n- 1 <= n <= 2 * 10^4\n- 0 <= height[i] <= 10^5',
    examples: [
      {
        input: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.',
      }
    ],
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', isHidden: false },
      { input: '6\n4 2 0 3 2 5', output: '9', isHidden: false },
      { input: '2\n2 0', output: '0', isHidden: true },
      { input: '3\n2 0 2', output: '2', isHidden: true },
    ],
    hints: ['Water trapped at any index is min(max_left, max_right) - height[i].'],
    editorial: 'Can be solved using Two Pointers or Dynamic Programming by precalculating the max height to the left and right of every element.',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    companyTags: ['Amazon', 'Microsoft', 'Goldman Sachs'],
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    difficulty: 'Medium',
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` *if* \`word\` *exists in the grid*.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    inputFormat: 'Line 1: m and n. Next m lines: n space-separated chars. Last line: the target string.',
    outputFormat: '`true` or `false`.',
    constraints: '- m == board.length\n- n = board[i].length\n- 1 <= m, n <= 6\n- 1 <= word.length <= 15',
    examples: [
      {
        input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED',
        output: 'true',
        explanation: 'Path is A->B->C->C->E->D',
      }
    ],
    testCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', output: 'true', isHidden: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nSEE', output: 'true', isHidden: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', output: 'false', isHidden: false },
      { input: '1 1\nA\nA', output: 'true', isHidden: true },
    ],
    hints: ['Use backtracking. Explore all 4 directions from a matching starting cell.'],
    editorial: 'Use DFS from each cell. Keep track of visited cells in the current path. If characters match, recursively search neighbors.',
    tags: ['Array', 'Backtracking', 'Matrix'],
    companyTags: ['Amazon', 'Microsoft', 'Apple'],
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    inputFormat: 'A single integer `n`.',
    outputFormat: 'A single integer representing the number of ways.',
    constraints: '- 1 <= n <= 45',
    examples: [
      {
        input: '2',
        output: '2',
        explanation: '1. 1 step + 1 step\n2. 2 steps',
      },
      {
        input: '3',
        output: '3',
        explanation: '1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step',
      }
    ],
    testCases: [
      { input: '2', output: '2', isHidden: false },
      { input: '3', output: '3', isHidden: false },
      { input: '4', output: '5', isHidden: true },
      { input: '5', output: '8', isHidden: true },
    ],
    hints: ['To reach nth step, what could have been your previous step? (Either n-1 or n-2)'],
    editorial: 'This is the Fibonacci sequence. The number of ways to reach step n is the sum of ways to reach step n-1 and n-2.',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    companyTags: ['Google', 'Amazon', 'Apple'],
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, return *an array* \`answer\` *such that* \`answer[i]\` *is equal to the product of all the elements of* \`nums\` *except* \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    inputFormat: 'First line: n. Second line: n space-separated integers.',
    outputFormat: 'A single line containing the space-separated resulting array.',
    constraints: '- 2 <= nums.length <= 10^5\n- -30 <= nums[i] <= 30\n- Guaranteed to fit in 32-bit integer.',
    examples: [
      {
        input: '4\n1 2 3 4',
        output: '24 12 8 6',
      },
      {
        input: '5\n-1 1 0 -3 3',
        output: '0 0 9 0 0',
      }
    ],
    testCases: [
      { input: '4\n1 2 3 4', output: '24 12 8 6', isHidden: false },
      { input: '5\n-1 1 0 -3 3', output: '0 0 9 0 0', isHidden: false },
      { input: '2\n1 2', output: '2 1', isHidden: true },
      { input: '3\n2 3 4', output: '12 8 6', isHidden: true },
    ],
    hints: ['Think about the product of elements to the left of i, and the product to the right of i.'],
    editorial: 'Calculate prefix products array and suffix products array. answer[i] = prefix[i-1] * suffix[i+1]. Can be optimized to O(1) space.',
    tags: ['Array', 'Prefix Sum'],
    companyTags: ['Amazon', 'Facebook', 'Microsoft'],
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    // Find admin user or first user
    let user = await User.findOne({ role: 'ADMIN' });
    if (!user) {
      user = await User.findOne();
    }

    if (!user) {
      console.error('No users found. Please create a user first before seeding.');
      process.exit(1);
    }

    // Assign createdBy
    const problemsWithAuthor = problems.map(p => ({
      ...p,
      createdBy: user?._id
    }));

    for (const p of problemsWithAuthor) {
      const exists = await Problem.findOne({ slug: p.slug });
      if (!exists) {
        await Problem.create(p);
        console.log('Created problem:', p.title);
      } else {
        console.log('Problem already exists, skipping:', p.title);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seed();
