# AI-Driven DSA Learning Platform

This is a full-stack platform built with the **MERN stack (React, Node, Express, MongoDB)** principles, but designed to run flawlessly even without a local MongoDB instance. 

## Features Completed
1. **Interactive Dashboard**: Visualizes the user's "Error DNA" profile using charts to highlight their weakest points and provide AI-generated insights.
2. **Problem Directory**: A list of problems with difficulties and topics.
3. **Coding Editor Workspace**: A multi-language IDE interface.
4. **Real Code Execution**: Hooked up to the public Piston API to compile and execute user code against hidden test cases.
5. **Heuristic Error Analyzer**: Detects syntax errors, missing edge cases, infinite loops, and algorithmic flaws.
6. **Graceful DB Degradation**: Written to store submissions and problem configurations natively in MongoDB, but automatically falls back to an in-memory database if MongoDB is not detected!

## How To Run

Open **two** separate terminal windows from this directory.

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
*(The server will start on http://localhost:5000)*

### 2. Start the Frontend App
```bash
cd frontend
npm run dev
```
*(The React app will start on http://localhost:5173 - open this in your browser)*

### Usage
- Start by checking out the **Dashboard**.
- Navigate to the **Problems** tab and click **Solve** on the `Find the largest element in an array` problem.
- To see the **Error DNA** working, try submitting code that fails on purpose (e.g., return `[]` or `0`, or write a syntax error). The AI analyzer will detect the mistake type and update your profile!
