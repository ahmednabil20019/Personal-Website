const mongoose = require('mongoose');

// --- MongoDB Config ---
let About;
try {
  mongoose.connect(process.env.MONGO_URI);
  const AboutSchema = new mongoose.Schema({
    content: { type: String, required: true },
    title: { type: String, default: 'About Me' },
    subtitle: { type: String },
    profileImage: { type: String },
    resumeUrl: { type: String },
    contactInfo: {
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      twitter: String,
      website: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  About = mongoose.models.About || mongoose.model('About', AboutSchema);
} catch (error) {
  console.error("Error setting up Mongoose for About:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        let about = await About.findOne({});
        
        // If no about document exists, create a default one
        if (!about) {
          about = await About.create({
            content: 'Welcome to my portfolio! I am a passionate developer with expertise in modern web technologies.',
            title: 'About Me',
            subtitle: 'Full Stack Developer',
            contactInfo: {}
          });
        }
        
        res.status(200).json({ success: true, data: about });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
    case 'PUT':
      try {
        const { content, title, subtitle, profileImage, resumeUrl, contactInfo } = req.body;
        
        // Find existing about document or create new one
        let about = await About.findOne({});
        
        if (about) {
          // Update existing
          about = await About.findByIdAndUpdate(
            about._id,
            { 
              content, 
              title, 
              subtitle, 
              profileImage, 
              resumeUrl, 
              contactInfo,
              updatedAt: new Date() 
            },
            { new: true, runValidators: true }
          );
        } else {
          // Create new
          about = await About.create({
            content,
            title: title || 'About Me',
            subtitle,
            profileImage,
            resumeUrl,
            contactInfo: contactInfo || {}
          });
        }
        
        res.status(200).json({ success: true, data: about });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
