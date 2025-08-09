"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var client_1 = require("@prisma/client");
var auth_1 = require("./auth");
var router = express_1.default.Router();
var prisma = new client_1.PrismaClient();
// Register new user
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, phone, _b, role, passwordValidation, existingUser, passwordHash, emailVerificationToken, emailVerificationExpires, user, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, phone = _a.phone, _b = _a.role, role = _b === void 0 ? 'TOURIST' : _b;
                // Validate input
                if (!email || !password || !firstName || !lastName) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email, password, first name, and last name are required' })];
                }
                if (!(0, auth_1.validateEmail)(email)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid email format' })];
                }
                passwordValidation = (0, auth_1.validatePassword)(password);
                if (!passwordValidation.isValid) {
                    return [2 /*return*/, res.status(400).json({ error: 'Password validation failed', details: passwordValidation.errors })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(409).json({ error: 'User with this email already exists' })];
                }
                return [4 /*yield*/, (0, auth_1.hashPassword)(password)];
            case 2:
                passwordHash = _c.sent();
                emailVerificationToken = (0, auth_1.generateRandomToken)();
                emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: email,
                            passwordHash: passwordHash,
                            firstName: firstName,
                            lastName: lastName,
                            phone: phone,
                            role: role,
                            emailVerificationToken: emailVerificationToken,
                            emailVerificationExpires: emailVerificationExpires,
                            preferences: {
                                language: 'en',
                                notifications: {
                                    email: true,
                                    sms: false,
                                    push: true,
                                },
                                privacy: {
                                    profileVisible: true,
                                    showPhone: false,
                                    showEmail: false,
                                },
                            },
                        },
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            twoFactorEnabled: true,
                            bio: true,
                            avatarUrl: true,
                            preferences: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 3:
                user = _c.sent();
                // TODO: Send email verification email
                // For now, we'll just return success
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully. Please check your email to verify your account.',
                    data: {
                        user: user,
                        requiresVerification: true,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                console.error('Registration error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Login user
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, failedAttempts, updateData, accessToken, refreshToken, userData, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email and password are required' })];
                }
                console.log('Login attempt for email:', email);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    console.log('User not found:', email);
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                console.log('User found:', user.id, 'Status:', user.status);
                // Check if account is locked
                if (user.lockedUntil && user.lockedUntil > new Date()) {
                    console.log('Account locked for user:', user.id);
                    return [2 /*return*/, res.status(423).json({ error: 'Account is temporarily locked due to too many failed login attempts' })];
                }
                // Verify password
                console.log('Attempting password verification...');
                return [4 /*yield*/, (0, auth_1.comparePassword)(password, user.passwordHash)];
            case 2:
                isPasswordValid = _b.sent();
                console.log('Password verification result:', isPasswordValid);
                if (!!isPasswordValid) return [3 /*break*/, 4];
                console.log('Invalid password for user:', user.id);
                failedAttempts = user.failedLoginAttempts + 1;
                updateData = { failedLoginAttempts: failedAttempts };
                // Lock account if too many failed attempts
                if (failedAttempts >= 5) {
                    updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
                }
                return [4 /*yield*/, prisma.user.update({
                        where: { id: user.id },
                        data: updateData,
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
            case 4:
                console.log('Password verified successfully for user:', user.id);
                // Reset failed login attempts on successful login
                return [4 /*yield*/, prisma.user.update({
                        where: { id: user.id },
                        data: {
                            failedLoginAttempts: 0,
                            lockedUntil: null,
                            lastLogin: new Date(),
                            loginCount: user.loginCount + 1,
                        },
                    })];
            case 5:
                // Reset failed login attempts on successful login
                _b.sent();
                // Generate tokens
                console.log('Generating tokens...');
                accessToken = (0, auth_1.generateAccessToken)(user.id, user.email, user.role);
                refreshToken = (0, auth_1.generateRefreshToken)(user.id);
                userData = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    status: user.status,
                    emailVerified: user.emailVerified,
                    twoFactorEnabled: user.twoFactorEnabled,
                    bio: user.bio,
                    avatarUrl: user.avatarUrl,
                    preferences: user.preferences,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
                console.log('Login successful for user:', user.id);
                res.json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: userData,
                        tokens: {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                        },
                    },
                });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                console.error('Login error:', error_2);
                console.error('Error stack:', error_2.stack);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Refresh token
router.post('/refresh-token', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, decoded, user, newAccessToken, newRefreshToken, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                refreshToken = req.body.refreshToken;
                if (!refreshToken) {
                    return [2 /*return*/, res.status(400).json({ error: 'Refresh token is required' })];
                }
                decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production');
                if (!decoded) {
                    return [2 /*return*/, res.status(403).json({ error: 'Invalid refresh token' })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: decoded.userId },
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            status: true,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user || user.status !== 'ACTIVE') {
                    return [2 /*return*/, res.status(403).json({ error: 'User not found or inactive' })];
                }
                newAccessToken = (0, auth_1.generateAccessToken)(user.id, user.email, user.role);
                newRefreshToken = (0, auth_1.generateRefreshToken)(user.id);
                res.json({
                    success: true,
                    data: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Token refresh error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Logout
router.post('/logout', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // In a real application, you might want to blacklist the refresh token
            // For now, we'll just return success
            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        return [2 /*return*/];
    });
}); });
// Get current user profile
router.get('/profile', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: req.user.id },
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            twoFactorEnabled: true,
                            bio: true,
                            avatarUrl: true,
                            preferences: true,
                            lastLogin: true,
                            loginCount: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                res.json({
                    success: true,
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Get profile error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update user profile
router.put('/profile', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, phone, bio, preferences, updateData, user, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, phone = _a.phone, bio = _a.bio, preferences = _a.preferences;
                updateData = {};
                if (firstName !== undefined)
                    updateData.firstName = firstName;
                if (lastName !== undefined)
                    updateData.lastName = lastName;
                if (phone !== undefined)
                    updateData.phone = phone;
                if (bio !== undefined)
                    updateData.bio = bio;
                if (preferences !== undefined)
                    updateData.preferences = preferences;
                return [4 /*yield*/, prisma.user.update({
                        where: { id: req.user.id },
                        data: updateData,
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            twoFactorEnabled: true,
                            bio: true,
                            avatarUrl: true,
                            preferences: true,
                            lastLogin: true,
                            loginCount: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 1:
                user = _b.sent();
                res.json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: user,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                console.error('Update profile error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Change password
router.post('/change-password', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, user, isCurrentPasswordValid, passwordValidation, newPasswordHash, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                if (!currentPassword || !newPassword) {
                    return [2 /*return*/, res.status(400).json({ error: 'Current password and new password are required' })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: req.user.id },
                        select: { passwordHash: true },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                return [4 /*yield*/, (0, auth_1.comparePassword)(currentPassword, user.passwordHash)];
            case 2:
                isCurrentPasswordValid = _b.sent();
                if (!isCurrentPasswordValid) {
                    return [2 /*return*/, res.status(400).json({ error: 'Current password is incorrect' })];
                }
                passwordValidation = (0, auth_1.validatePassword)(newPassword);
                if (!passwordValidation.isValid) {
                    return [2 /*return*/, res.status(400).json({ error: 'Password validation failed', details: passwordValidation.errors })];
                }
                return [4 /*yield*/, (0, auth_1.hashPassword)(newPassword)];
            case 3:
                newPasswordHash = _b.sent();
                // Update password
                return [4 /*yield*/, prisma.user.update({
                        where: { id: req.user.id },
                        data: { passwordHash: newPasswordHash },
                    })];
            case 4:
                // Update password
                _b.sent();
                res.json({
                    success: true,
                    message: 'Password changed successfully',
                });
                return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                console.error('Change password error:', error_6);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Request password reset
router.post('/forgot-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetToken, resetExpires, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email is required' })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    // Don't reveal if user exists or not
                    return [2 /*return*/, res.json({
                            success: true,
                            message: 'If an account with this email exists, a password reset link has been sent.',
                        })];
                }
                resetToken = (0, auth_1.generateRandomToken)();
                resetExpires = new Date(Date.now() + 60 * 60 * 1000);
                return [4 /*yield*/, prisma.user.update({
                        where: { id: user.id },
                        data: {
                            resetPasswordToken: resetToken,
                            resetPasswordExpires: resetExpires,
                        },
                    })];
            case 2:
                _a.sent();
                // TODO: Send password reset email
                // For now, we'll just return success
                res.json({
                    success: true,
                    message: 'If an account with this email exists, a password reset link has been sent.',
                });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error('Forgot password error:', error_7);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Reset password
router.post('/reset-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, newPassword, user, passwordValidation, newPasswordHash, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, token = _a.token, newPassword = _a.newPassword;
                if (!token || !newPassword) {
                    return [2 /*return*/, res.status(400).json({ error: 'Token and new password are required' })];
                }
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            resetPasswordToken: token,
                            resetPasswordExpires: {
                                gt: new Date(),
                            },
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid or expired reset token' })];
                }
                passwordValidation = (0, auth_1.validatePassword)(newPassword);
                if (!passwordValidation.isValid) {
                    return [2 /*return*/, res.status(400).json({ error: 'Password validation failed', details: passwordValidation.errors })];
                }
                return [4 /*yield*/, (0, auth_1.hashPassword)(newPassword)];
            case 2:
                newPasswordHash = _b.sent();
                return [4 /*yield*/, prisma.user.update({
                        where: { id: user.id },
                        data: {
                            passwordHash: newPasswordHash,
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                        },
                    })];
            case 3:
                _b.sent();
                res.json({
                    success: true,
                    message: 'Password reset successfully',
                });
                return [3 /*break*/, 5];
            case 4:
                error_8 = _b.sent();
                console.error('Reset password error:', error_8);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Verify email
router.post('/verify-email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                token = req.body.token;
                if (!token) {
                    return [2 /*return*/, res.status(400).json({ error: 'Verification token is required' })];
                }
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            emailVerificationToken: token,
                            emailVerificationExpires: {
                                gt: new Date(),
                            },
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid or expired verification token' })];
                }
                // Mark email as verified
                return [4 /*yield*/, prisma.user.update({
                        where: { id: user.id },
                        data: {
                            emailVerified: true,
                            emailVerificationToken: null,
                            emailVerificationExpires: null,
                            status: 'ACTIVE', // Activate account if it was pending
                        },
                    })];
            case 2:
                // Mark email as verified
                _a.sent();
                res.json({
                    success: true,
                    message: 'Email verified successfully',
                });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                console.error('Email verification error:', error_9);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Admin: Get all users (admin only)
router.get('/admin/users', auth_1.authenticateToken, (0, auth_1.requireRole)(['ADMIN', 'SUPER_ADMIN']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, role, status_1, search, skip, take, where, _d, users, total, error_10;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, role = _a.role, status_1 = _a.status, search = _a.search;
                skip = (Number(page) - 1) * Number(limit);
                take = Number(limit);
                where = {};
                if (role)
                    where.role = role;
                if (status_1)
                    where.status = status_1;
                if (search) {
                    where.OR = [
                        { email: { contains: search } },
                        { firstName: { contains: search } },
                        { lastName: { contains: search } },
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        prisma.user.findMany({
                            where: where,
                            skip: skip,
                            take: take,
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                role: true,
                                status: true,
                                emailVerified: true,
                                lastLogin: true,
                                loginCount: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                            orderBy: { createdAt: 'desc' },
                        }),
                        prisma.user.count({ where: where }),
                    ])];
            case 1:
                _d = _e.sent(), users = _d[0], total = _d[1];
                res.json({
                    success: true,
                    data: {
                        users: users,
                        pagination: {
                            page: Number(page),
                            limit: Number(limit),
                            total: total,
                            pages: Math.ceil(total / Number(limit)),
                        },
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _e.sent();
                console.error('Get users error:', error_10);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
