import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Problem from './models/Problem.js';
import Submission from './models/Submission.js';
import { executeCode } from './services/codeExecution.js';
import { analyzeError } from './services/errorAnalyzer.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const upload = multer({ dest: 'uploads/' });

dotenv.config();
console.log('Environment loaded, checking for MongoDB URI...');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const count = await Problem.countDocuments();
    if (count < 11) {
      await Problem.deleteMany({});

      const problemsToInsert = [
        {
          title: 'Find the largest element in an array',
          description: 'Given numeric inputs separated by spaces on a single line, find the maximum. Use stdin to read inputs.',
          difficulty: 'Easy',
          category: 'AI Driven 75',
          topics: ['Arrays'],
          testCases: [
            { input: '2 5 1 8', expectedOutput: '8' },
            { input: '-1 -5 -10 -2', expectedOutput: '-1' },
            { input: '0', expectedOutput: '0' }
          ],
          starterCode: {
            javascript: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim();\nconst arr = input.split(' ').map(Number);\n\n// Write code to find largest in arr and console.log it\n",
            python: "import sys\ninput_data = sys.stdin.read().split()\narr = [int(x) for x in input_data]\n\n# Print the maximum element\n",
            java: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    // Read input and find max\n  }\n}",
            cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int num;\n  // Read inputs and output max\n  return 0;\n}"
          }
        },
        {
          title: 'Palindrome String',
          description: 'Given a string word, check if it is a palindrome. Output true or false. Use stdin.',
          difficulty: 'Easy',
          category: 'AI Driven 75',
          topics: ['Strings'],
          testCases: [
            { input: 'racecar', expectedOutput: 'true' },
            { input: 'hello', expectedOutput: 'false' }
          ],
          starterCode: {
            javascript: "const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim();\n// Print true or false\n"
          }
        },
        {
          title: 'Two Sum',
          description: 'Given an array of integers and an integer target, return the indices of the two numbers such that they add up to target. (Space separated integers, target on second line). output format: index1 index2',
          difficulty: 'Easy',
          topics: ['Arrays', 'Hash Table'],
          testCases: [
            { input: '2 7 11 15\n9', expectedOutput: '0 1' },
            { input: '3 2 4\n6', expectedOutput: '1 2' }
          ]
        },
        {
          title: 'Valid Parentheses',
          description: 'Given a string containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
          difficulty: 'Medium',
          topics: ['Stacks', 'Strings'],
          testCases: [
            { input: '()', expectedOutput: 'true' },
            { input: '()[]{}', expectedOutput: 'true' },
            { input: '(]', expectedOutput: 'false' }
          ]
        },
        {
          title: 'Merge Intervals',
          description: 'Given an array of intervals where intervals[i] = [starti, endi] (flattened as space separated ints), merge all overlapping intervals.',
          difficulty: 'Medium',
          topics: ['Arrays', 'Sorting'],
          testCases: [
            { input: '1 3 2 6 8 10 15 18', expectedOutput: '1 6 8 10 15 18' },
            { input: '1 4 4 5', expectedOutput: '1 5' }
          ]
        },
        {
          title: 'Maximum Subarray',
          description: 'Given an integer array nums (space separated), find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
          difficulty: 'Medium',
          category: 'Top Interview 150',
          topics: ['Arrays', 'Dynamic Programming'],
          testCases: [
            { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
            { input: '1', expectedOutput: '1' },
            { input: '5 4 -1 7 8', expectedOutput: '23' }
          ]
        },
        {
          title: 'Climbing Stairs',
          description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top? Input n is a single integer.',
          difficulty: 'Easy',
          category: 'Top Interview 150',
          topics: ['Dynamic Programming', 'Math'],
          testCases: [
            { input: '2', expectedOutput: '2' },
            { input: '3', expectedOutput: '3' },
            { input: '4', expectedOutput: '5' }
          ]
        },
        {
          title: 'Reverse String',
          description: 'Given a string, output the reverse of the string.',
          difficulty: 'Easy',
          topics: ['Strings', 'Two Pointers'],
          testCases: [
            { input: 'hello', expectedOutput: 'olleh' },
            { input: 'Hannah', expectedOutput: 'hannaH' }
          ]
        },
        {
          title: 'Contains Duplicate',
          description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct. Input is space-separated integers.',
          difficulty: 'Easy',
          topics: ['Arrays', 'Hash Table'],
          testCases: [
            { input: '1 2 3 1', expectedOutput: 'true' },
            { input: '1 2 3 4', expectedOutput: 'false' },
            { input: '1 1 1 3 3 4 3 2 4 2', expectedOutput: 'true' }
          ]
        },
        {
          title: 'Combine Two Tables',
          description: 'Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.',
          difficulty: 'Easy',
          category: 'SQL 50',
          topics: ['Database', 'SQL'],
          testCases: [
            { input: 'Person = [[1, "Wang", "Allen"]], Address = [[1, 1, "New York", "NY"]]', expectedOutput: 'Allen Wang New York NY' }
          ]
        }
      ];

      await Problem.insertMany(problemsToInsert);
      console.log('Seeded database with all ' + problemsToInsert.length + ' problems.');
    }
  } catch (e) {
    console.error('Could not seed DB (using fallback data):', e);
  }
};
mongoose.connection.on('open', seedDB);

