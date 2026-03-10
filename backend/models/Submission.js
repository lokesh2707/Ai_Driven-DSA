import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: { type: String, required: true, default: 'anonymous_user' },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    mockId: { type: String },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'System Error'], required: true },
    runtime: { type: Number },
    memoryUsage: { type: Number },
    failedTestCase: {
        input: String,
        expectedOutput: String,
        actualOutput: String
    },
    errorDetails: {
        errorType: String,
        explanation: String,
        message: String
    }
}, { timestamps: true });

export default mongoose.models?.Submission || mongoose.model('Submission', submissionSchema);
