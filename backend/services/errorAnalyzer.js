export const analyzeError = (code, language, executionResult, problemTopics) => {
    if (executionResult.status === 'Accepted') return null;

    let errorType = 'logic_error';
    let explanation = 'Your code produced incorrect output for the given test cases. Review your logic.';

    const codeLower = code.toLowerCase();

    if (executionResult.status === 'System Error') {
        errorType = 'system_error';
        explanation = executionResult.message || 'The code execution server failed to respond or is currently offline. Your code might be correct, but we could not verify it. Please try again later.';
    } else if (executionResult.status === 'Compilation Error') {
        errorType = 'syntax_error';
        explanation = 'You have a syntax or compilation error. Check for missing brackets, semicolons, or typos.\n\n' + executionResult.message;
    } else if (executionResult.status === 'Runtime Error') {
        const errorMsg = executionResult.message || '';
        if (errorMsg.includes('type')) {
            errorType = 'type_error';
            explanation = 'You are performing an operation on the wrong data type (e.g., calling an array method on a string).';
        } else if (errorMsg.includes('timeout') || errorMsg.includes('limit') || errorMsg.includes('MemoryExceeded')) {
            errorType = 'time_limit_exceeded';
            explanation = 'Your code took too long to run. You might have an infinite loop or a very slow algorithm.';
        } else if (errorMsg.includes('recursion') || errorMsg.includes('stack')) {
            errorType = 'recursion_limit';
            explanation = 'Your recursive function calls itself too many times without a base case.';
        } else {
            errorType = 'runtime_exception';
            explanation = `Your code crashed while running: ${errorMsg.split('\\n')[0]}`;
        }
    } else if (executionResult.status === 'Wrong Answer') {
        const input = typeof executionResult.failedTestCase?.input === 'string'
            ? executionResult.failedTestCase.input.trim()
            : String(executionResult.failedTestCase?.input || '');

        if (input === '""' || input === '[]' || input === '0' || input === '1') {
            errorType = 'edge_case_missing';
            explanation = 'Your code failed on small boundary inputs (like 0, 1, or empty). Ensure you have base conditions handling these cases.';
        } else if (!codeLower.includes('return') && !codeLower.includes('print') && !codeLower.includes('console.log')) {
            errorType = 'missing_output';
            explanation = 'Your function might not be returning or printing anything to stdout. Remember to output the result.';
        } else if (codeLower.includes('for') || codeLower.includes('while')) {
            errorType = 'loop_logic_error';
            explanation = 'The logic inside or around your loop produced the wrong result. Check loop boundaries (e.g. i < length vs i <= length).';
        } else if (problemTopics && problemTopics.includes('Recursion')) {
            errorType = 'recursive_logic_failure';
            explanation = 'Your recursive logic or base cases aren\'t returning the correct cumulative value.';
        } else {
            errorType = 'algorithmic_flaw';
            explanation = 'Your overall logic structure didn\'t produce the expected output for the given inputs.';
        }
    }

    return { errorType, explanation };
};