const mockProblems = [
  {
    _id: 'array-maximum',
    title: 'Find the largest element in an array',
    description: 'Given numeric inputs separated by spaces on a single line, find the maximum.',
    difficulty: 'Easy',
    topics: ['Arrays'],
    testCases: [
      { input: '2 5 1 8', expectedOutput: '8' },
      { input: '-1 -5 -10 -2', expectedOutput: '-1' },
      { input: '0', expectedOutput: '0' },
      { input: '100 200 500 300 400', expectedOutput: '500' }
    ]
  },
  {
    _id: 'palindrome-string',
    title: 'Palindrome String',
    description: 'Given a string, print "true" if it is a palindrome, otherwise print "false".',
    difficulty: 'Easy',
    topics: ['Strings'],
    testCases: [
      { input: 'racecar', expectedOutput: 'true' },
      { input: 'hello', expectedOutput: 'false' },
      { input: 'a', expectedOutput: 'true' }
    ]
  },
  {
    _id: 'two-sum',
    title: 'Two Sum',
    description: 'Given an array of integers and an integer target, return the indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    topics: ['Arrays', 'Hash Table'],
    testCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3 2 4\n6', expectedOutput: '1 2' }
    ]
  },
  {
    _id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: 'Given a string containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    difficulty: 'Medium',
    topics: ['Stacks', 'Strings'],
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[]{}', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false' }
    ]
  },
  {
    _id: 'merge-intervals',
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi] (flattened as space separated ints), merge all overlapping intervals.',
    difficulty: 'Medium',
    topics: ['Arrays', 'Sorting'],
    testCases: [
      { input: '1 3 2 6 8 10 15 18', expectedOutput: '1 6 8 10 15 18' },
      { input: '1 4 4 5', expectedOutput: '1 5' }
    ]
  },
  {
    _id: 'maximum-subarray',
    title: 'Maximum Subarray',
    description: 'Given an integer array nums (space separated), find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'Medium',
    topics: ['Arrays', 'Dynamic Programming'],
    testCases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
      { input: '1', expectedOutput: '1' },
      { input: '5 4 -1 7 8', expectedOutput: '23' }
    ]
  },
  {
    _id: 'climbing-stairs',
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top? Input n is a single integer.',
    difficulty: 'Easy',
    topics: ['Dynamic Programming', 'Math'],
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '4', expectedOutput: '5' }
    ]
  },
  {
    _id: 'reverse-string',
    title: 'Reverse String',
    description: 'Given a string, output the reverse of the string.',
    difficulty: 'Easy',
    topics: ['Strings', 'Two Pointers'],
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'Hannah', expectedOutput: 'hannaH' }
    ]
  },
  {
    _id: 'contains-duplicate',
    title: 'Contains Duplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct. Input is space-separated integers.',
    difficulty: 'Easy',
    topics: ['Arrays', 'Hash Table'],
    testCases: [
      { input: '1 2 3 1', expectedOutput: 'true' },
      { input: '1 2 3 4', expectedOutput: 'false' },
      { input: '1 1 1 3 3 4 3 2 4 2', expectedOutput: 'true' }
    ]
  }
];

