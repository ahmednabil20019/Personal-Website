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
  params: { folder: 'portfolio', allowed_formats: ['jpeg', 'png', 'jpg'] },
});
const upload = multer({ storage });

// --- MongoDB Config ---
let Certification;
try {
  mongoose.connect(process.env.MONGO_URI);
  const CertificationSchema = new mongoose.Schema({
    title: String, issuer: String, category: String, date: String,
    startDate: String, endDate: String, courseHours: String,
    credentialId: String, verificationUrl: String, image: String,
  });
  Certification = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
} catch (error) {
  console.error("Error setting up Mongoose for Certifications:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const certifications = await Certification.find({});
        res.status(200).json({ success: true, data: certifications });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      // This needs a more complex setup to handle multipart/form-data with Vercel.
      res.status(405).json({ success: false, message: "POST not fully implemented for file uploads yet." });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
} 