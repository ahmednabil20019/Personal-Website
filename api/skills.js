const mongoose = require('mongoose');

// --- MongoDB Config ---
let Skill;
try {
  mongoose.connect(process.env.MONGO_URI);
  const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
} catch (error) {
  console.error("Error setting up Mongoose for Skills:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const skills = await Skill.find({}).sort({ category: 1, name: 1 });
        res.status(200).json({ success: true, data: skills });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, icon, category, level } = req.body;
        
        // Check if skill already exists
        const existingSkill = await Skill.findOne({ name, category });
        if (existingSkill) {
          return res.status(400).json({ success: false, error: 'Skill already exists in this category' });
        }

        const skill = await Skill.create({
          name,
          icon,
          category,
          level: level || 'Intermediate'
        });
        
        res.status(201).json({ success: true, data: skill });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Skill ID is required' });
        }

        const { name, icon, category, level } = req.body;
        const skill = await Skill.findByIdAndUpdate(
          id,
          { name, icon, category, level, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (!skill) {
          return res.status(404).json({ success: false, error: 'Skill not found' });
        }

        res.status(200).json({ success: true, data: skill });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Skill ID is required' });
        }

        const skill = await Skill.findByIdAndDelete(id);
        if (!skill) {
          return res.status(404).json({ success: false, error: 'Skill not found' });
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