let fallbackSubmissions = [];

let fallbackUsers = [];

app.post('/api/auth/register', upload.single('resume'), async (req, res) => {
  try {
    const { username, email, password, adminKey, college, github } = req.body;
    let resumeSkills = [];

    if (req.file) {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        const text = data.text.toLowerCase();
        const possibleSkills = ['react', 'node', 'python', 'java', 'c++', 'javascript', 'sql', 'mongodb', 'docker', 'aws', 'data structures', 'algorithms', 'frontend', 'backend'];
        resumeSkills = possibleSkills.filter(skill => text.includes(skill));

        if (resumeSkills.length > 0) {
          req.body.aiResumeAnalysis = `Based on your resume, our AI engine detected a strong technical foundation in ${resumeSkills.join(', ')}. To maximize your interview success rate, we have tailored your daily problem recommendations specifically to test these frameworks. Focus deeply on the associated algorithms.`;
        } else {
          req.body.aiResumeAnalysis = `Our AI couldn't extract definitive technical skills from the document. We recommend mastering foundational structures via our AI Driven 75 list.`;
        }
        fs.unlinkSync(req.file.path);
      } catch (err) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        req.body.aiResumeAnalysis = "We encountered an error parsing your resume. For now, focus on mastering general data structures and algorithms.";
      }
    } else {
      req.body.aiResumeAnalysis = "You bypassed the AI resume analysis. We recommend mastering the top 75 foundational questions before specializing in a framework or language.";
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Simple admin key verification for demonstration logic
    const role = (adminKey === 'SECRET_ADMIN_KEY') ? 'admin' : 'student';

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });
      const user = await User.create({ username, email, passwordHash, role, college, github, resumeSkills, aiResumeAnalysis: req.body.aiResumeAnalysis });
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user._id, username, email, role: user.role, college: user.college, github: user.github, resumeSkills: user.resumeSkills, aiResumeAnalysis: user.aiResumeAnalysis } });
    } else {
      const existingUser = fallbackUsers.find(u => u.email === email);
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });

      const user = { _id: 'mock_user_' + Date.now(), username, email, passwordHash, role, college, github, resumeSkills, aiResumeAnalysis: req.body.aiResumeAnalysis, errorDnaProfile: {} };
      fallbackUsers.push(user);
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user._id, username, email, role: user.role, college: user.college, github: user.github, resumeSkills: user.resumeSkills, aiResumeAnalysis: user.aiResumeAnalysis } });
    }
  } catch (e) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = fallbackUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, college: user.college, github: user.github, resumeSkills: user.resumeSkills, aiResumeAnalysis: user.aiResumeAnalysis } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Platform API is running' });
});

app.get('/api/problems', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('DB not ready');
    const problems = await Problem.find({}, '-testCases.expectedOutput');
    res.json(problems.length ? problems : mockProblems.map(p => ({ ...p, testCases: undefined })));
  } catch (e) {
    res.json(mockProblems.map(p => ({ ...p, testCases: undefined })));
  }
});

app.get('/api/problems/:id', async (req, res) => {
  try {
    let problem;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(req.params.id)) {
      problem = await Problem.findById(req.params.id).lean();
      if (problem && problem.testCases) {
        problem.testCases = problem.testCases.filter(tc => !tc.isHidden);
      }
    } else {
      problem = mockProblems.find(p => p._id === req.params.id);
    }
    res.json(problem || mockProblems[0]);
  } catch (e) {
    res.json(mockProblems[0]);
  }
});

app.post('/api/problems', async (req, res) => {
  try {
    const newProblemData = req.body;
    if (mongoose.connection.readyState === 1) {
      const problem = await Problem.create(newProblemData);
      res.status(201).json(problem);
    } else {
      const mockProblem = {
        _id: 'mock-' + Date.now().toString(),
        ...newProblemData
      };
      mockProblems.push(mockProblem);
      res.status(201).json(mockProblem);
    }
  } catch (e) {
    console.error('Error creating problem:', e);
    res.status(500).json({ error: 'Failed to create problem' });
  }
});

