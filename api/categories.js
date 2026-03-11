const mongoose = require('mongoose');

// --- MongoDB Config ---
let Category;
try {
  mongoose.connect(process.env.MONGO_URI);
  const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['skill', 'project', 'service'], required: true },
    description: { type: String },
    color: { type: String, default: '#3b82f6' },
    icon: { type: String, default: 'Folder' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  // Create compound unique index for name + type combination
  CategorySchema.index({ name: 1, type: 1 }, { unique: true });
  Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
} catch (error) {
  console.error("Error setting up Mongoose for Categories:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;
  const { id, type } = req.query;

  switch (method) {
    case 'GET':
      try {
        let query = {};
        if (type) {
          query.type = type;
        }

        const categories = await Category.find(query).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, type, description, color, icon } = req.body;

        // Check if category already exists for this type
        const existingCategory = await Category.findOne({ name, type: type || 'skill' });
        if (existingCategory) {
          return res.status(400).json({ success: false, error: `Category '${name}' already exists for type '${type || 'skill'}'` });
        }

        const category = await Category.create({
          name,
          type: type || 'skill',
          description,
          color: color || '#3b82f6',
          icon: icon || 'Folder'
        });

        res.status(201).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Category ID is required' });
        }

        const { name, type, description, color, icon } = req.body;
        const category = await Category.findByIdAndUpdate(
          id,
          { name, type, description, color, icon, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (!category) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }

        res.status(200).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Category ID is required' });
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
          return res.status(404).json({ success: false, error: 'Category not found' });
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