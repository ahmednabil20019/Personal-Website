import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Schemas
const AboutSchema = new mongoose.Schema({
  content: { type: String, required: true },
  title: String,
  subtitle: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  category: String,
  proficiency: { type: Number, default: 80 },
  createdAt: { type: Date, default: Date.now }
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Code' },
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  technologies: [String],
  category: String,
  liveUrl: String,
  githubUrl: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

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

const CVSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// Models
const About = mongoose.models.About || mongoose.model('About', AboutSchema);
const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
const CV = mongoose.models.CV || mongoose.model('CV', CVSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Test About Content
    const existingAbout = await About.findOne();
    if (!existingAbout) {
      await About.create({
        content: `I'm Ahmed Nabil, an Electronics & Telecommunications Engineer with a passion for modern web development and innovative engineering solutions. I specialize in creating scalable applications and solving complex technical challenges.

My expertise spans across frontend and backend development, with strong knowledge in telecommunications systems, electronics design, and software engineering. I enjoy working with cutting-edge technologies and contributing to projects that make a real impact.

When I'm not coding or working on engineering projects, I love exploring new technologies, contributing to open-source projects, and sharing knowledge with the developer community.`,
        title: 'About Me',
        subtitle: 'Electronics & Telecommunications Engineer'
      });
      console.log('✅ Created about content');
    }

    // Test Skills
    const testSkills = [
      { name: 'JavaScript', icon: 'SiJavascript', category: 'Frontend', proficiency: 90 },
      { name: 'React', icon: 'SiReact', category: 'Frontend', proficiency: 85 },
      { name: 'Node.js', icon: 'SiNodedotjs', category: 'Backend', proficiency: 80 },
      { name: 'Python', icon: 'SiPython', category: 'Backend', proficiency: 85 },
      { name: 'MongoDB', icon: 'SiMongodb', category: 'Database', proficiency: 75 },
      { name: 'Electronics Design', icon: 'SiArduino', category: 'Engineering', proficiency: 90 },
      { name: 'Telecommunications', icon: 'SiCisco', category: 'Engineering', proficiency: 85 },
      { name: 'Circuit Analysis', icon: 'SiSimilarweb', category: 'Engineering', proficiency: 88 }
    ];

    for (const skill of testSkills) {
      const existing = await Skill.findOne({ name: skill.name });
      if (!existing) {
        await Skill.create(skill);
        console.log(`✅ Created skill: ${skill.name}`);
      }
    }

    // Test Services
    const testServices = [
      {
        title: 'Web Development',
        description: 'Full-stack web application development using modern technologies like React, Node.js, and cloud services.',
        icon: 'Globe'
      },
      {
        title: 'Electronics Design',
        description: 'Circuit design, PCB layout, and embedded systems development for various engineering applications.',
        icon: 'Cpu'
      },
      {
        title: 'Telecommunications Solutions',
        description: 'Network design, communication systems, and telecommunications infrastructure planning and implementation.',
        icon: 'Radio'
      },
      {
        title: 'Technical Consulting',
        description: 'Expert consultation on electronics, telecommunications, and software development projects.',
        icon: 'Users'
      }
    ];

    for (const service of testServices) {
      const existing = await Service.findOne({ title: service.title });
      if (!existing) {
        await Service.create(service);
        console.log(`✅ Created service: ${service.title}`);
      }
    }

    // Test Projects
    const testProjects = [
      {
        title: 'Smart Home IoT System',
        description: 'Complete IoT solution for home automation with mobile app control, sensor integration, and cloud connectivity.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        technologies: ['Arduino', 'React Native', 'Node.js', 'MongoDB', 'IoT'],
        category: 'IoT/Electronics',
        liveUrl: 'https://smarthome-demo.netlify.app',
        githubUrl: 'https://github.com/mahmoud-hegazi/smart-home',
        featured: true
      },
      {
        title: 'Telecommunications Network Analyzer',
        description: 'Network analysis tool for telecommunications systems with real-time monitoring and performance optimization.',
        images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800'],
        technologies: ['Python', 'Flask', 'PostgreSQL', 'D3.js', 'Network Protocols'],
        category: 'Telecommunications',
        liveUrl: 'https://network-analyzer.herokuapp.com',
        githubUrl: 'https://github.com/mahmoud-hegazi/network-analyzer',
        featured: true
      },
      {
        title: 'Portfolio Website',
        description: 'Modern, responsive portfolio website with admin panel, 3D elements, and dynamic content management.',
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
        technologies: ['React', 'TypeScript', 'Three.js', 'Node.js', 'MongoDB'],
        category: 'Web Development',
        liveUrl: 'https://mahmoud-hegazi.vercel.app',
        githubUrl: 'https://github.com/M7mod-hegazy/my_portofolio2025',
        featured: true
      }
    ];

    for (const project of testProjects) {
      const existing = await Project.findOne({ title: project.title });
      if (!existing) {
        await Project.create(project);
        console.log(`✅ Created project: ${project.title}`);
      }
    }

    // Test Contact Information
    const existingContact = await Contact.findOne();
    if (!existingContact) {
      await Contact.create({
        email: 'mahmoud.hegazi@example.com',
        phone: '+20 123 456 7890',
        location: 'Cairo, Egypt',
        website: 'https://mahmoud-hegazi.vercel.app',
        linkedin: 'https://linkedin.com/in/mahmoud-hegazi',
        github: 'https://github.com/M7mod-hegazy',
        twitter: 'https://twitter.com/mahmoud_hegazi',
        instagram: 'https://instagram.com/mahmoud_hegazi',
        facebook: 'https://facebook.com/mahmoud.hegazi',
        whatsapp: '+201234567890',
        messenger: 'https://m.me/mahmoud.hegazi'
      });
      console.log('✅ Created contact information');
    }

    res.status(200).json({ 
      success: true, 
      message: 'Test data seeded successfully! Your portfolio now has sample content.' 
    });

  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to seed data', 
      error: error.message 
    });
  }
}
