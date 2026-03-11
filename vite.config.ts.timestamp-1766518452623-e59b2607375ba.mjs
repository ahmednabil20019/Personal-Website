// vite.config.ts
import path from "path";
import react from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/@vitejs/plugin-react-swc/index.js";
import { defineConfig } from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/vite/dist/node/index.js";

// server.ts
import express from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/express/index.js";
import mongoose from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/mongoose/index.js";
import cors from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/cors/lib/index.js";
import dotenv from "file:///C:/Users/M7mod%20Hegazy/Desktop/asd/django/admin-portofolio-main/node_modules/dotenv/lib/main.js";
dotenv.config();
function createApiServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected for local dev")).catch((err) => console.error("MongoDB connection error:", err));
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
  const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
  const CertificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: String,
    credentialId: String,
    verificationUrl: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Certification = mongoose.models.Certification || mongoose.model("Certification", CertificationSchema);
  const SkillSchema = new mongoose.Schema({
    name: String,
    icon: String,
    category: String,
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], default: "Intermediate" },
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    certIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certification" }]
  });
  const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
  const AboutSchema = new mongoose.Schema({
    content: String,
    avatar: String,
    stats: [{ label: String, value: String }]
  });
  const About = mongoose.models.About || mongoose.model("About", AboutSchema);
  const ServiceSchema = new mongoose.Schema({ title: String, description: String, icon: String });
  const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
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
  const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
  const JourneySchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    year: String,
    period: String,
    description: String,
    achievements: [String],
    technologies: [String],
    type: { type: String, enum: ["work", "education", "project"], default: "work" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Journey = mongoose.models.Journey || mongoose.model("Journey", JourneySchema);
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
  const CVSchema = new mongoose.Schema({
    url: String
  }, { timestamps: true });
  const CV = mongoose.models.CV || mongoose.model("CV", CVSchema);
  const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["skill", "project", "service"], required: true },
    description: { type: String },
    color: { type: String, default: "#3b82f6" },
    icon: { type: String, default: "Folder" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
  const seedDefaultHero = async () => {
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
        console.log("\u2705 Created default Hero data");
      }
    } catch (error) {
      console.error("Error seeding Hero data:", error);
    }
  };
  seedDefaultHero();
  const seedDefaultCategories = async () => {
    try {
      const defaultCategories = [
        { name: "Frontend", type: "skill", description: "Frontend technologies", color: "#3b82f6", icon: "Monitor" },
        { name: "Backend", type: "skill", description: "Backend technologies", color: "#10b981", icon: "Server" },
        { name: "Mobile", type: "skill", description: "Mobile development", color: "#8b5cf6", icon: "Smartphone" },
        { name: "Tools", type: "skill", description: "DevOps & Tools", color: "#f59e0b", icon: "Wrench" }
      ];
      for (const cat of defaultCategories) {
        const existing = await Category.findOne({ name: cat.name, type: cat.type });
        if (!existing) await Category.create(cat);
      }
    } catch (error) {
      console.error("Error seeding categories:", error);
    }
  };
  seedDefaultCategories();
  app.get("/projects", async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/projects", async (req, res) => {
    try {
      const project = await Project.create(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/projects", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: "ID required" });
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/projects", async (req, res) => {
    try {
      const { id } = req.query;
      await Project.findByIdAndDelete(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/certifications", async (req, res) => {
    try {
      const certs = await Certification.find().sort({ date: -1 });
      res.status(200).json({ success: true, data: certs });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/certifications", async (req, res) => {
    try {
      const cert = await Certification.create(req.body);
      res.status(201).json({ success: true, data: cert });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.put("/certifications/:id", async (req, res) => {
    try {
      const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ success: true, data: cert });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/certifications/:id", async (req, res) => {
    try {
      await Certification.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/skills", async (req, res) => res.json({ success: true, data: await Skill.find().populate("projectIds").populate("certIds") }));
  app.post("/skills", async (req, res) => res.status(201).json({ success: true, data: await new Skill(req.body).save() }));
  app.delete("/skills/:id", async (req, res) => {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
  app.put("/skills/:id", async (req, res) => {
    try {
      const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("projectIds").populate("certIds");
      res.status(200).json({ success: true, data: updatedSkill });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/about", async (req, res) => res.json({ success: true, data: await About.findOne() }));
  app.post("/about", async (req, res) => {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ success: true, data: about });
  });
  app.get("/services", async (req, res) => res.json({ success: true, data: await Service.find() }));
  app.post("/services", async (req, res) => {
    const { _id, ...data } = req.body;
    const service = _id ? await Service.findByIdAndUpdate(_id, data, { new: true }) : await new Service(data).save();
    res.json({ success: true, data: service });
  });
  app.get("/hero", async (req, res) => {
    try {
      const hero = await Hero.findOne();
      res.status(200).json({ success: true, data: hero });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/hero", async (req, res) => {
    try {
      const hero = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.status(200).json({ success: true, data: hero });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/journey", async (req, res) => {
    try {
      const journeyItems = await Journey.find().sort({ year: -1, createdAt: -1 });
      res.status(200).json({ success: true, data: journeyItems });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/journey", async (req, res) => {
    try {
      const journeyItem = await Journey.create(req.body);
      res.status(201).json({ success: true, data: journeyItem });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.delete("/journey", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: "ID required" });
      await Journey.findByIdAndDelete(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/contact", async (req, res) => {
    try {
      const contact = await Contact.findOne();
      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/contact", async (req, res) => {
    try {
      const contact = await Contact.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/cv", async (req, res) => {
    try {
      const cv = await CV.findOne().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: cv });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.post("/cv", async (req, res) => {
    try {
      await CV.deleteMany({});
      const newCV = new CV(req.body);
      await newCV.save();
      res.status(201).json({ success: true, data: newCV });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/categories", async (req, res) => {
    try {
      const { type } = req.query;
      const query = type ? { type } : {};
      const categories = await Category.find(query).sort({ name: 1 });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app.get("/config", (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME
      }
    });
  });
  return app;
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\M7mod Hegazy\\Desktop\\asd\\django\\admin-portofolio-main";
var apiServerPlugin = () => ({
  name: "api-server-plugin",
  configureServer: (server) => {
    const api = createApiServer();
    server.middlewares.use("/api", api);
  }
});
var vite_config_default = defineConfig({
  envDir: "./",
  // Use the root directory for .env files
  plugins: [
    react(),
    apiServerPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2VydmVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTTdtb2QgSGVnYXp5XFxcXERlc2t0b3BcXFxcYXNkXFxcXGRqYW5nb1xcXFxhZG1pbi1wb3J0b2ZvbGlvLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE03bW9kIEhlZ2F6eVxcXFxEZXNrdG9wXFxcXGFzZFxcXFxkamFuZ29cXFxcYWRtaW4tcG9ydG9mb2xpby1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9NN21vZCUyMEhlZ2F6eS9EZXNrdG9wL2FzZC9kamFuZ28vYWRtaW4tcG9ydG9mb2xpby1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBWaXRlRGV2U2VydmVyIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHsgY3JlYXRlQXBpU2VydmVyIH0gZnJvbSBcIi4vc2VydmVyXCJcblxuY29uc3QgYXBpU2VydmVyUGx1Z2luID0gKCkgPT4gKHtcbiAgbmFtZTogJ2FwaS1zZXJ2ZXItcGx1Z2luJyxcbiAgY29uZmlndXJlU2VydmVyOiAoc2VydmVyOiBWaXRlRGV2U2VydmVyKSA9PiB7XG4gICAgY29uc3QgYXBpID0gY3JlYXRlQXBpU2VydmVyKCk7XG4gICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaScsIGFwaSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnZEaXI6ICcuLycsIC8vIFVzZSB0aGUgcm9vdCBkaXJlY3RvcnkgZm9yIC5lbnYgZmlsZXNcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgYXBpU2VydmVyUGx1Z2luKClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTTdtb2QgSGVnYXp5XFxcXERlc2t0b3BcXFxcYXNkXFxcXGRqYW5nb1xcXFxhZG1pbi1wb3J0b2ZvbGlvLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE03bW9kIEhlZ2F6eVxcXFxEZXNrdG9wXFxcXGFzZFxcXFxkamFuZ29cXFxcYWRtaW4tcG9ydG9mb2xpby1tYWluXFxcXHNlcnZlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTTdtb2QlMjBIZWdhenkvRGVza3RvcC9hc2QvZGphbmdvL2FkbWluLXBvcnRvZm9saW8tbWFpbi9zZXJ2ZXIudHNcIjtpbXBvcnQgZXhwcmVzcywgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xyXG5pbXBvcnQgbXVsdGVyIGZyb20gJ211bHRlcic7XHJcbmltcG9ydCB7IHYyIGFzIGNsb3VkaW5hcnkgfSBmcm9tICdjbG91ZGluYXJ5JztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcGlTZXJ2ZXIoKSB7XHJcbiAgICBjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcbiAgICBhcHAudXNlKGNvcnMoKSk7XHJcbiAgICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcclxuXHJcbiAgICAvLyBSZXF1ZXN0IExvZ2dpbmcgTWlkZGxld2FyZVxyXG4gICAgYXBwLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgWyR7bmV3IERhdGUoKS50b0lTT1N0cmluZygpfV0gJHtyZXEubWV0aG9kfSAke3JlcS51cmx9YCk7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gLS0tIE1vbmdvREIgQ29uZmlnIC0tLVxyXG4gICAgbW9uZ29vc2UuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT19VUkkgYXMgc3RyaW5nKVxyXG4gICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKCdNb25nb0RCIGNvbm5lY3RlZCBmb3IgbG9jYWwgZGV2JykpXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdNb25nb0RCIGNvbm5lY3Rpb24gZXJyb3I6JywgZXJyKSk7XHJcblxyXG4gICAgLy8gLS0tIFNjaGVtYXMgJiBNb2RlbHMgLS0tXHJcbiAgICBjb25zdCBQcm9qZWN0U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBpbWFnZXM6IFtTdHJpbmddLFxyXG4gICAgICAgIHRlY2hub2xvZ2llczogW1N0cmluZ10sXHJcbiAgICAgICAgY2F0ZWdvcnk6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGxpdmVVcmw6IFN0cmluZyxcclxuICAgICAgICBnaXRodWJVcmw6IFN0cmluZyxcclxuICAgICAgICBmZWF0dXJlZDogeyB0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZSB9LFxyXG4gICAgICAgIGNyZWF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxyXG4gICAgICAgIHVwZGF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IFByb2plY3QgPSBtb25nb29zZS5tb2RlbHMuUHJvamVjdCB8fCBtb25nb29zZS5tb2RlbCgnUHJvamVjdCcsIFByb2plY3RTY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IENlcnRpZmljYXRpb25TY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgaXNzdWVyOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBkYXRlOiBTdHJpbmcsXHJcbiAgICAgICAgY3JlZGVudGlhbElkOiBTdHJpbmcsXHJcbiAgICAgICAgdmVyaWZpY2F0aW9uVXJsOiBTdHJpbmcsXHJcbiAgICAgICAgaW1hZ2U6IFN0cmluZyxcclxuICAgICAgICBjcmVhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfSxcclxuICAgICAgICB1cGRhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBDZXJ0aWZpY2F0aW9uID0gbW9uZ29vc2UubW9kZWxzLkNlcnRpZmljYXRpb24gfHwgbW9uZ29vc2UubW9kZWwoJ0NlcnRpZmljYXRpb24nLCBDZXJ0aWZpY2F0aW9uU2NoZW1hKTtcclxuXHJcbiAgICBjb25zdCBTa2lsbFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICBpY29uOiBTdHJpbmcsXHJcbiAgICAgICAgY2F0ZWdvcnk6IFN0cmluZyxcclxuICAgICAgICBsZXZlbDogeyB0eXBlOiBTdHJpbmcsIGVudW06IFsnQmVnaW5uZXInLCAnSW50ZXJtZWRpYXRlJywgJ0FkdmFuY2VkJywgJ0V4cGVydCddLCBkZWZhdWx0OiAnSW50ZXJtZWRpYXRlJyB9LFxyXG4gICAgICAgIHByb2plY3RJZHM6IFt7IHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnUHJvamVjdCcgfV0sXHJcbiAgICAgICAgY2VydElkczogW3sgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdDZXJ0aWZpY2F0aW9uJyB9XVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBTa2lsbCA9IG1vbmdvb3NlLm1vZGVscy5Ta2lsbCB8fCBtb25nb29zZS5tb2RlbCgnU2tpbGwnLCBTa2lsbFNjaGVtYSk7XHJcblxyXG4gICAgY29uc3QgQWJvdXRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBjb250ZW50OiBTdHJpbmcsXHJcbiAgICAgICAgYXZhdGFyOiBTdHJpbmcsXHJcbiAgICAgICAgc3RhdHM6IFt7IGxhYmVsOiBTdHJpbmcsIHZhbHVlOiBTdHJpbmcgfV1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgQWJvdXQgPSBtb25nb29zZS5tb2RlbHMuQWJvdXQgfHwgbW9uZ29vc2UubW9kZWwoJ0Fib3V0JywgQWJvdXRTY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IFNlcnZpY2VTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHsgdGl0bGU6IFN0cmluZywgZGVzY3JpcHRpb246IFN0cmluZywgaWNvbjogU3RyaW5nIH0pO1xyXG4gICAgY29uc3QgU2VydmljZSA9IG1vbmdvb3NlLm1vZGVscy5TZXJ2aWNlIHx8IG1vbmdvb3NlLm1vZGVsKCdTZXJ2aWNlJywgU2VydmljZVNjaGVtYSk7XHJcblxyXG4gICAgY29uc3QgSGVyb1NjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICAgIGdyZWV0aW5nOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgc3VidGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICByZXN1bWVVcmw6IFN0cmluZyxcclxuICAgICAgICBzb2NpYWxMaW5rczogeyB0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiB0cnVlIH0sXHJcbiAgICAgICAgY3JlYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH0sXHJcbiAgICAgICAgdXBkYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgSGVybyA9IG1vbmdvb3NlLm1vZGVscy5IZXJvIHx8IG1vbmdvb3NlLm1vZGVsKCdIZXJvJywgSGVyb1NjaGVtYSk7XHJcblxyXG4gICAgY29uc3QgSm91cm5leVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICAgIHRpdGxlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBjb21wYW55OiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBsb2NhdGlvbjogU3RyaW5nLFxyXG4gICAgICAgIHllYXI6IFN0cmluZyxcclxuICAgICAgICBwZXJpb2Q6IFN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogU3RyaW5nLFxyXG4gICAgICAgIGFjaGlldmVtZW50czogW1N0cmluZ10sXHJcbiAgICAgICAgdGVjaG5vbG9naWVzOiBbU3RyaW5nXSxcclxuICAgICAgICB0eXBlOiB7IHR5cGU6IFN0cmluZywgZW51bTogWyd3b3JrJywgJ2VkdWNhdGlvbicsICdwcm9qZWN0J10sIGRlZmF1bHQ6ICd3b3JrJyB9LFxyXG4gICAgICAgIGNyZWF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxyXG4gICAgICAgIHVwZGF0ZWRBdDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IEpvdXJuZXkgPSBtb25nb29zZS5tb2RlbHMuSm91cm5leSB8fCBtb25nb29zZS5tb2RlbCgnSm91cm5leScsIEpvdXJuZXlTY2hlbWEpO1xyXG5cclxuICAgIGNvbnN0IENvbnRhY3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgcGhvbmU6IFN0cmluZyxcclxuICAgICAgICBsb2NhdGlvbjogU3RyaW5nLFxyXG4gICAgICAgIHdlYnNpdGU6IFN0cmluZyxcclxuICAgICAgICBsaW5rZWRpbjogU3RyaW5nLFxyXG4gICAgICAgIGdpdGh1YjogU3RyaW5nLFxyXG4gICAgICAgIHR3aXR0ZXI6IFN0cmluZyxcclxuICAgICAgICBpbnN0YWdyYW06IFN0cmluZyxcclxuICAgICAgICBmYWNlYm9vazogU3RyaW5nLFxyXG4gICAgICAgIHdoYXRzYXBwOiBTdHJpbmcsXHJcbiAgICAgICAgbWVzc2VuZ2VyOiBTdHJpbmcsXHJcbiAgICAgICAgY3JlYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH0sXHJcbiAgICAgICAgdXBkYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgQ29udGFjdCA9IG1vbmdvb3NlLm1vZGVscy5Db250YWN0IHx8IG1vbmdvb3NlLm1vZGVsKCdDb250YWN0JywgQ29udGFjdFNjaGVtYSk7XHJcblxyXG4gICAgY29uc3QgQ1ZTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgICB1cmw6IFN0cmluZyxcclxuICAgIH0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcclxuICAgIGNvbnN0IENWID0gbW9uZ29vc2UubW9kZWxzLkNWIHx8IG1vbmdvb3NlLm1vZGVsKCdDVicsIENWU2NoZW1hKTtcclxuXHJcbiAgICBjb25zdCBDYXRlZ29yeVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIHR5cGU6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbJ3NraWxsJywgJ3Byb2plY3QnLCAnc2VydmljZSddLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGNvbG9yOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJyMzYjgyZjYnIH0sXHJcbiAgICAgICAgaWNvbjogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdGb2xkZXInIH0sXHJcbiAgICAgICAgY3JlYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH0sXHJcbiAgICAgICAgdXBkYXRlZEF0OiB7IHR5cGU6IERhdGUsIGRlZmF1bHQ6IERhdGUubm93IH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgQ2F0ZWdvcnkgPSBtb25nb29zZS5tb2RlbHMuQ2F0ZWdvcnkgfHwgbW9uZ29vc2UubW9kZWwoJ0NhdGVnb3J5JywgQ2F0ZWdvcnlTY2hlbWEpO1xyXG5cclxuICAgIC8vIC0tLSBTZWVkIExvZ2ljIC0tLVxyXG4gICAgY29uc3Qgc2VlZERlZmF1bHRIZXJvID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSGVybyA9IGF3YWl0IEhlcm8uZmluZE9uZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWV4aXN0aW5nSGVybykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgSGVyby5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGdyZWV0aW5nOiBcIkhlbGxvLCBJJ21cIixcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJKb2huIERvZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1YnRpdGxlOiBcIkNyZWF0aXZlIERldmVsb3BlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkkgYnVpbGQgaW1tZXJzaXZlIHdlYiBleHBlcmllbmNlcyB3aXRoIG1vZGVybiB0ZWNobm9sb2dpZXMuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdW1lVXJsOiBcIi9yZXN1bWUucGRmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc29jaWFsTGlua3M6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1x1MjcwNSBDcmVhdGVkIGRlZmF1bHQgSGVybyBkYXRhJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZWVkaW5nIEhlcm8gZGF0YTonLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHNlZWREZWZhdWx0SGVybygpO1xyXG5cclxuICAgIGNvbnN0IHNlZWREZWZhdWx0Q2F0ZWdvcmllcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Q2F0ZWdvcmllcyA9IFtcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ0Zyb250ZW5kJywgdHlwZTogJ3NraWxsJywgZGVzY3JpcHRpb246ICdGcm9udGVuZCB0ZWNobm9sb2dpZXMnLCBjb2xvcjogJyMzYjgyZjYnLCBpY29uOiAnTW9uaXRvcicgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ0JhY2tlbmQnLCB0eXBlOiAnc2tpbGwnLCBkZXNjcmlwdGlvbjogJ0JhY2tlbmQgdGVjaG5vbG9naWVzJywgY29sb3I6ICcjMTBiOTgxJywgaWNvbjogJ1NlcnZlcicgfSxcclxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ01vYmlsZScsIHR5cGU6ICdza2lsbCcsIGRlc2NyaXB0aW9uOiAnTW9iaWxlIGRldmVsb3BtZW50JywgY29sb3I6ICcjOGI1Y2Y2JywgaWNvbjogJ1NtYXJ0cGhvbmUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdUb29scycsIHR5cGU6ICdza2lsbCcsIGRlc2NyaXB0aW9uOiAnRGV2T3BzICYgVG9vbHMnLCBjb2xvcjogJyNmNTllMGInLCBpY29uOiAnV3JlbmNoJyB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2F0IG9mIGRlZmF1bHRDYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IENhdGVnb3J5LmZpbmRPbmUoeyBuYW1lOiBjYXQubmFtZSwgdHlwZTogY2F0LnR5cGUgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0aW5nKSBhd2FpdCBDYXRlZ29yeS5jcmVhdGUoY2F0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlZWRpbmcgY2F0ZWdvcmllczonLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHNlZWREZWZhdWx0Q2F0ZWdvcmllcygpO1xyXG5cclxuICAgIC8vIC0tLSBBUEkgUm91dGVzIC0tLVxyXG5cclxuICAgIC8vIFByb2plY3RzXHJcbiAgICBhcHAuZ2V0KCcvcHJvamVjdHMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvamVjdHMgPSBhd2FpdCBQcm9qZWN0LmZpbmQoKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBwcm9qZWN0cyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wb3N0KCcvcHJvamVjdHMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvamVjdCA9IGF3YWl0IFByb2plY3QuY3JlYXRlKHJlcS5ib2R5KTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBwcm9qZWN0IH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnB1dCgnL3Byb2plY3RzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeTtcclxuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSUQgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0ID0gYXdhaXQgUHJvamVjdC5maW5kQnlJZEFuZFVwZGF0ZShpZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHByb2plY3QgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAuZGVsZXRlKCcvcHJvamVjdHMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnF1ZXJ5O1xyXG4gICAgICAgICAgICBhd2FpdCBQcm9qZWN0LmZpbmRCeUlkQW5kRGVsZXRlKGlkKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7fSB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENlcnRpZmljYXRpb25zXHJcbiAgICBhcHAuZ2V0KCcvY2VydGlmaWNhdGlvbnMnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2VydHMgPSBhd2FpdCBDZXJ0aWZpY2F0aW9uLmZpbmQoKS5zb3J0KHsgZGF0ZTogLTEgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY2VydHMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2NlcnRpZmljYXRpb25zJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNlcnQgPSBhd2FpdCBDZXJ0aWZpY2F0aW9uLmNyZWF0ZShyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY2VydCB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFwcC5wdXQoJy9jZXJ0aWZpY2F0aW9ucy86aWQnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY2VydCA9IGF3YWl0IENlcnRpZmljYXRpb24uZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGNlcnQgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAuZGVsZXRlKCcvY2VydGlmaWNhdGlvbnMvOmlkJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IENlcnRpZmljYXRpb24uZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YToge30gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gU2tpbGxzXHJcbiAgICBhcHAuZ2V0KCcvc2tpbGxzJywgYXN5bmMgKHJlcSwgcmVzKSA9PiByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGF3YWl0IFNraWxsLmZpbmQoKS5wb3B1bGF0ZSgncHJvamVjdElkcycpLnBvcHVsYXRlKCdjZXJ0SWRzJykgfSkpO1xyXG4gICAgYXBwLnBvc3QoJy9za2lsbHMnLCBhc3luYyAocmVxLCByZXMpID0+IHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogYXdhaXQgbmV3IFNraWxsKHJlcS5ib2R5KS5zYXZlKCkgfSkpO1xyXG4gICAgYXBwLmRlbGV0ZSgnL3NraWxscy86aWQnLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgICAgICBhd2FpdCBTa2lsbC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7XHJcbiAgICB9KTtcclxuICAgIGFwcC5wdXQoJy9za2lsbHMvOmlkJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlZFNraWxsID0gYXdhaXQgU2tpbGwuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pLnBvcHVsYXRlKCdwcm9qZWN0SWRzJykucG9wdWxhdGUoJ2NlcnRJZHMnKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB1cGRhdGVkU2tpbGwgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBYm91dFxyXG4gICAgYXBwLmdldCgnL2Fib3V0JywgYXN5bmMgKHJlcSwgcmVzKSA9PiByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGF3YWl0IEFib3V0LmZpbmRPbmUoKSB9KSk7XHJcbiAgICBhcHAucG9zdCgnL2Fib3V0JywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWJvdXQgPSBhd2FpdCBBYm91dC5maW5kT25lQW5kVXBkYXRlKHt9LCByZXEuYm9keSwgeyB1cHNlcnQ6IHRydWUsIG5ldzogdHJ1ZSB9KTtcclxuICAgICAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGFib3V0IH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU2VydmljZXNcclxuICAgIGFwcC5nZXQoJy9zZXJ2aWNlcycsIGFzeW5jIChyZXEsIHJlcykgPT4gcmVzLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhd2FpdCBTZXJ2aWNlLmZpbmQoKSB9KSk7XHJcbiAgICBhcHAucG9zdCgnL3NlcnZpY2VzJywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBfaWQsIC4uLmRhdGEgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBfaWRcclxuICAgICAgICAgICAgPyBhd2FpdCBTZXJ2aWNlLmZpbmRCeUlkQW5kVXBkYXRlKF9pZCwgZGF0YSwgeyBuZXc6IHRydWUgfSlcclxuICAgICAgICAgICAgOiBhd2FpdCBuZXcgU2VydmljZShkYXRhKS5zYXZlKCk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBzZXJ2aWNlIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSGVyb1xyXG4gICAgYXBwLmdldCgnL2hlcm8nLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGVybyA9IGF3YWl0IEhlcm8uZmluZE9uZSgpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGhlcm8gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2hlcm8nLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgaGVybyA9IGF3YWl0IEhlcm8uZmluZE9uZUFuZFVwZGF0ZSh7fSwgcmVxLmJvZHksIHsgbmV3OiB0cnVlLCB1cHNlcnQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogaGVybyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBKb3VybmV5XHJcbiAgICBhcHAuZ2V0KCcvam91cm5leScsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBqb3VybmV5SXRlbXMgPSBhd2FpdCBKb3VybmV5LmZpbmQoKS5zb3J0KHsgeWVhcjogLTEsIGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogam91cm5leUl0ZW1zIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy9qb3VybmV5JywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGpvdXJuZXlJdGVtID0gYXdhaXQgSm91cm5leS5jcmVhdGUocmVxLmJvZHkpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGpvdXJuZXlJdGVtIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBhcHAuZGVsZXRlKCcvam91cm5leScsIGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSByZXEucXVlcnk7XHJcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0lEIHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgYXdhaXQgSm91cm5leS5maW5kQnlJZEFuZERlbGV0ZShpZCk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YToge30gfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gQ29udGFjdFxyXG4gICAgYXBwLmdldCgnL2NvbnRhY3QnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFjdCA9IGF3YWl0IENvbnRhY3QuZmluZE9uZSgpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGNvbnRhY3QgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2NvbnRhY3QnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFjdCA9IGF3YWl0IENvbnRhY3QuZmluZE9uZUFuZFVwZGF0ZSh7fSwgcmVxLmJvZHksIHsgbmV3OiB0cnVlLCB1cHNlcnQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY29udGFjdCB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENWXHJcbiAgICBhcHAuZ2V0KCcvY3YnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY3YgPSBhd2FpdCBDVi5maW5kT25lKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY3YgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBhcHAucG9zdCgnL2N2JywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IENWLmRlbGV0ZU1hbnkoe30pO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdDViA9IG5ldyBDVihyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ld0NWLnNhdmUoKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBuZXdDViB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENhdGVnb3JpZXMgUm91dGVcclxuICAgIGFwcC5nZXQoJy9jYXRlZ29yaWVzJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gcmVxLnF1ZXJ5O1xyXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHR5cGUgPyB7IHR5cGUgfSA6IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yaWVzID0gYXdhaXQgQ2F0ZWdvcnkuZmluZChxdWVyeSkuc29ydCh7IG5hbWU6IDEgfSk7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY2F0ZWdvcmllcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENvbmZpZ1xyXG4gICAgYXBwLmdldCgnL2NvbmZpZycsIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGNsb3VkaW5hcnlDbG91ZE5hbWU6IHByb2Nlc3MuZW52LkNMT1VESU5BUllfQ0xPVURfTkFNRSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcHA7XHJcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRYLE9BQU8sVUFBVTtBQUM3WSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBbUM7OztBQ0ZzVSxPQUFPLGFBQW9DO0FBQzdaLE9BQU8sY0FBYztBQUNyQixPQUFPLFVBQVU7QUFDakIsT0FBTyxZQUFZO0FBSW5CLE9BQU8sT0FBTztBQUVQLFNBQVMsa0JBQWtCO0FBQzlCLFFBQU0sTUFBTSxRQUFRO0FBQ3BCLE1BQUksSUFBSSxLQUFLLENBQUM7QUFDZCxNQUFJLElBQUksUUFBUSxLQUFLLENBQUM7QUFHdEIsTUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDeEIsWUFBUSxJQUFJLEtBQUksb0JBQUksS0FBSyxHQUFFLFlBQVksQ0FBQyxLQUFLLElBQUksTUFBTSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ3BFLFNBQUs7QUFBQSxFQUNULENBQUM7QUFHRCxXQUFTLFFBQVEsUUFBUSxJQUFJLFNBQW1CLEVBQzNDLEtBQUssTUFBTSxRQUFRLElBQUksaUNBQWlDLENBQUMsRUFDekQsTUFBTSxTQUFPLFFBQVEsTUFBTSw2QkFBNkIsR0FBRyxDQUFDO0FBR2pFLFFBQU0sZ0JBQWdCLElBQUksU0FBUyxPQUFPO0FBQUEsSUFDdEMsT0FBTyxFQUFFLE1BQU0sUUFBUSxVQUFVLEtB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
