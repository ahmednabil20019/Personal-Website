const mongoose = require('mongoose');

// --- MongoDB Config ---
let Service;
try {
  mongoose.connect(process.env.MONGO_URI);
  const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    price: { type: String },
    features: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
} catch (error) {
  console.error("Error setting up Mongoose for Services:", error);
}

// --- API Handler ---
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const services = await Service.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: services });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { title, description, icon, price, features } = req.body;
        
        const service = await Service.create({
          title,
          description,
          icon,
          price,
          features: features || []
        });
        
        res.status(201).json({ success: true, data: service });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Service ID is required' });
        }

        const { title, description, icon, price, features } = req.body;
        const service = await Service.findByIdAndUpdate(
          id,
          { title, description, icon, price, features, updatedAt: new Date() },
          { new: true, runValidators: true }
        );

        if (!service) {
          return res.status(404).json({ success: false, error: 'Service not found' });
        }

        res.status(200).json({ success: true, data: service });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        if (!id) {
          return res.status(400).json({ success: false, error: 'Service ID is required' });
        }

        const service = await Service.findByIdAndDelete(id);
        if (!service) {
          return res.status(404).json({ success: false, error: 'Service not found' });
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
