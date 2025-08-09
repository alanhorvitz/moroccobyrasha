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
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var dotenv_1 = require("dotenv");
var client_1 = require("@prisma/client");
var authRoutes_1 = require("./authRoutes");
var multer_1 = require("multer");
var path_1 = require("path");
var fs_1 = require("fs");
var url_1 = require("url");
// Load environment variables
dotenv_1.default.config();
var app = (0, express_1.default)();
var prisma = new client_1.PrismaClient();
var PORT = process.env.PORT || 3001;
// Get __dirname equivalent for ES modules
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// Create uploads directory if it doesn't exist
var uploadsDir = path_1.default.join(__dirname, '../public/uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Configure multer for file uploads
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
var upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-Token',
        'X-Device-Fingerprint',
        'X-Timestamp'
    ]
}));
app.use((0, morgan_1.default)('combined'));
// Increase body size limits for image uploads
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Mount authentication routes
app.use('/api/auth', authRoutes_1.default);
// Health check endpoint
app.get('/api/health', function (req, res) {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// File upload endpoint
app.post('/api/upload', upload.array('images', 10), function (req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        var uploadedFiles = req.files.map(function (file) { return ({
            filename: file.filename,
            originalname: file.originalname,
            path: "/uploads/".concat(file.filename),
            size: file.size,
            mimetype: file.mimetype
        }); });
        res.json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    }
    catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Error uploading files' });
    }
}, function (error, req, res, next) {
    // Handle multer errors
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files. Maximum is 10 files.' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Unexpected file field.' });
        }
    }
    if (error.message === 'Only image files are allowed') {
        return res.status(400).json({ error: 'Only image files are allowed.' });
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading files' });
});
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Regions API routes
app.get('/api/regions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var regions, error_1, mockRegions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Attempting to fetch regions...');
                return [4 /*yield*/, prisma.region.findMany()];
            case 1:
                regions = _a.sent();
                console.log("Found ".concat(regions.length, " regions"));
                res.json(regions);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching regions:', error_1);
                console.error('Detailed error:', error_1.message);
                mockRegions = [
                    {
                        id: 'region-1',
                        name_en: 'Marrakech-Safi',
                        name_ar: 'مراكش آسفي',
                        name_fr: 'Marrakech-Safi',
                        name_it: 'Marrakech-Safi',
                        name_es: 'Marrakech-Safi',
                        description_en: 'Historic region known for the imperial city of Marrakech',
                        latitude: 31.6295,
                        longitude: -7.9811,
                        imageUrls: '[]',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        id: 'region-2',
                        name_en: 'Casablanca-Settat',
                        name_ar: 'الدار البيضاء سطات',
                        name_fr: 'Casablanca-Settat',
                        name_it: 'Casablanca-Settat',
                        name_es: 'Casablanca-Settat',
                        description_en: 'Economic hub and largest city of Morocco',
                        latitude: 33.5731,
                        longitude: -7.5898,
                        imageUrls: '[]',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ];
                console.log('Returning mock regions data');
                res.json(mockRegions);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// NEW: Get region by id
app.get('/api/regions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var region, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.region.findUnique({ where: { id: req.params.id } })];
            case 1:
                region = _a.sent();
                if (!region)
                    return [2 /*return*/, res.status(404).json({ error: 'Not found' })];
                res.json(region);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching region:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/regions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_en, name_ar, name_fr, name_it, name_es, description_en, description_ar, description_fr, description_it, description_es, climate_en, climate_ar, climate_fr, climate_it, climate_es, bestTimeToVisit_en, bestTimeToVisit_ar, bestTimeToVisit_fr, bestTimeToVisit_it, bestTimeToVisit_es, keyFacts_en, keyFacts_ar, keyFacts_fr, keyFacts_it, keyFacts_es, latitude, longitude, imageUrls, region, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_en = _a.name_en, name_ar = _a.name_ar, name_fr = _a.name_fr, name_it = _a.name_it, name_es = _a.name_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, climate_en = _a.climate_en, climate_ar = _a.climate_ar, climate_fr = _a.climate_fr, climate_it = _a.climate_it, climate_es = _a.climate_es, bestTimeToVisit_en = _a.bestTimeToVisit_en, bestTimeToVisit_ar = _a.bestTimeToVisit_ar, bestTimeToVisit_fr = _a.bestTimeToVisit_fr, bestTimeToVisit_it = _a.bestTimeToVisit_it, bestTimeToVisit_es = _a.bestTimeToVisit_es, keyFacts_en = _a.keyFacts_en, keyFacts_ar = _a.keyFacts_ar, keyFacts_fr = _a.keyFacts_fr, keyFacts_it = _a.keyFacts_it, keyFacts_es = _a.keyFacts_es, latitude = _a.latitude, longitude = _a.longitude, imageUrls = _a.imageUrls;
                return [4 /*yield*/, prisma.region.create({
                        data: {
                            name_en: name_en,
                            name_ar: name_ar,
                            name_fr: name_fr,
                            name_it: name_it,
                            name_es: name_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            climate_en: climate_en,
                            climate_ar: climate_ar,
                            climate_fr: climate_fr,
                            climate_it: climate_it,
                            climate_es: climate_es,
                            bestTimeToVisit_en: bestTimeToVisit_en,
                            bestTimeToVisit_ar: bestTimeToVisit_ar,
                            bestTimeToVisit_fr: bestTimeToVisit_fr,
                            bestTimeToVisit_it: bestTimeToVisit_it,
                            bestTimeToVisit_es: bestTimeToVisit_es,
                            keyFacts_en: keyFacts_en,
                            keyFacts_ar: keyFacts_ar,
                            keyFacts_fr: keyFacts_fr,
                            keyFacts_it: keyFacts_it,
                            keyFacts_es: keyFacts_es,
                            latitude: latitude,
                            longitude: longitude,
                            imageUrls: imageUrls,
                        },
                    })];
            case 1:
                region = _b.sent();
                res.status(201).json(region);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error creating region:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT (update) region
app.put('/api/regions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var region, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.region.update({ where: { id: req.params.id }, data: req.body })];
            case 1:
                region = _a.sent();
                res.json(region);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE region
app.delete('/api/regions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.region.delete({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Attractions API routes
app.get('/api/attractions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var attractions, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.attraction.findMany()];
            case 1:
                attractions = _a.sent();
                res.json(attractions);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching attractions:', error_6);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// NEW: Get attraction by id
app.get('/api/attractions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var attraction, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.attraction.findUnique({ where: { id: req.params.id } })];
            case 1:
                attraction = _a.sent();
                if (!attraction)
                    return [2 /*return*/, res.status(404).json({ error: 'Not found' })];
                res.json(attraction);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching attraction:', error_7);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/attractions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_en, name_ar, name_fr, name_it, name_es, description_en, description_ar, description_fr, description_it, description_es, category_en, category_ar, category_fr, category_it, category_es, regionId, latitude, longitude, imageUrls, rating, tags, entryFee, currency, openingHours, attraction, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_en = _a.name_en, name_ar = _a.name_ar, name_fr = _a.name_fr, name_it = _a.name_it, name_es = _a.name_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, category_en = _a.category_en, category_ar = _a.category_ar, category_fr = _a.category_fr, category_it = _a.category_it, category_es = _a.category_es, regionId = _a.regionId, latitude = _a.latitude, longitude = _a.longitude, imageUrls = _a.imageUrls, rating = _a.rating, tags = _a.tags, entryFee = _a.entryFee, currency = _a.currency, openingHours = _a.openingHours;
                return [4 /*yield*/, prisma.attraction.create({
                        data: {
                            name_en: name_en,
                            name_ar: name_ar,
                            name_fr: name_fr,
                            name_it: name_it,
                            name_es: name_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            category_en: category_en,
                            category_ar: category_ar,
                            category_fr: category_fr,
                            category_it: category_it,
                            category_es: category_es,
                            regionId: regionId,
                            latitude: latitude,
                            longitude: longitude,
                            imageUrls: imageUrls,
                            rating: rating,
                            tags: tags,
                            entryFee: entryFee,
                            currency: currency,
                            openingHours: openingHours,
                        },
                    })];
            case 1:
                attraction = _b.sent();
                res.status(201).json(attraction);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error('Error creating attraction:', error_8);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT (update) attraction
app.put('/api/attractions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var attraction, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.attraction.update({ where: { id: req.params.id }, data: req.body })];
            case 1:
                attraction = _a.sent();
                res.json(attraction);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE attraction
app.delete('/api/attractions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.attraction.delete({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Tour Packages API routes
app.get('/api/tour-packages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tourPackages, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.tourPackage.findMany()];
            case 1:
                tourPackages = _a.sent();
                res.json(tourPackages);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Error fetching tour packages:', error_11);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// NEW: Get tour package by id
app.get('/api/tour-packages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tourPackage, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.tourPackage.findUnique({ where: { id: req.params.id } })];
            case 1:
                tourPackage = _a.sent();
                if (!tourPackage)
                    return [2 /*return*/, res.status(404).json({ error: 'Not found' })];
                res.json(tourPackage);
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.error('Error fetching tour package:', error_12);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/tour-packages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title_en, title_ar, title_fr, title_it, title_es, description_en, description_ar, description_fr, description_it, description_es, difficulty_en, difficulty_ar, difficulty_fr, difficulty_it, difficulty_es, duration, price, currency, imageUrls, included, excluded, regionId, tourPackage, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title_en = _a.title_en, title_ar = _a.title_ar, title_fr = _a.title_fr, title_it = _a.title_it, title_es = _a.title_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, difficulty_en = _a.difficulty_en, difficulty_ar = _a.difficulty_ar, difficulty_fr = _a.difficulty_fr, difficulty_it = _a.difficulty_it, difficulty_es = _a.difficulty_es, duration = _a.duration, price = _a.price, currency = _a.currency, imageUrls = _a.imageUrls, included = _a.included, excluded = _a.excluded, regionId = _a.regionId;
                return [4 /*yield*/, prisma.tourPackage.create({
                        data: {
                            title_en: title_en,
                            title_ar: title_ar,
                            title_fr: title_fr,
                            title_it: title_it,
                            title_es: title_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            difficulty_en: difficulty_en,
                            difficulty_ar: difficulty_ar,
                            difficulty_fr: difficulty_fr,
                            difficulty_it: difficulty_it,
                            difficulty_es: difficulty_es,
                            duration: duration,
                            price: price,
                            currency: currency,
                            imageUrls: imageUrls,
                            included: included,
                            excluded: excluded,
                            regionId: regionId,
                        },
                    })];
            case 1:
                tourPackage = _b.sent();
                res.status(201).json(tourPackage);
                return [3 /*break*/, 3];
            case 2:
                error_13 = _b.sent();
                console.error('Error creating tour package:', error_13);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Guides API routes
app.get('/api/guides', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var guides, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.guide.findMany()];
            case 1:
                guides = _a.sent();
                res.json(guides);
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.error('Error fetching guides:', error_14);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/guides', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_en, name_ar, name_fr, name_it, name_es, description_en, description_ar, description_fr, description_it, description_es, languages, specialties, certifications, yearsOfExperience, imageUrls, hourlyRate, currency, email, phone, website, availability, guide, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_en = _a.name_en, name_ar = _a.name_ar, name_fr = _a.name_fr, name_it = _a.name_it, name_es = _a.name_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, languages = _a.languages, specialties = _a.specialties, certifications = _a.certifications, yearsOfExperience = _a.yearsOfExperience, imageUrls = _a.imageUrls, hourlyRate = _a.hourlyRate, currency = _a.currency, email = _a.email, phone = _a.phone, website = _a.website, availability = _a.availability;
                return [4 /*yield*/, prisma.guide.create({
                        data: {
                            name_en: name_en,
                            name_ar: name_ar,
                            name_fr: name_fr,
                            name_it: name_it,
                            name_es: name_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            languages: languages,
                            specialties: specialties,
                            certifications: certifications,
                            yearsOfExperience: yearsOfExperience,
                            imageUrls: imageUrls,
                            hourlyRate: hourlyRate,
                            currency: currency,
                            email: email,
                            phone: phone,
                            website: website,
                            availability: availability,
                        },
                    })];
            case 1:
                guide = _b.sent();
                res.status(201).json(guide);
                return [3 /*break*/, 3];
            case 2:
                error_15 = _b.sent();
                console.error('Error creating guide:', error_15);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Media Items API routes
app.get('/api/media', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mediaItems, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.mediaItem.findMany()];
            case 1:
                mediaItems = _a.sent();
                res.json(mediaItems);
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.error('Error fetching media items:', error_16);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/media', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title_en, title_ar, title_fr, title_it, title_es, description_en, description_ar, description_fr, description_it, description_es, type, url, thumbnailUrl, tags, regionId, categoryId, photographer, latitude, longitude, isFeatured, mediaItem, error_17;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title_en = _a.title_en, title_ar = _a.title_ar, title_fr = _a.title_fr, title_it = _a.title_it, title_es = _a.title_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, type = _a.type, url = _a.url, thumbnailUrl = _a.thumbnailUrl, tags = _a.tags, regionId = _a.regionId, categoryId = _a.categoryId, photographer = _a.photographer, latitude = _a.latitude, longitude = _a.longitude, isFeatured = _a.isFeatured;
                return [4 /*yield*/, prisma.mediaItem.create({
                        data: {
                            title_en: title_en,
                            title_ar: title_ar,
                            title_fr: title_fr,
                            title_it: title_it,
                            title_es: title_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            type: type,
                            url: url,
                            thumbnailUrl: thumbnailUrl,
                            tags: tags,
                            regionId: regionId,
                            categoryId: categoryId,
                            photographer: photographer,
                            latitude: latitude,
                            longitude: longitude,
                            isFeatured: isFeatured,
                        },
                    })];
            case 1:
                mediaItem = _b.sent();
                res.status(201).json(mediaItem);
                return [3 /*break*/, 3];
            case 2:
                error_17 = _b.sent();
                console.error('Error creating media item:', error_17);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Content Items API routes
app.get('/api/content', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contentItems, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.contentItem.findMany()];
            case 1:
                contentItems = _a.sent();
                res.json(contentItems);
                return [3 /*break*/, 3];
            case 2:
                error_18 = _a.sent();
                console.error('Error fetching content items:', error_18);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/content', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title_en, title_ar, title_fr, title_it, title_es, description_en, description_ar, description_fr, description_it, description_es, content_en, content_ar, content_fr, content_it, content_es, type, tags, authorId, mediaIds, regionId, categoryId, readTime, isFeatured, contentItem, error_19;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title_en = _a.title_en, title_ar = _a.title_ar, title_fr = _a.title_fr, title_it = _a.title_it, title_es = _a.title_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, content_en = _a.content_en, content_ar = _a.content_ar, content_fr = _a.content_fr, content_it = _a.content_it, content_es = _a.content_es, type = _a.type, tags = _a.tags, authorId = _a.authorId, mediaIds = _a.mediaIds, regionId = _a.regionId, categoryId = _a.categoryId, readTime = _a.readTime, isFeatured = _a.isFeatured;
                return [4 /*yield*/, prisma.contentItem.create({
                        data: {
                            title_en: title_en,
                            title_ar: title_ar,
                            title_fr: title_fr,
                            title_it: title_it,
                            title_es: title_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            content_en: content_en,
                            content_ar: content_ar,
                            content_fr: content_fr,
                            content_it: content_it,
                            content_es: content_es,
                            type: type,
                            tags: tags,
                            authorId: authorId,
                            mediaIds: mediaIds,
                            regionId: regionId,
                            categoryId: categoryId,
                            readTime: readTime,
                            isFeatured: isFeatured,
                        },
                    })];
            case 1:
                contentItem = _b.sent();
                res.status(201).json(contentItem);
                return [3 /*break*/, 3];
            case 2:
                error_19 = _b.sent();
                console.error('Error creating content item:', error_19);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Transport Services API routes
app.get('/api/transport', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transportServices, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.transportService.findMany()];
            case 1:
                transportServices = _a.sent();
                res.json(transportServices);
                return [3 /*break*/, 3];
            case 2:
                error_20 = _a.sent();
                console.error('Error fetching transport services:', error_20);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/transport', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_en, name_ar, name_fr, name_it, name_es, description_en, description_ar, description_fr, description_it, description_es, type, type_en, type_ar, type_fr, type_it, type_es, airportTransfer, imageUrls, email, phone, website, serviceArea, transportService, error_21;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_en = _a.name_en, name_ar = _a.name_ar, name_fr = _a.name_fr, name_it = _a.name_it, name_es = _a.name_es, description_en = _a.description_en, description_ar = _a.description_ar, description_fr = _a.description_fr, description_it = _a.description_it, description_es = _a.description_es, type = _a.type, type_en = _a.type_en, type_ar = _a.type_ar, type_fr = _a.type_fr, type_it = _a.type_it, type_es = _a.type_es, airportTransfer = _a.airportTransfer, imageUrls = _a.imageUrls, email = _a.email, phone = _a.phone, website = _a.website, serviceArea = _a.serviceArea;
                return [4 /*yield*/, prisma.transportService.create({
                        data: {
                            name_en: name_en,
                            name_ar: name_ar,
                            name_fr: name_fr,
                            name_it: name_it,
                            name_es: name_es,
                            description_en: description_en,
                            description_ar: description_ar,
                            description_fr: description_fr,
                            description_it: description_it,
                            description_es: description_es,
                            type: type,
                            type_en: type_en,
                            type_ar: type_ar,
                            type_fr: type_fr,
                            type_it: type_it,
                            type_es: type_es,
                            airportTransfer: airportTransfer,
                            imageUrls: imageUrls,
                            email: email,
                            phone: phone,
                            website: website,
                            serviceArea: serviceArea,
                        },
                    })];
            case 1:
                transportService = _b.sent();
                res.status(201).json(transportService);
                return [3 /*break*/, 3];
            case 2:
                error_21 = _b.sent();
                console.error('Error creating transport service:', error_21);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Reviews API routes
app.get('/api/reviews', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reviews, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.review.findMany()];
            case 1:
                reviews = _a.sent();
                res.json(reviews);
                return [3 /*break*/, 3];
            case 2:
                error_22 = _a.sent();
                console.error('Error fetching reviews:', error_22);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/reviews', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, itemId, itemType, rating, title, comment, helpfulVotes, verifiedUser, verifiedPurchase, review, error_23;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, itemId = _a.itemId, itemType = _a.itemType, rating = _a.rating, title = _a.title, comment = _a.comment, helpfulVotes = _a.helpfulVotes, verifiedUser = _a.verifiedUser, verifiedPurchase = _a.verifiedPurchase;
                return [4 /*yield*/, prisma.review.create({
                        data: {
                            userId: userId,
                            itemId: itemId,
                            itemType: itemType,
                            rating: rating,
                            title: title,
                            comment: comment,
                            helpfulVotes: helpfulVotes,
                            verifiedUser: verifiedUser,
                            verifiedPurchase: verifiedPurchase,
                        },
                    })];
            case 1:
                review = _b.sent();
                res.status(201).json(review);
                return [3 /*break*/, 3];
            case 2:
                error_23 = _b.sent();
                console.error('Error creating review:', error_23);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Festivals API routes
app.get('/api/festivals', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var festivals, error_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.festival.findMany()];
            case 1:
                festivals = _a.sent();
                res.json(festivals);
                return [3 /*break*/, 3];
            case 2:
                error_24 = _a.sent();
                console.error('Error fetching festivals:', error_24);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/festivals', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, description, type, location_1, regionId, timeOfYear, duration, images, videoUrl, established, historicalSignificance, festival, error_25;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, description = _a.description, type = _a.type, location_1 = _a.location, regionId = _a.regionId, timeOfYear = _a.timeOfYear, duration = _a.duration, images = _a.images, videoUrl = _a.videoUrl, established = _a.established, historicalSignificance = _a.historicalSignificance;
                return [4 /*yield*/, prisma.festival.create({
                        data: {
                            name: name_1,
                            description: description,
                            type: type,
                            location: location_1,
                            regionId: regionId,
                            timeOfYear: timeOfYear,
                            duration: duration,
                            images: images,
                            videoUrl: videoUrl,
                            established: established,
                            historicalSignificance: historicalSignificance,
                        },
                    })];
            case 1:
                festival = _b.sent();
                res.status(201).json(festival);
                return [3 /*break*/, 3];
            case 2:
                error_25 = _b.sent();
                console.error('Error creating festival:', error_25);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT (update) festival
app.put('/api/festivals/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var festival, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.festival.update({ where: { id: req.params.id }, data: req.body })];
            case 1:
                festival = _a.sent();
                res.json(festival);
                return [3 /*break*/, 3];
            case 2:
                error_26 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE festival
app.delete('/api/festivals/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.festival.delete({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_27 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Cuisine API routes
app.get('/api/cuisines', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cuisines, error_28;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.cuisine.findMany()];
            case 1:
                cuisines = _a.sent();
                res.json(cuisines);
                return [3 /*break*/, 3];
            case 2:
                error_28 = _a.sent();
                console.error('Error fetching cuisines:', error_28);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/cuisines', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, description, type, regionIds, ingredients, spiceLevel, images, videoUrl, popularVariants, cuisine, error_29;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_2 = _a.name, description = _a.description, type = _a.type, regionIds = _a.regionIds, ingredients = _a.ingredients, spiceLevel = _a.spiceLevel, images = _a.images, videoUrl = _a.videoUrl, popularVariants = _a.popularVariants;
                return [4 /*yield*/, prisma.cuisine.create({
                        data: {
                            name: name_2,
                            description: description,
                            type: type,
                            regionIds: regionIds,
                            ingredients: ingredients,
                            spiceLevel: spiceLevel,
                            images: images,
                            videoUrl: videoUrl,
                            popularVariants: popularVariants,
                        },
                    })];
            case 1:
                cuisine = _b.sent();
                res.status(201).json(cuisine);
                return [3 /*break*/, 3];
            case 2:
                error_29 = _b.sent();
                console.error('Error creating cuisine:', error_29);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT (update) cuisine
app.put('/api/cuisines/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cuisine, error_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.cuisine.update({ where: { id: req.params.id }, data: req.body })];
            case 1:
                cuisine = _a.sent();
                res.json(cuisine);
                return [3 /*break*/, 3];
            case 2:
                error_30 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE cuisine
app.delete('/api/cuisines/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.cuisine.delete({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_31 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Heritage API routes
app.get('/api/heritages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var heritages, error_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.heritage.findMany()];
            case 1:
                heritages = _a.sent();
                res.json(heritages);
                return [3 /*break*/, 3];
            case 2:
                error_32 = _a.sent();
                console.error('Error fetching heritages:', error_32);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/heritages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var heritage, error_33;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.heritage.findUnique({ where: { id: req.params.id } })];
            case 1:
                heritage = _a.sent();
                if (!heritage)
                    return [2 /*return*/, res.status(404).json({ error: 'Not found' })];
                res.json(heritage);
                return [3 /*break*/, 3];
            case 2:
                error_33 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/heritages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var heritage, error_34;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.heritage.create({ data: req.body })];
            case 1:
                heritage = _a.sent();
                res.status(201).json(heritage);
                return [3 /*break*/, 3];
            case 2:
                error_34 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/heritages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var heritage, error_35;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.heritage.update({ where: { id: req.params.id }, data: req.body })];
            case 1:
                heritage = _a.sent();
                res.json(heritage);
                return [3 /*break*/, 3];
            case 2:
                error_35 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/heritages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_36;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.heritage.delete({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_36 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Clothing API routes
app.get('/api/clothing', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clothing, error_37;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.clothing.findMany()];
            case 1:
                clothing = _a.sent();
                res.json(clothing);
                return [3 /*break*/, 3];
            case 2:
                error_37 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/clothing/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clothing, error_38;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.clothing.findUnique({ where: { id: req.params.id } })];
            case 1:
                clothing = _a.sent();
                if (!clothing)
                    return [2 /*return*/, res.status(404).json({ error: 'Not found' })];
                res.json(clothing);
                return [3 /*break*/, 3];
            case 2:
                error_38 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/clothing', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clothing, error_39;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.clothing.create({ data: req.body })];
            case 1:
                clothing = _a.sent();
                res.status(201).json(clothing);
                return [3 /*break*/, 3];
            case 2:
                error_39 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/clothing/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clothing, error_40;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.clothing.update({ where: { id: req.params.id }, data: req.body })];
            case 1:
                clothing = _a.sent();
                res.json(clothing);
                return [3 /*break*/, 3];
            case 2:
                error_40 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/clothing/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_41;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.clothing.delete({ where: { id: req.params.id } })];
            case 1:
                _a.sent();
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_41 = _a.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Travel Guides API routes
app.get('/api/travel-guides', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var guides, error_42;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.travelGuide.findMany()];
            case 1:
                guides = _a.sent();
                res.json(guides);
                return [3 /*break*/, 3];
            case 2:
                error_42 = _a.sent();
                console.error('Error fetching travel guides:', error_42);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/travel-guides/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var guide, error_43;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.travelGuide.findUnique({ where: { id: req.params.id } })];
            case 1:
                guide = _a.sent();
                if (!guide)
                    return [2 /*return*/, res.status(404).json({ error: 'Not found' })];
                res.json(guide);
                return [3 /*break*/, 3];
            case 2:
                error_43 = _a.sent();
                console.error('Error fetching travel guide:', error_43);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/travel-guides', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var guide, error_44;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.travelGuide.create({ data: req.body })];
            case 1:
                guide = _a.sent();
                res.status(201).json(guide);
                return [3 /*break*/, 3];
            case 2:
                error_44 = _a.sent();
                console.error('Error creating travel guide:', error_44);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// 404 handler
app.use('*', function (req, res) {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Morocco by Rasha API Server running on http://localhost:".concat(PORT));
    console.log("\uD83D\uDCCA Health check: http://localhost:".concat(PORT, "/api/health"));
    console.log("\uD83D\uDDFA\uFE0F  Regions: http://localhost:".concat(PORT, "/api/regions"));
    console.log("\uD83C\uDFDB\uFE0F  Attractions: http://localhost:".concat(PORT, "/api/attractions"));
    console.log("\uD83C\uDF92 Tour Packages: http://localhost:".concat(PORT, "/api/tour-packages"));
    console.log("\uD83D\uDC68\u200D\uD83D\uDCBC Guides: http://localhost:".concat(PORT, "/api/guides"));
    console.log("\uD83D\uDCF8 Media: http://localhost:".concat(PORT, "/api/media"));
    console.log("\uD83D\uDCDD Content: http://localhost:".concat(PORT, "/api/content"));
    console.log("\uD83D\uDE97 Transport: http://localhost:".concat(PORT, "/api/transport"));
    console.log("\u2B50 Reviews: http://localhost:".concat(PORT, "/api/reviews"));
    console.log("\uD83C\uDF89 Festivals: http://localhost:".concat(PORT, "/api/festivals"));
    console.log("\uD83C\uDF7D\uFE0F  Cuisines: http://localhost:".concat(PORT, "/api/cuisines"));
    console.log("\uD83C\uDFFA Heritage: http://localhost:".concat(PORT, "/api/heritages"));
    console.log("\uD83D\uDC55 Clothing: http://localhost:".concat(PORT, "/api/clothing"));
    console.log("\uD83D\uDC68\u200D\uD83D\uDCBC Travel Guides: http://localhost:".concat(PORT, "/api/travel-guides"));
});
// Graceful shutdown
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('SIGTERM received, shutting down gracefully');
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('SIGINT received, shutting down gracefully');
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
