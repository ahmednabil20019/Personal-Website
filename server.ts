import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

export function createApiServer() {
    return app;
}

    // Serve locally-stored CV files (PDFs stored on disk to avoid Cloudinary access restrictions)
    const CV_UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'cv');
    if (!fs.existsSync(CV_UPLOADS_DIR)) fs.mkdirSync(CV_UPLOADS_DIR, { recursive: true });
    app.use('/cv-files', express.static(CV_UPLOADS_DIR));

    // Request Logging Middleware
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });

    // --- MongoDB Config ---
    let isConnected = false;
    const connectDB = async () => {
        if (isConnected || !process.env.MONGO_URI) return;
        try {
            await mongoose.connect(process.env.MONGO_URI);
            isConnected = true;
            console.log('MongoDB connected');
        } catch (err) {
            console.error('MongoDB connection error:', err);
        }
    };

    // --- Schemas & Models ---
    const ProjectSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [String],
        videos: [String],
        technologies: [String],
        category: { type: String, required: true },
        liveUrl: String,
        githubUrl: String,
        featured: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

    const CertificationSchema = new mongoose.Schema({
        title: { type: String, required: true },
        issuer: String,
        category: String,
        date: String,
        startDate: String,
        endDate: String,
        courseHours: String,
        credentialId: String,
        verificationUrl: String,
        image: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const Certification = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);

    const SkillSchema = new mongoose.Schema({
        name: String,
        icon: String,
        category: String,
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
        projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
        certIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }]
    });
    const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

    const AboutSchema = new mongoose.Schema({
        name: { type: String, default: "Your Name" },
        title: { type: String, default: "Full-Stack Developer" },
        location: { type: String, default: "Your Location" },
        content: String,
        avatar: String,
        mission: { type: String, default: "Building scalable products that blend technical excellence with intuitive design." },
        stats: [{ label: String, value: String }],
        passions: [{ icon: String, label: String }],
        tags: [String],
        ctaTitle: { type: String, default: "Let's Build Something Amazing" },
        ctaSubtitle: { type: String, default: "Open to collaborations and new opportunities." }
    });
    const About = mongoose.models.About || mongoose.model('About', AboutSchema);

    const ServiceSchema = new mongoose.Schema({
        title: String,
        description: String,
        icon: String,
        highlight: String,
        features: [String],
        stats: [{ label: String, value: String }]
    });
    const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

    const HeroSchema = new mongoose.Schema({
        greeting: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        description: { type: String, required: true },
        resumeUrl: String,
        socialLinks: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);

    const JourneySchema = new mongoose.Schema({
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        year: String,
        period: String,
        description: String,
        achievements: [String],
        technologies: [String],
        type: { type: String, enum: ['work', 'education', 'project'], default: 'work' },
        icon: { type: String, default: 'Briefcase' },
        color: { type: String, default: '#06b6d4' },
        order: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const Journey = mongoose.models.Journey || mongoose.model('Journey', JourneySchema);

    const ContactSchema = new mongoose.Schema({
        email: { type: String, required: true },
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        twitter: String,
        instagram: String,
        facebook: String,
        whatsapp: String,
        messenger: String,
        hiddenSocials: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

    const CVSchema = new mongoose.Schema({
        url: String,
        filename: String,
    }, { timestamps: true });
    const CV = mongoose.models.CV || mongoose.model('CV', CVSchema);

    const CategorySchema = new mongoose.Schema({
        name: { type: String, required: true },
        type: { type: String, enum: ['skill', 'project', 'service'], required: true },
        description: { type: String },
        color: { type: String, default: '#3b82f6' },
        icon: { type: String, default: 'Folder' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

    // Contact Messages (form submissions)
    const ContactMessageSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        replied: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    });
    const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);

    // --- Seed Logic ---
    let isSeeding = false;
    const seedDatabase = async () => {
        if (isSeeding) return;
        isSeeding = true;
        try {
            const existingHero = await Hero.findOne();
            if (!existingHero) {
                await Hero.create({
                    greeting: "Hello, I'm",
                    title: "John Doe",
                    subtitle: "Creative Developer",
                    description: "I build immersive web experiences with modern technologies.",
                    resumeUrl: "/resume.pdf",
                    socialLinks: true
                });
                console.log('✅ Created default Hero data');
            }

            const defaultCategories = [
                { name: 'Frontend', type: 'skill', description: 'Frontend technologies', color: '#3b82f6', icon: 'Monitor' },
                { name: 'Backend', type: 'skill', description: 'Backend technologies', color: '#10b981', icon: 'Server' },
                { name: 'Mobile', type: 'skill', description: 'Mobile development', color: '#8b5cf6', icon: 'Smartphone' },
                { name: 'Tools', type: 'skill', description: 'DevOps & Tools', color: '#f59e0b', icon: 'Wrench' }
            ];
            for (const cat of defaultCategories) {
                const existing = await Category.findOne({ name: cat.name, type: cat.type });
                if (!existing) await Category.create(cat);
            }
        } catch (error) {
            console.error('Error seeding data:', error);
        }
    };

    // DB Initialization Middleware
    app.use(async (req, res, next) => {
        await connectDB();
        await seedDatabase();
        next();
    });

    // --- API Routes ---

    // Projects
    app.get('/projects', async (req: Request, res: Response) => {
        try {
            const projects = await Project.find().sort({ order: 1, createdAt: -1 });
            res.status(200).json({ success: true, data: projects });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/projects', async (req: Request, res: Response) => {
        try {
            const count = await Project.countDocuments();
            const project = await Project.create({ ...req.body, order: count });
            res.status(201).json({ success: true, data: project });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/projects/reorder', async (req: Request, res: Response) => {
        try {
            const { items } = req.body; // Array of { id, order }
            if (!items || !Array.isArray(items)) {
                return res.status(400).json({ success: false, error: 'Items array required' });
            }

            const bulkOps = items.map((item: { id: string; order: number }) => ({
                updateOne: {
                    filter: { _id: item.id },
                    update: { $set: { order: item.order } }
                }
            }));

            await Project.bulkWrite(bulkOps);
            res.status(200).json({ success: true, message: 'Order updated' });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.put('/projects', async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ success: false, error: 'ID required' });
            const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({ success: true, data: project });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.delete('/projects', async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            await Project.findByIdAndDelete(id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // Certifications
    app.get('/certifications', async (req: Request, res: Response) => {
        try {
            const certs = await Certification.find().sort({ date: -1 });
            res.status(200).json({ success: true, data: certs });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/certifications', async (req: Request, res: Response) => {
        try {
            const cert = await Certification.create(req.body);
            res.status(201).json({ success: true, data: cert });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.put('/certifications/:id', async (req: Request, res: Response) => {
        try {
            const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({ success: true, data: cert });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.delete('/certifications/:id', async (req: Request, res: Response) => {
        try {
            await Certification.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });


    // Skills
    app.get('/skills', async (req, res) => res.json({ success: true, data: await Skill.find().populate('projectIds').populate('certIds') }));
    app.post('/skills', async (req, res) => res.status(201).json({ success: true, data: await new Skill(req.body).save() }));
    app.delete('/skills/:id', async (req, res) => {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    });
    app.put('/skills/:id', async (req, res) => {
        try {
            const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('projectIds').populate('certIds');
            res.status(200).json({ success: true, data: updatedSkill });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // About
    app.get('/about', async (req, res) => res.json({ success: true, data: await About.findOne() }));
    app.post('/about', async (req, res) => {
        const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json({ success: true, data: about });
    });

    // Services
    app.get('/services', async (req, res) => res.json({ success: true, data: await Service.find() }));
    app.post('/services', async (req, res) => {
        try {
            const service = await new Service(req.body).save();
            res.status(201).json({ success: true, data: service });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });
    app.put('/services/:id', async (req, res) => {
        try {
            const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({ success: true, data: service });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });
    app.delete('/services/:id', async (req, res) => {
        try {
            await Service.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // Hero
    app.get('/hero', async (req: Request, res: Response) => {
        try {
            const hero = await Hero.findOne();
            res.status(200).json({ success: true, data: hero });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/hero', async (req: Request, res: Response) => {
        try {
            const hero = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
            res.status(200).json({ success: true, data: hero });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });


    // Journey
    app.get('/journey', async (req: Request, res: Response) => {
        try {
            const journeyItems = await Journey.find().sort({ order: 1, year: -1, createdAt: -1 });
            res.status(200).json({ success: true, data: journeyItems });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/journey', async (req: Request, res: Response) => {
        try {
            // Auto-assign order to be last
            const count = await Journey.countDocuments();
            const journeyItem = await Journey.create({ ...req.body, order: req.body.order ?? count });
            res.status(201).json({ success: true, data: journeyItem });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // Bulk reorder journey items - MUST be before :id routes!
    app.post('/journey/reorder', async (req: Request, res: Response) => {
        try {
            const { items } = req.body; // Array of { id, order }
            if (!items || !Array.isArray(items)) {
                return res.status(400).json({ success: false, error: 'Items array required' });
            }

            const bulkOps = items.map((item: { id: string; order: number }) => ({
                updateOne: {
                    filter: { _id: item.id },
                    update: { $set: { order: item.order } }
                }
            }));

            await Journey.bulkWrite(bulkOps);
            res.status(200).json({ success: true, message: 'Order updated' });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.put('/journey/:id', async (req: Request, res: Response) => {
        try {
            const journeyItem = await Journey.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({ success: true, data: journeyItem });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.delete('/journey/:id', async (req: Request, res: Response) => {
        try {
            await Journey.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // Legacy delete route (keep for backwards compatibility)
    app.delete('/journey', async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ success: false, error: 'ID required' });
            await Journey.findByIdAndDelete(id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });


    // Contact
    app.get('/contact', async (req: Request, res: Response) => {
        try {
            const contact = await Contact.findOne();
            res.status(200).json({ success: true, data: contact });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/contact', async (req: Request, res: Response) => {
        try {
            const contact = await Contact.findOneAndUpdate({}, req.body, { new: true, upsert: true });
            res.status(200).json({ success: true, data: contact });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // CV
    app.get('/cv', async (req: Request, res: Response) => {
        try {
            const cv = await CV.findOne().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: cv });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/cv', async (req: Request, res: Response) => {
        try {
            await CV.deleteMany({});
            const newCV = new CV(req.body);
            await newCV.save();
            res.status(201).json({ success: true, data: newCV });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // CV Download — serves local PDF files directly, falls back to Cloudinary signed URL for legacy entries
    app.get('/cv/download', async (req: Request, res: Response) => {
        try {
            const cv = await CV.findOne().sort({ createdAt: -1 });
            if (!cv || !cv.url) {
                return res.status(404).json({ success: false, error: 'No CV uploaded yet.' });
            }

            const filename = (cv.filename as string | undefined) || 'resume.pdf';
            const cvUrl = cv.url as string;
            console.log('[CV/DOWNLOAD] url:', cvUrl, '| file:', filename);

            // Case 1: Local file URL (new approach — stored in uploads/cv/ on disk)
            if (cvUrl.startsWith('/api/cv-files/')) {
                const localFilename = cvUrl.replace('/api/cv-files/', '');
                const filePath = path.join(process.cwd(), 'uploads', 'cv', localFilename);
                if (!fs.existsSync(filePath)) {
                    return res.status(404).json({ success: false, error: 'CV file not found on server.' });
                }
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                return res.sendFile(filePath);
            }

            // Case 2: Legacy Cloudinary URL — try signed delivery redirect
            const uploadMatch = cvUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
            if (uploadMatch) {
                const fullPath = uploadMatch[1];
                const signedDeliveryUrl = cloudinary.url(fullPath, {
                    resource_type: 'raw',
                    type: 'upload',
                    sign_url: true,
                    secure: true,
                });
                console.log('[CV/DOWNLOAD] Legacy Cloudinary redirect:', signedDeliveryUrl);
                return res.redirect(302, signedDeliveryUrl);
            }

            // Case 3: External URL — redirect directly
            return res.redirect(302, cvUrl);
        } catch (error) {
            console.error('[CV/DOWNLOAD] ERROR:', (error as Error).message);
            res.status(500).json({ success: false, error: (error as Error).message });
        }
    });


    // CV Debug — returns diagnostic JSON (open this in the browser to diagnose)
    // Visit: http://localhost:5173/api/cv/debug
    app.get('/cv/debug', async (req: Request, res: Response) => {
        try {
            const cv = await CV.findOne().sort({ createdAt: -1 });
            if (!cv || !cv.url) return res.json({ error: 'No CV in DB' });

            const cvUrl = cv.url as string;
            const uploadMatch = cvUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
            let fullPath = '', signedDeliveryUrl = '';

            if (uploadMatch) {
                fullPath = uploadMatch[1]; // "portfolio/cv_123_NAME.pdf"
                signedDeliveryUrl = cloudinary.url(fullPath, {
                    resource_type: 'raw',
                    type: 'upload',
                    sign_url: true,
                    secure: true,
                });
            }

            // Test HTTP status of both URLs
            let directStatus = 0, signedStatus = 0;
            try { directStatus = (await fetch(cvUrl)).status; } catch (e) { directStatus = -1; }
            try { signedStatus = (await fetch(signedDeliveryUrl)).status; } catch (e) { signedStatus = -1; }

            return res.json({
                storedUrl: cvUrl,
                filename: cv.filename,
                extractedFullPath: fullPath,
                generatedSignedDeliveryUrl: signedDeliveryUrl,
                directUrlStatus: directStatus,
                signedDeliveryUrlStatus: signedStatus,
                cloudinaryConfig: {
                    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                    apiKeyPrefix: (process.env.CLOUDINARY_API_KEY || '').substring(0, 6) + '...',
                    apiSecretSet: !!process.env.CLOUDINARY_API_SECRET,
                    apiSecretLength: (process.env.CLOUDINARY_API_SECRET || '').length,
                },
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    // Contact Messages (form submissions)
    app.get('/messages', async (req: Request, res: Response) => {
        try {
            const messages = await ContactMessage.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/messages', async (req: Request, res: Response) => {
        try {
            const message = await ContactMessage.create(req.body);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.put('/messages/:id', async (req: Request, res: Response) => {
        try {
            const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({ success: true, data: message });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.delete('/messages/:id', async (req: Request, res: Response) => {
        try {
            await ContactMessage.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // Categories Route
    app.get('/categories', async (req: Request, res: Response) => {
        try {
            const { type } = req.query;
            const query = type ? { type } : {};
            const categories = await Category.find(query).sort({ name: 1 });
            res.json({ success: true, data: categories });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.post('/categories', async (req: Request, res: Response) => {
        try {
            const category = await Category.create(req.body);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.put('/categories', async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ success: false, error: 'ID required' });

            const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) return res.status(404).json({ success: false, error: 'Category not found' });

            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    app.delete('/categories', async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ success: false, error: 'ID required' });
            await Category.findByIdAndDelete(id);
            res.status(200).json({ success: true, data: {} });
        } catch (error) {
            res.status(400).json({ success: false, error: (error as Error).message });
        }
    });

    // Config
    app.get('/config', (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            data: {
                cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
            },
        });
    });

    // --- CLOUDINARY UPLOAD ---
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const storage = multer.memoryStorage();
    const uploadMiddleware = multer({
        storage,
        limits: { fileSize: 100 * 1024 * 1024 } // 100MB (supports video uploads)
    });

    app.post('/upload', uploadMiddleware.array('files', 10), async (req: Request, res: Response) => {
        try {
            // Verify Cloudinary config
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                console.error('Cloudinary configuration missing!');
                return res.status(500).json({
                    success: false,
                    error: 'Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
                });
            }

            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ success: false, error: 'No files uploaded' });
            }

            console.log(`Uploading ${files.length} file(s)...`);

            const uploadPromises = files.map(file => {
                const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');

                // PDFs: store locally to avoid Cloudinary raw file access restrictions (account-level 401)
                if (isPdf) {
                    return new Promise<object>((resolve, reject) => {
                        const safeFilename = `cv_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
                        const destPath = path.join(process.cwd(), 'uploads', 'cv', safeFilename);
                        fs.writeFile(destPath, file.buffer, (err) => {
                            if (err) {
                                console.error('[Upload] Failed to save PDF locally:', err);
                                reject(err);
                            } else {
                                // URL will be served by Express static: /api/cv-files/<filename>
                                // In dev: http://localhost:5173/api/cv-files/<filename>
                                const localUrl = `/api/cv-files/${safeFilename}`;
                                console.log('[Upload] PDF saved locally:', destPath, '→', localUrl);
                                resolve({
                                    originalName: file.originalname,
                                    filename: file.originalname,
                                    url: localUrl,
                                    size: file.size,
                                    resource_type: 'local',
                                });
                            }
                        });
                    });
                }

                // Images & Videos: upload to Cloudinary as before
                return new Promise((resolve, reject) => {
                    const isVideo = file.mimetype.startsWith('video/');
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'portfolio',
                            timeout: 300000,
                            ...(isVideo
                                ? {
                                    quality: 'auto:low',
                                    chunk_size: 6000000,
                                }
                                : {
                                    quality: 65,
                                    fetch_format: 'auto',
                                    width: 1920,
                                    height: 1080,
                                    crop: 'limit',
                                }
                            ),
                        },
                        (error, result) => {
                            if (error) {
                                console.error('Cloudinary upload error:', error);
                                reject(error);
                            } else {
                                console.log('Upload success:', result?.secure_url, `(${file.size} → ${result?.bytes})`);
                                resolve({
                                    originalName: file.originalname,
                                    url: result?.secure_url,
                                    publicId: result?.public_id,
                                    format: result?.format,
                                    resource_type: result?.resource_type,
                                    originalSize: file.size,
                                    size: result?.bytes,
                                    width: result?.width,
                                    height: result?.height,
                                    filename: file.originalname,
                                });
                            }
                        }
                    );

                    const readable = new Readable();
                    readable.push(file.buffer);
                    readable.push(null);
                    readable.pipe(uploadStream);
                });
            });



            const results = await Promise.all(uploadPromises);
            res.status(200).json({ success: true, data: results });
        } catch (error: any) {
            console.error('Upload error:', error?.message || error);
            res.status(500).json({
                success: false,
                error: error?.message || 'Upload failed',
                details: process.env.NODE_ENV !== 'production' ? String(error) : undefined
            });
        }
    });

// ─── Vercel Serverless Entry Point ─────────────────────────────────────────────
// Vercel @vercel/node calls the default export as a request handler.
// Singleton pattern keeps the MongoDB connection alive across warm invocations.
// We must strip the /api prefix from the URL because:
//   - Vercel routes /api/contact → this handler with the FULL url "/api/contact"
//   - Express routes are registered without the prefix: app.get('/contact', ...)
let _app: ReturnType<typeof createApiServer> | null = null;
function getApp() {
    if (!_app) _app = createApiServer();
    return _app;
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
    // Strip /api prefix so Express can match its routes
    if (req.url?.startsWith('/api/')) {
        req.url = req.url.slice(4); // "/api/contact" → "/contact"
    } else if (req.url === '/api') {
        req.url = '/';
    }
    return getApp()(req, res);
}
