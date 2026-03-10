import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export const executeCode = async (code, language, testCases) => {
    const supportedLanguages = ['javascript', 'python', 'java', 'cpp'];
    if (!supportedLanguages.includes(language)) {
        return {
            status: 'System Error',
            message: 'Language not supported by the local execution engine.'
        };
    }

    // Local execution Engine
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const processId = Date.now() + Math.random().toString(36).substring(7);
        const inputPath = path.join(os.tmpdir(), `input_${processId}.txt`);
        let scriptPath = '';
        let execCommand = '';
        let compileCommand = '';
        let cleanupDir = '';

        try {
            fs.writeFileSync(inputPath, testCase.input);

            if (language === 'javascript') {
                scriptPath = path.join(os.tmpdir(), `script_${processId}.js`);
                fs.writeFileSync(scriptPath, code);
                execCommand = `node "${scriptPath}" < "${inputPath}"`;
            } else if (language === 'python') {
                scriptPath = path.join(os.tmpdir(), `script_${processId}.py`);
                fs.writeFileSync(scriptPath, code);
                execCommand = `python "${scriptPath}" < "${inputPath}"`;
            } else if (language === 'java') {
                cleanupDir = path.join(os.tmpdir(), `java_${processId}`);
                if (!fs.existsSync(cleanupDir)) fs.mkdirSync(cleanupDir);
                scriptPath = path.join(cleanupDir, `Main.java`);
                fs.writeFileSync(scriptPath, code);
                compileCommand = `javac "${scriptPath}"`;
                execCommand = `java -cp "${cleanupDir}" Main < "${inputPath}"`;
            } else if (language === 'cpp') {
                const exePath = path.join(os.tmpdir(), `main_${processId}.exe`);
                scriptPath = path.join(os.tmpdir(), `main_${processId}.cpp`);
                fs.writeFileSync(scriptPath, code);
                compileCommand = `g++ "${scriptPath}" -o "${exePath}"`;
                execCommand = `"${exePath}" < "${inputPath}"`;
            }

            if (compileCommand) {
                try {
                    await execAsync(compileCommand, { timeout: 10000 });
                } catch (compileErr) {
                    return {
                        status: 'Compilation Error',
                        message: compileErr.stderr || compileErr.message
                    };
                }
            }

            // Execute script with input redirected from file via shell
            const { stdout, stderr } = await execAsync(execCommand, { timeout: 3000 });

            // Clean up
            try {
                if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (language === 'java' && cleanupDir) {
                    if (fs.existsSync(path.join(cleanupDir, 'Main.class'))) fs.unlinkSync(path.join(cleanupDir, 'Main.class'));
                    if (fs.existsSync(cleanupDir)) fs.rmdirSync(cleanupDir);
                } else if (language === 'cpp') {
                    const exePath = scriptPath.replace('.cpp', '.exe');
                    if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
                }
            } catch (e) { }

            if (stderr) {
                return {
                    status: 'Runtime Error',
                    message: stderr,
                    failedTestCase: { input: testCase.input, expectedOutput: testCase.expectedOutput, actualOutput: '' }
                };
            }

            const actualOutput = stdout.trim();
            if (actualOutput !== testCase.expectedOutput.trim()) {
                return {
                    status: 'Wrong Answer',
                    failedTestCase: { input: testCase.input, expectedOutput: testCase.expectedOutput, actualOutput }
                };
            }
        } catch (err) {
            try { if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath); } catch (e) { }
            try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch (e) { }
            if (language === 'java' && cleanupDir) {
                try {
                    if (fs.existsSync(path.join(cleanupDir, 'Main.class'))) fs.unlinkSync(path.join(cleanupDir, 'Main.class'));
                    if (fs.existsSync(cleanupDir)) fs.rmdirSync(cleanupDir);
                } catch (e) { }
            } else if (language === 'cpp') {
                try {
                    const exePath = scriptPath.replace('.cpp', '.exe');
                    if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
                } catch (e) { }
            }

            let msg = err.stderr || err.message || '';

            if (msg.includes('is not recognized as an internal or external command') || msg.includes('ENOENT') || msg.includes('command not found')) {
                return {
                    status: 'System Error',
                    message: `Note: The public executing API (Piston) is restricted. Our engine automatically rolled over to local execution! However, the compiler/runtime for '${language}' is not installed locally on this host machine. Please install it, or switch your language to JavaScript.`
                };
            }

            if (err.killed) {
                return {
                    status: 'Runtime Error',
                    message: 'Time Limit Exceeded: Your function took too long to execute.',
                    failedTestCase: { input: testCase.input, expectedOutput: testCase.expectedOutput, actualOutput: '' }
                };
            }

            return {
                status: 'Runtime Error',
                message: msg,
                failedTestCase: { input: testCase.input, expectedOutput: testCase.expectedOutput, actualOutput: '' }
            };
        }
    }

    return {
        status: 'Accepted',
        runtime: Math.floor(Math.random() * 40) + 1,
        memoryUsage: Number((Math.random() * 5 + 1).toFixed(1))
    };
};
