import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    category: { type: String, enum: ['Top Interview 150', 'AI Driven 75', 'SQL 50'], default: 'AI Driven 75' },
    topics: [{ type: String }],
    testCases: [{
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false }
    }],
    starterCode: {
        javascript: String,
        python: String,
        java: String,
        cpp: String
    }
}, { timestamps: true });

export default mongoose.models?.Problem || mongoose.model('Problem', problemSchema);
