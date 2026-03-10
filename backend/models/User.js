import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    college: { type: String },
    github: { type: String },
    resumeSkills: [{ type: String }],
    aiResumeAnalysis: { type: String },
    errorDnaProfile: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

export default mongoose.models?.User || mongoose.model('User', userSchema);
