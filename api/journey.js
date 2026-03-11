const mongoose = require('mongoose');

// --- MongoDB Config ---
let Journey;
try {
  mongoose.connect(process.env.MONGO_URI);
  const JourneySchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    achievements: [String],
    technologies: [String],
    type: { type: String, enum: ['work', 'education'], required: true },
    color: { type: String, default: 'from-blue-500 to-blue-600' },
    icon: { type: String, default: 'Briefcase' },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  Journey = mongoose.models.Journey || mongoose.model('Journey', JourneySchema);
} catch (error) {
  console.error("Error setting up Mongoose for Journey:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const journeyItems = await Journey.find({}).sort({ year: -1, order: -1 });
        res.status(200).json({ success: true, data: journeyItems });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { 
          title, 
          company, 
          location, 
          year, 
          period, 
          description, 
          achievements, 
          technologies, 
          type, 
          color, 
          icon, 
          order 
        } = req.body;
        
        const journeyItem = await Journey.create({
          title,
          company,
          location,
          year,
          period,
          description,
          achievements: achievements || [],
          technologies: technologies || [],
          type,
          color: color || (type === 'work' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-pink-600'),
          icon: icon || (type === 'work' ? 'Briefcase' : 'GraduationCap'),
          order: order || 0
        });
        
        res.status(201).json({ success: true, data: journeyItem });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Journey ID is required' });
        }

        const { 
          title, 
          company, 
          location, 
          year, 
          period, 
          description, 
          achievements, 
          technologies, 
          type, 
          color, 
          icon, 
          order 
        } = req.body;

        const journeyItem = await Journey.findByIdAndUpdate(
          id,
          { 
            title, 
            company, 
            location, 
            year, 
            period, 
            description, 
            achievements, 
            technologies, 
            type, 
            color, 
            icon, 
            order,
            updatedAt: new Date() 
          },
          { new: true, runValidators: true }
        );

        if (!journeyItem) {
          return res.status(404).json({ success: false, error: 'Journey item not found' });
        }

        res.status(200).json({ success: true, data: journeyItem });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Journey ID is required' });
        }

        const journeyItem = await Journey.findByIdAndDelete(id);
        if (!journeyItem) {
          return res.status(404).json({ success: false, error: 'Journey item not found' });
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