app.delete('/api/problems/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Problem.findByIdAndDelete(req.params.id);
      res.json({ message: 'Problem deleted' });
    } else {
      const idx = mockProblems.findIndex(p => p._id === req.params.id);
      if (idx !== -1) mockProblems.splice(idx, 1);
      res.json({ message: 'Problem deleted' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete problem' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    let usersCount, problemsCount, submissionsCount;
    if (mongoose.connection.readyState === 1) {
      usersCount = await User.countDocuments();
      problemsCount = await Problem.countDocuments();
      submissionsCount = await Submission.countDocuments();
    } else {
      usersCount = fallbackUsers.length;
      problemsCount = mockProblems.length;
      submissionsCount = fallbackSubmissions.length;
    }

    res.json({ usersCount, problemsCount, submissionsCount });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

app.get('/api/users/:userId/dna', async (req, res) => {
  try {
    let submissions = [];
    if (mongoose.connection.readyState === 1) {
      submissions = await Submission.find({ userId: req.params.userId }).lean();
    } else {
      submissions = fallbackSubmissions.filter(s => s.userId === req.params.userId);
    }

    const totalSubmissions = submissions.length;
    const solvedProblems = new Set(submissions.filter(s => s.status === 'Accepted').map(s => String(s.problemId || s.mockId))).size;
    const errorCounts = {};
    let recentErrors = [];

    submissions.forEach(s => {
      if (s.status !== 'Accepted' && s.errorDetails && s.errorDetails.errorType) {
        const type = s.errorDetails.errorType;

        // Never profile system errors into a user's DNA or insights
        if (type === 'system_error') return;

        errorCounts[type] = (errorCounts[type] || 0) + 1;

        // Only push high-level logic/algorithmic suggestions to the Dashboard Insights
        if (type !== 'syntax_error') {
          recentErrors.push({
            type,
            // Splitting by \n guarantees we only send the high-level suggestion tip, stripping any tracebacks appended
            explanation: s.errorDetails.explanation ? s.errorDetails.explanation.split('\n')[0] : '',
            date: s.createdAt || new Date()
          });
        }
      }
    });

    recentErrors.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Default fallback placeholder if no algorithmic insights exist yet
    if (recentErrors.length === 0) {
      recentErrors.push({ type: 'general_tip', explanation: '💡 Tip: Always test your code with small edge-case inputs like empty strings or arrays before submitting!' });
    }

    let topError = Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    let recommendedTopics = ['Arrays', 'Strings'];
    if (topError === 'edge_case_missing') recommendedTopics = ['Empty Array Edge Cases'];
    if (topError === 'loop_logic_error') recommendedTopics = ['For Loop Bounds', 'While Loops'];

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.params.userId);
    } else {
      user = fallbackUsers.find(u => u._id === req.params.userId);
    }

    // Merge AI extracted resume skills prioritizing them as targeted problem sets
    if (user && user.resumeSkills && user.resumeSkills.length > 0) {
      const mappedSkills = user.resumeSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1) + ' Interview Prep');
      recommendedTopics = [...new Set([...mappedSkills.slice(0, 3), ...recommendedTopics])];
    }

    const solvedProblemIds = Array.from(new Set(submissions.filter(s => s.status === 'Accepted').map(s => String(s.problemId || s.mockId))));

    // Mock diff categories for the dashboard stats
    const easyCount = Math.min(solvedProblemIds.length, Math.floor(Math.random() * 5) + 1);
    const medCount = solvedProblemIds.length > easyCount ? solvedProblemIds.length - easyCount : 0;
    const hardCount = 0;

    const recentSubmissions = submissions.slice(0, 5).map(s => ({
      title: s.mockId?.includes('mock') ? 'Mock Problem' : 'Two Sum', // Fallback title
      status: s.status,
      language: s.language,
      time: s.createdAt || new Date()
    }));

    // Streak & Active Days Calculation
    const submissionDays = [...new Set(submissions.map(s => {
      const d = new Date(s.createdAt || Date.now());
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }))].sort((a, b) => new Date(b) - new Date(a));

    const activeDays = submissionDays.length;
    let streak = 0;

    if (activeDays > 0) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const yesterday = new Date(Date.now() - 86400000);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      let checkDate = new Date();
      if (submissionDays[0] === todayStr) {
        checkDate = today;
      } else if (submissionDays[0] === yesterdayStr) {
        checkDate = yesterday;
      }

      if (submissionDays[0] === todayStr || submissionDays[0] === yesterdayStr) {
        streak = 1;
        for (let i = 1; i < submissionDays.length; i++) {
          checkDate = new Date(checkDate.getTime() - 86400000);
          const expectedStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (submissionDays[i] === expectedStr) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    res.json({
      stats: {
        totalSubmissions,
        solvedProblems: solvedProblemIds.length,
        easy: { solved: easyCount, total: 250 },
        medium: { solved: medCount, total: 500 },
        hard: { solved: hardCount, total: 150 },
        streak,
        activeDays
      },
      errorDNA: Object.entries(errorCounts).map(([type, count]) => ({ type, count })),
      recentInsights: [...new Map(recentErrors.map(item => [item.type, item])).values()].slice(0, 3).map(i => i.explanation),
      recommendations: recommendedTopics,
      recentSubmissions
    });
  } catch (e) {
    res.json({ stats: { totalSubmissions: 0, solvedProblems: 0 }, errorDNA: [], recentInsights: [], recommendations: [] });
  }
});

app.get('/api/users/:userId/solved', async (req, res) => {
  try {
    const { userId } = req.params;
    let submissions = [];
    if (mongoose.connection.readyState === 1) {
      submissions = await Submission.find({ userId, status: 'Accepted' }, 'problemId mockId').lean();
    } else {
      submissions = fallbackSubmissions.filter(s => s.userId === userId && s.status === 'Accepted');
    }
    const solvedProblemIds = Array.from(new Set(submissions.map(s => String(s.problemId || s.mockId))));
    res.json(solvedProblemIds);
  } catch (e) {
    res.json([]);
  }
});

app.get('/api/submissions/:problemId/:userId', async (req, res) => {
  try {
    const { problemId, userId } = req.params;
    let submissions = [];
    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(problemId)) {
        submissions = await Submission.find({ userId, problemId }).sort({ createdAt: -1 }).lean();
        if (!submissions.length) {
          submissions = await Submission.find({ userId, mockId: problemId }).sort({ createdAt: -1 }).lean();
        }
      } else {
        submissions = await Submission.find({ userId, mockId: problemId }).sort({ createdAt: -1 }).lean();
      }
    } else {
      submissions = fallbackSubmissions.filter(s => s.userId === userId && (s.problemId === problemId || s.mockId === problemId)).reverse();
    }
    res.json(submissions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.post('/api/run-code', async (req, res) => {
  const { code, language, problemId, userId = 'lokesh', isSubmit } = req.body;

  try {
    let problem;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(problemId)) {
      problem = await Problem.findById(problemId);
    } else {
      problem = mockProblems.find(p => p._id === problemId) || mockProblems[0];
    }

    const executionResult = await executeCode(code, language, problem.testCases);
    const errorDetails = analyzeError(code, language, executionResult, problem.topics);

    const subInfo = {
      userId,
      problemId: problem._id !== problemId ? undefined : problemId,
      mockId: problemId,
      code,
      language,
      status: executionResult.status,
      runtime: executionResult.runtime || 0,
      memoryUsage: executionResult.memoryUsage || 0,
      failedTestCase: executionResult.failedTestCase,
      errorDetails,
      createdAt: new Date()
    };

    if (isSubmit) {
      if (mongoose.connection.readyState === 1) {
        await Submission.create(subInfo);
      } else {
        fallbackSubmissions.push(subInfo);
      }
    }

    res.json(subInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server execution failure' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Use path.resolve to correctly traverse up from backend to frontend/dist
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
