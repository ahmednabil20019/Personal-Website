const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// --- Cloudinary & Multer Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'portfolio', allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'mp4'] },
});
const upload = multer({ storage });

// --- MongoDB Config ---
let Project;
try {
  mongoose.connect(process.env.MONGO_URI);
  const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    technologies: [String],
    category: { type: String, required: true },
    liveUrl: String,
    githubUrl: String,
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
} catch (error) {
  console.error("Error setting up Mongoose for Projects:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { title, description, images, technologies, category, liveUrl, githubUrl, featured } = req.body;

        const project = await Project.create({
          title,
          description,
          images: images || [],
          technologies: technologies || [],
          category,
          liveUrl,
          githubUrl,
          featured: featured || false
        });

        res.status(201).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Project ID is required' });
        }

        const { title, description, images, technologies, category, liveUrl, githubUrl, featured } = req.body;
        const project = await Project.findByIdAndUpdate(
          id,
          {
            title,
            description,
            images,
            technologies,
            category,
            liveUrl,
            githubUrl,
            featured,
            updatedAt: new Date()
          },
          { new: true, runValidators: true }
        );

        if (!project) {
          return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Project ID is required' });
        }

        const project = await Project.findByIdAndDelete(id);
        if (!project) {
          return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}