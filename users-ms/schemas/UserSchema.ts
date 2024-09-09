const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    profilePicture: {
        type: String
    },
    bio: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    rank: {
        type: String,
        enum: ['Ukama +', 'Ukama Elite', 'Ukama VIP']
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', '+', 'elite', 'vip', 'mod', 'admin', 'founder']
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        linkedin: String
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'deactivated'],
        default: 'active'
    },
    lastLoginDate: {
        type: Date
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    securitySettings: {
        twoFactorAuth: {
            type: Boolean,
            default: false
        },
        // Other security settings can be added here
    },
    preferences: {
        language: String,
        timezone: String,
        theme: String
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
