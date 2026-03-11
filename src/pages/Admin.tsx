import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PortfolioItemForm } from '@/components/PortfolioItemForm';
import { ImageUpload } from '@/components/ImageUpload';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code, Server, Paintbrush, Bot, Plus, Edit, Trash2, Save, Upload,
  Users, Briefcase, Award, FileText, Settings, BarChart3, Eye,
  Search, Filter, Grid, List, Calendar, Star, TrendingUp, MapPin,
  Trophy, GraduationCap, Globe, Menu, X, GripVertical
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import * as SimpleIcons from "react-icons/si";
import { Tooltip } from '@/components/ui/tooltip';
import React from 'react';

// Define interfaces
interface Skill {
  _id?: string;
  name: string;
  icon: string;
  category?: string;
  level?: string;
}
interface Project {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  image?: string;
  // Optional internal fields
  description?: string;
  imageUrl?: string;
  skills?: string[];
  category?: string;
}

interface JourneyItem {
  _id?: string;
  title: string;
  company: string;
  location: string;
  year: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'work' | 'education' | 'project';
  createdAt?: string;
  updatedAt?: string;
}

interface ContactInfo {
  _id?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  messenger?: string;
}

function getSimpleIconName(skillName: string) {
  if (!skillName) return '';
  const lower = skillName.trim().toLowerCase();
  // AI
  if (["ai", "artificial intelligence"].includes(lower)) return "SiAirtable"; // No AI icon, use closest
  if (["ml", "machine learning"].includes(lower)) return "SiTensorflow";
  if (["deep learning", "dl"].includes(lower)) return "SiKeras";
  if (["pytorch"].includes(lower)) return "SiPytorch";
  if (["tensorflow"].includes(lower)) return "SiTensorflow";
  if (["opencv"].includes(lower)) return "SiOpencv";
  if (["scikit-learn", "sklearn"].includes(lower)) return "SiScikitlearn";
  if (["nlp"].includes(lower)) return "SiSpacy";
  if (["huggingface", "transformers"].includes(lower)) return "SiHuggingface";
  // Marketing
  if (["seo"].includes(lower)) return "SiGoogleanalytics";
  if (["semrush"].includes(lower)) return "SiSemrush";
  if (["mailchimp"].includes(lower)) return "SiMailchimp";
  if (["google ads", "adwords"].includes(lower)) return "SiGoogleads";
  if (["facebook ads"].includes(lower)) return "SiFacebook";
  if (["hubspot"].includes(lower)) return "SiHubspot";
  if (["salesforce"].includes(lower)) return "SiSalesforce";
  // Telecom
  if (["telecom", "telecommunications"].includes(lower)) return "SiCisco";
  if (["cisco"].includes(lower)) return "SiCisco";
  if (["huawei"].includes(lower)) return "SiHuawei";
  if (["ericsson"].includes(lower)) return "SiEricsson";
  if (["5g"].includes(lower)) return "SiQualcomm";
  if (["lte", "4g"].includes(lower)) return "SiQualcomm";
  if (["gsm"].includes(lower)) return "SiSiemens";
  if (["rf", "radio frequency"].includes(lower)) return "SiMotorola";
  // Common web/dev techs
  if (["html", "html5"].includes(lower)) return "SiHtml5";
  if (["css", "css3"].includes(lower)) return "SiCss3";
  if (["js", "javascript", "ecmascript", "es6"].includes(lower)) return "SiJavascript";
  if (["ts", "typescript"].includes(lower)) return "SiTypescript";
  if (["react", "reactjs"].includes(lower)) return "SiReact";
  if (["vue", "vuejs", "vue.js"].includes(lower)) return "SiVuedotjs";
  if (["angular"].includes(lower)) return "SiAngular";
  if (["node", "nodejs", "node.js"].includes(lower)) return "SiNodedotjs";
  if (["express", "expressjs", "express.js"].includes(lower)) return "SiExpress";
  if (["next", "nextjs", "next.js"].includes(lower)) return "SiNextdotjs";
  if (["nuxt", "nuxtjs", "nuxt.js"].includes(lower)) return "SiNuxtdotjs";
  if (["svelte", "sveltekit"].includes(lower)) return "SiSvelte";
  if (["python"].includes(lower)) return "SiPython";
  if (["django"].includes(lower)) return "SiDjango";
  if (["flask"].includes(lower)) return "SiFlask";
  if (["mongodb", "mongo"].includes(lower)) return "SiMongodb";
  if (["mysql"].includes(lower)) return "SiMysql";
  if (["postgres", "postgresql"].includes(lower)) return "SiPostgresql";
  if (["firebase"].includes(lower)) return "SiFirebase";
  if (["cloudinary"].includes(lower)) return "SiCloudinary";
  if (["git"].includes(lower)) return "SiGit";
  if (["github"].includes(lower)) return "SiGithub";
  if (["docker"].includes(lower)) return "SiDocker";
  if (["kubernetes", "k8s"].includes(lower)) return "SiKubernetes";
  if (["aws", "amazon web services"].includes(lower)) return "SiAmazonaws";
  if (["azure"].includes(lower)) return "SiMicrosoftazure";
  if (["gcp", "google cloud", "google cloud platform"].includes(lower)) return "SiGooglecloud";
  if (["c", "c language"].includes(lower)) return "SiC";
  if (["c++", "cpp"].includes(lower)) return "SiCplusplus";
  if (["c#", "csharp"].includes(lower)) return "SiCsharp";
  if (["java"].includes(lower)) return "SiJava";
  if (["php"].includes(lower)) return "SiPhp";
  if (["go", "golang"].includes(lower)) return "SiGo";
  if (["rust"].includes(lower)) return "SiRust";
  if (["swift"].includes(lower)) return "SiSwift";
  if (["android"].includes(lower)) return "SiAndroid";
  if (["ios"].includes(lower)) return "SiApple";
  if (["figma"].includes(lower)) return "SiFigma";
  if (["xd", "adobe xd"].includes(lower)) return "SiAdobexd";
  if (["photoshop", "adobe photoshop"].includes(lower)) return "SiAdobephotoshop";
  if (["illustrator", "adobe illustrator"].includes(lower)) return "SiAdobeillustrator";
  if (["tailwind", "tailwindcss"].includes(lower)) return "SiTailwindcss";
  if (["bootstrap"].includes(lower)) return "SiBootstrap";
  if (["material ui", "mui"].includes(lower)) return "SiMaterialui";
  if (["redux"].includes(lower)) return "SiRedux";
  if (["graphql"].includes(lower)) return "SiGraphql";
  if (["sass", "scss"].includes(lower)) return "SiSass";
  if (["less"].includes(lower)) return "SiLess";
  if (["webpack"].includes(lower)) return "SiWebpack";
  if (["babel"].includes(lower)) return "SiBabel";
  if (["eslint"].includes(lower)) return "SiEslint";
  if (["prettier"].includes(lower)) return "SiPrettier";
  if (["npm"].includes(lower)) return "SiNpm";
  if (["yarn"].includes(lower)) return "SiYarn";
  if (["pnpm"].includes(lower)) return "SiPnpm";
  // Default: capitalize first letter, prefix with 'Si'
  return 'Si' + skillName.charAt(0).toUpperCase() + skillName.slice(1);
}

const Admin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]); // Changed to any[] as Project type is removed
  const [certifications, setCertifications] = useState<Certification[]>([]); // Changed to any[] as Certification type is removed
  const [editingItem, setEditingItem] = useState<Partial<Project | Certification> | null>(null); // Changed to any
  const [itemType, setItemType] = useState<'Project' | 'Certification' | null>(null);
  const [cvFile, setCvFile] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [itemToDelete, setItemToDelete] = useState<Partial<Project | Certification> & { _id?: string } | null>(null); // Changed to any
  const [isLoading, setIsLoading] = useState(false);
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // New state for dynamic sections
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({ name: '', icon: '', category: '', level: 'Intermediate' });
  // Remove autoSkillIcon state and checkbox
  // Always update icon when skill name changes
  const [aboutContent, setAboutContent] = useState('');
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', icon: '' });

  const [roadmapData, setRoadmapData] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('');
  const [showSkillForm, setShowSkillForm] = useState(false);

  // Project management states
  const [projectCategories, setProjectCategories] = useState<string[]>([]);
  const [newProjectCategory, setNewProjectCategory] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    images: [],
    technologies: [],
    category: '',
    liveUrl: '',
    githubUrl: '',
    featured: false
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Certification management states
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [newCertification, setNewCertification] = useState<Certification>({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    verificationUrl: '',
    image: ''
  });
  const [certificationImage, setCertificationImage] = useState<string>('');

  // Journey management states
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
  const [showJourneyForm, setShowJourneyForm] = useState(false);
  const [editingJourneyItem, setEditingJourneyItem] = useState<JourneyItem | null>(null);
  const [newJourneyItem, setNewJourneyItem] = useState<JourneyItem>({
    title: '',
    company: '',
    location: '',
    year: '',
    period: '',
    description: '',
    achievements: [],
    technologies: [],
    type: 'work'
  });

  // Contact management states
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    messenger: ''
  });
  const [currentCV, setCurrentCV] = useState<{ url: string; filename?: string; updatedAt: string } | null>(null);
  const [autoServiceIcon, setAutoServiceIcon] = useState([false, false, false, false]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [filteredSkillSuggestions, setFilteredSkillSuggestions] = useState<Skill[]>([]);

  // Replace local skillCategories state with backend fetch
  const [skillCategories, setSkillCategories] = useState<string[]>([]);
  const [newSkillCategory, setNewSkillCategory] = useState("");

  // Add loading state for skill add/edit
  const [isSkillLoading, setIsSkillLoading] = useState(false);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch skill categories
        try {
          const categoriesRes = await fetch('/api/categories?type=skill');
          if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            if (categoriesData.success && categoriesData.data) {
              setSkillCategories(categoriesData.data.map((cat: any) => cat.name));
            }
          }
        } catch (error) {
          console.error('Error fetching skill categories:', error);
          // Set default categories for development
          setSkillCategories(['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile']);
        }

        // Fetch project categories
        try {
          const projectCategoriesRes = await fetch('/api/categories?type=project');
          if (projectCategoriesRes.ok) {
            const projectCategoriesData = await projectCategoriesRes.json();
            if (projectCategoriesData.success && projectCategoriesData.data) {
              setProjectCategories(projectCategoriesData.data.map((cat: any) => cat.name));
            }
          }
        } catch (error) {
          console.error('Error fetching project categories:', error);
          // Set default project categories for development
          setProjectCategories(['Web Application', 'Mobile App', 'Desktop App', 'API/Backend', 'Library/Package', 'Tool/Utility']);
        }

        // Fetch skills
        try {
          await fetchSkillsData();
        } catch (error) {
          console.error('Error fetching skills:', error);
        }

        // Fetch services
        try {
          await fetchServicesData();
        } catch (error) {
          console.error('Error fetching services:', error);
        }

        // Fetch about content
        try {
          const aboutRes = await fetch('/api/about');
          if (aboutRes.ok) {
            const aboutData = await aboutRes.json();
            if (aboutData.success && aboutData.data) {
              setAboutContent(aboutData.data.content || '');
            }
          }
        } catch (error) {
          console.error('Error fetching about content:', error);
          // Set default about content for development
          setAboutContent('Welcome to my portfolio! I am a passionate developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through code.');
        }

        // Fetch journey items
        try {
          const journeyRes = await fetch('/api/journey');
          if (journeyRes.ok) {
            const journeyData = await journeyRes.json();
            if (journeyData.success && journeyData.data) {
              setJourneyItems(journeyData.data);
            }
          }
        } catch (error) {
          console.error('Error fetching journey items:', error);
          // Set default journey items for development
          setJourneyItems([]);
        }

        // Fetch contact info
        try {
          const contactRes = await fetch('/api/contact');
          if (contactRes.ok) {
            const contactData = await contactRes.json();
            if (contactData.success && contactData.data) {
              setContactInfo(contactData.data);
            }
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
          // Keep default empty contact info
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, []);

  // Fetch projects (refactored for reuse)
  const fetchProjects = async () => {
    try {
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();
      if (projectsData.success) setProjects(projectsData.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const fetchCertifications = async () => {
    try {
      const certsRes = await fetch('/api/certifications');
      const certsData = await certsRes.json();
      if (certsData.success) setCertifications(certsData.data);
    } catch (error) {
      console.error("Failed to fetch certifications", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // Fetch Cloudinary config
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(config => {
        if (config.success) {
          setCloudinaryCloudName(config.data.cloudinaryCloudName);
        }
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllData = async () => {
        setIsLoading(true);
        try {
          const [projectsRes, certsRes, catsRes, skillsRes, aboutRes, servicesRes, cvRes] = await Promise.all([
            fetch('/api/projects'),
            fetch('/api/certifications'),
            fetch('/api/categories'),
            fetch('/api/skills'),
            fetch('/api/about'),
            fetch('/api/services'),
            fetch('/api/cv'),
          ]);

          const projectsData = await projectsRes.json();
          if (projectsData.success) setProjects(projectsData.data);

          const certsData = await certsRes.json();
          if (certsData.success) setCertifications(certsData.data);

          const catsData = await catsRes.json();
          if (catsData.success) setCategories(catsData.data);

          const skillsData = await skillsRes.json();
          if (skillsData.success) setSkills(skillsData.data);

          const aboutData = await aboutRes.json();
          if (aboutData.success && aboutData.data) setAboutContent(aboutData.data.content);

          const servicesData = await servicesRes.json();
          if (servicesData.success) {
            setServices(servicesData.data || []);
          }

          const cvData = await cvRes.json();
          if (cvData.success && cvData.data) {
            setCurrentCV(cvData.data);
          }
        } catch (error) {
          console.error("Failed to fetch admin data", error);
        }
        setIsLoading(false);
      };
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Always update icon using getSimpleIconName when skill name changes
  useEffect(() => {
    if (newSkill.name) {
      setNewSkill(skill => ({ ...skill, icon: getSimpleIconName(skill.name) }));
    }
  }, [newSkill.name]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === 'm7mod' && password === '275757') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };







  const handleSaveItem = async (item: Partial<Project | Certification>) => { // Changed to any
    setIsLoading(true);
    const isProject = itemType === 'Project';
    const endpoint = isProject ? `/api/projects` : `/api/certifications`;
    const hasId = !!item._id; // Use _id for MongoDB
    const url = hasId ? `${endpoint}/${item._id}` : endpoint;
    const method = hasId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        if (isProject) {
          fetchProjects(); // Refresh the list
        } else {
          fetchCertifications(); // Refresh the list
        }
      } else {
        console.error('Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }

    setEditingItem(null);
    setItemType(null);
    setIsLoading(false);
  };

  const handleDeleteRequest = (item: Partial<Project | Certification> & { _id?: string }) => { // Changed to any
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);

    const isProject = 'category' in itemToDelete; // Simple type guard
    const endpoint = isProject ? `/api/projects/${itemToDelete._id}` : `/api/certifications/${itemToDelete._id}`;

    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (response.ok) {
        if (isProject) {
          fetchProjects();
        } else {
          fetchCertifications();
        }
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setItemToDelete(null);
      setIsLoading(false);
    }
  };

  const handleSaveCv = async () => {
    if (cvFile.length === 0) {
      alert("Please select a CV to upload.");
      return;
    }
    if (!cloudinaryCloudName) {
      alert("Cloudinary config not loaded yet. Please wait a moment and try again.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', cvFile[0]);
    formData.append('upload_preset', 'portofolio'); // Make sure this is correct

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const cvUrl = data.secure_url;

    if (cvUrl) {
      const saveRes = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cvUrl }),
      });

      if (saveRes.ok) {
        // Refresh the current CV
        const cvRes = await fetch('/api/cv');
        const cvData = await cvRes.json();
        if (cvData.success && cvData.data) {
          setCurrentCV(cvData.data);
        }

        // Clear the form
        setCvFile([]);
        alert("CV uploaded successfully!");
      } else {
        alert("Failed to save CV. Please try again.");
      }
    } else {
      alert("Failed to upload CV to Cloudinary. Please try again.");
    }
    setIsLoading(false);
  };



  const handleSaveServices = async () => {
    setIsLoading(true);
    await Promise.all(services.map(s => fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    })));
    setIsLoading(false);
    alert('Services section updated!');
  };

  const fetchAiIcon = async (name: string) => {
    // Placeholder: In production, call your AI API here
    // For demo, just return a simple mapping or the first word
    if (!name) return '';
    const map: Record<string, string> = {
      react: 'react',
      node: 'server',
      python: 'bot',
      javascript: 'code',
      docker: 'server',
      aws: 'server',
      git: 'code',
      figma: 'paintbrush',
    };
    const key = name.toLowerCase().split(' ')[0];
    return map[key] || 'code';
  };

  const handleSkillChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
    // Always update icon when skill name changes
    if (name === 'name') {
      const icon = await fetchAiIcon(value);
      setNewSkill((prev) => ({ ...prev, icon }));
    }
  };

  // Add function to handle edit click
  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkill({ ...skill });
  };





  const handleServiceChange = async (index: number, field: string, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
    if (autoServiceIcon[index] && field === 'title') {
      const icon = await fetchAiIcon(value);
      updatedServices[index].icon = icon;
      setServices([...updatedServices]);
    }
  };

  const handleServiceAutoIcon = (index: number, checked: boolean) => {
    const updated = [...autoServiceIcon];
    updated[index] = checked;
    setAutoServiceIcon(updated);
    // If enabling, trigger icon suggestion
    if (checked && services[index].title) {
      fetchAiIcon(services[index].title).then(icon => {
        const updatedServices = [...services];
        updatedServices[index].icon = icon;
        setServices(updatedServices);
      });
    }
  };

  // Add recommendedSkills array for autocomplete
  const recommendedSkills: Skill[] = [
    { name: "React", icon: "SiReact", category: "Frontend" },
    { name: "HTML5", icon: "SiHtml5", category: "Frontend" },
    { name: "CSS3", icon: "SiCss3", category: "Frontend" },
    { name: "JavaScript", icon: "SiJavascript", category: "Frontend" },
    { name: "Python", icon: "SiPython", category: "Backend" },
    { name: "TensorFlow", icon: "SiTensorflow", category: "AI" },
    { name: "PyTorch", icon: "SiPytorch", category: "AI" },
    { name: "HuggingFace", icon: "SiHuggingface", category: "AI" },
    { name: "SEO", icon: "SiGoogleanalytics", category: "Marketing" },
    { name: "Cisco", icon: "SiCisco", category: "Telecom" },
    { name: "Huawei", icon: "SiHuawei", category: "Telecom" },
    // ...add more as needed...
  ];

  // Dynamic icon generation based on skill name
  const generateIconForSkill = (skillName: string): string => {
    const name = skillName.toLowerCase();
    const iconMap: { [key: string]: string } = {
      // Frontend
      'react': 'SiReact',
      'vue': 'SiVuedotjs',
      'angular': 'SiAngular',
      'javascript': 'SiJavascript',
      'typescript': 'SiTypescript',
      'html': 'SiHtml5',
      'css': 'SiCss3',
      'sass': 'SiSass',
      'tailwind': 'SiTailwindcss',
      'bootstrap': 'SiBootstrap',
      'jquery': 'SiJquery',
      'webpack': 'SiWebpack',
      'vite': 'SiVite',

      // Backend
      'node': 'SiNodedotjs',
      'nodejs': 'SiNodedotjs',
      'express': 'SiExpress',
      'python': 'SiPython',
      'django': 'SiDjango',
      'flask': 'SiFlask',
      'java': 'SiJava',
      'spring': 'SiSpring',
      'php': 'SiPhp',
      'laravel': 'SiLaravel',
      'ruby': 'SiRuby',
      'rails': 'SiRubyonrails',
      'go': 'SiGo',
      'rust': 'SiRust',
      'c++': 'SiCplusplus',
      'c#': 'SiCsharp',
      'dotnet': 'SiDotnet',

      // Databases
      'mongodb': 'SiMongodb',
      'mysql': 'SiMysql',
      'postgresql': 'SiPostgresql',
      'redis': 'SiRedis',
      'sqlite': 'SiSqlite',
      'firebase': 'SiFirebase',
      'supabase': 'SiSupabase',

      // Cloud & DevOps
      'aws': 'SiAmazonaws',
      'azure': 'SiMicrosoftazure',
      'gcp': 'SiGooglecloud',
      'docker': 'SiDocker',
      'kubernetes': 'SiKubernetes',
      'jenkins': 'SiJenkins',
      'git': 'SiGit',
      'github': 'SiGithub',
      'gitlab': 'SiGitlab',
      'vercel': 'SiVercel',
      'netlify': 'SiNetlify',

      // Mobile
      'react native': 'SiReact',
      'flutter': 'SiFlutter',
      'dart': 'SiDart',
      'swift': 'SiSwift',
      'kotlin': 'SiKotlin',
      'android': 'SiAndroid',
      'ios': 'SiIos',

      // Tools
      'figma': 'SiFigma',
      'photoshop': 'SiAdobephotoshop',
      'illustrator': 'SiAdobeillustrator',
      'xd': 'SiAdobexd',
      'sketch': 'SiSketch',
      'vscode': 'SiVisualstudiocode',
      'postman': 'SiPostman',
      'insomnia': 'SiInsomnia',
    };

    // Try exact match first
    if (iconMap[name]) {
      return iconMap[name];
    }

    // Try partial matches
    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key) || key.includes(name)) {
        return icon;
      }
    }

    // Default fallback
    return 'SiCode';
  };

  // Auto-generate icon when skill name changes
  const handleSkillNameChange = (name: string) => {
    const icon = generateIconForSkill(name);
    setNewSkill(prev => ({ ...prev, name, icon }));
  };

  // Filter skills before displaying
  const filteredSkills = skills.filter(skill =>
    (!skillSearch || skill.name.toLowerCase().includes(skillSearch.toLowerCase())) &&
    (!skillCategoryFilter || skill.category === skillCategoryFilter)
  );

  // Enhanced handler functions with full API integration
  const handleDeleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setServices(services.filter(service => service._id !== serviceId));
        alert('Service deleted successfully!');
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  };



  const handleDeleteSkill = async (skillId: string) => {
    try {
      const response = await fetch(`/api/skills?id=${skillId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSkills(skills.filter(skill => skill._id !== skillId));
        alert('Skill deleted successfully!');
      } else {
        alert('Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill');
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name || !newSkill.category) return;

    try {
      if (editingSkill) {
        // Update existing skill
        const response = await fetch(`/api/skills?id=${editingSkill._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSkill),
        });

        if (response.ok) {
          const result = await response.json();
          setSkills(skills.map(s => s._id === editingSkill._id ? result.data : s));
          alert('Skill updated successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update skill');
        }
      } else {
        // Add new skill
        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSkill),
        });

        if (response.ok) {
          const result = await response.json();
          setSkills([...skills, result.data]);
          alert('Skill added successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to add skill');
        }
      }

      // Close modal and reset form
      setShowSkillForm(false);
      setEditingSkill(null);
      setNewSkill({ name: '', icon: '', category: '', level: 'Intermediate' });
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Error saving skill');
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title || !newService.description) return;

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        const result = await response.json();
        setServices([...services, result.data]);
        setNewService({ title: '', description: '', icon: '' });
        alert('Service added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Error adding service');
    }
  };



  const fetchSkillsData = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSkills(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Set some default skills for development
      setSkills([
        { _id: '1', name: 'React', icon: 'SiReact', category: 'Frontend', level: 'Advanced' },
        { _id: '2', name: 'Node.js', icon: 'SiNodedotjs', category: 'Backend', level: 'Intermediate' },
        { _id: '3', name: 'MongoDB', icon: 'SiMongodb', category: 'Database', level: 'Intermediate' }
      ]);
    }
  };

  const fetchServicesData = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setServices(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Set some default services for development
      setServices([
        { _id: '1', title: 'Web Development', description: 'Full-stack web application development', icon: 'Code' },
        { _id: '2', title: 'UI/UX Design', description: 'Modern and responsive user interface design', icon: 'Paintbrush' }
      ]);
    }
  };

  const handleSaveAbout = async () => {
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: aboutContent }),
      });

      if (response.ok) {
        alert('About content saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save about content');
      }
    } catch (error) {
      console.error('Error saving about content:', error);
      alert('Error saving about content');
    }
  };

  const handleAddCategory = async () => {
    if (!newSkillCategory.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSkillCategory.trim(),
          type: 'skill'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSkillCategories([...skillCategories, result.data.name]);
        setNewSkillCategory('');
        alert('Category added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      // Find the category by name first
      const categoriesRes = await fetch('/api/categories?type=skill');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const category = categoriesData.data.find((cat: any) => cat.name === categoryName);

        if (category) {
          const response = await fetch(`/api/categories?id=${category._id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setSkillCategories(skillCategories.filter(cat => cat !== categoryName));
            alert('Category deleted successfully!');
          } else {
            alert('Failed to delete category');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  // Project category management functions
  const handleAddProjectCategory = async () => {
    if (!newProjectCategory.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectCategory.trim(),
          type: 'project'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProjectCategories([...projectCategories, result.data.name]);
        setNewProjectCategory('');
        alert('Project category added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add project category');
      }
    } catch (error) {
      console.error('Error adding project category:', error);
      alert('Error adding project category');
    }
  };

  const handleDeleteProjectCategory = async (categoryName: string) => {
    try {
      const categoriesRes = await fetch('/api/categories?type=project');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const category = categoriesData.data.find((cat: any) => cat.name === categoryName);

        if (category) {
          const response = await fetch(`/api/categories?id=${category._id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setProjectCategories(projectCategories.filter(cat => cat !== categoryName));
            alert('Project category deleted successfully!');
          } else {
            alert('Failed to delete project category');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting project category:', error);
      alert('Error deleting project category');
    }
  };

  // Image upload functions
  const handleImageUpload = async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newImageUrls = result.data.map((item: any) => item.url);
        setUploadedImages(prev => [...prev, ...newImageUrls]);
        setNewProject(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
        alert(`${newImageUrls.length} image(s) uploaded successfully!`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        handleImageUpload(imageFiles);
      } else {
        alert('Please upload only image files');
      }
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl));
    setNewProject(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== imageUrl)
    }));
  };

  // Project CRUD functions
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description || !newProject.category) return;

    try {
      if (editingProject) {
        // Update existing project
        const response = await fetch(`/api/projects?id=${editingProject._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProject),
        });

        if (response.ok) {
          const result = await response.json();
          setProjects(projects.map(p => p._id === editingProject._id ? result.data : p));
          alert('Project updated successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update project');
        }
      } else {
        // Add new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProject),
        });

        if (response.ok) {
          const result = await response.json();
          setProjects([...projects, result.data]);
          alert('Project added successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to add project');
        }
      }

      // Close modal and reset form
      setShowProjectForm(false);
      setEditingProject(null);
      setNewProject({
        title: '',
        description: '',
        images: [],
        technologies: [],
        category: '',
        liveUrl: '',
        githubUrl: '',
        featured: false
      });
      setUploadedImages([]);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(projects.filter(project => project._id !== projectId));
        alert('Project deleted successfully!');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleReorderProjects = async (newOrder: Project[]) => {
    // Optimistically update UI
    setProjects(newOrder);

    try {
      console.log('Reordering projects:', newOrder.map(p => p.title));
      const items = newOrder.map((p, index) => ({ id: p._id, order: index }));

      const response = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving project order:', error);
      // Optionally revert state here if needed, but for now just log
    }
  };

  // Certification CRUD functions
  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertification.title || !newCertification.issuer) return;

    try {
      if (editingCertification) {
        // Update existing certification
        const response = await fetch(`/api/certifications?id=${editingCertification._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCertification),
        });

        if (response.ok) {
          const result = await response.json();
          setCertifications(certifications.map(c => c._id === editingCertification._id ? result.data : c));
          alert('Certification updated successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update certification');
        }
      } else {
        // Add new certification
        const response = await fetch('/api/certifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCertification),
        });

        if (response.ok) {
          const result = await response.json();
          setCertifications([...certifications, result.data]);
          alert('Certification added successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to add certification');
        }
      }

      // Close modal and reset form
      setShowCertificationForm(false);
      setEditingCertification(null);
      setNewCertification({
        title: '',
        issuer: '',
        date: '',
        credentialId: '',
        verificationUrl: '',
        image: ''
      });
      setCertificationImage('');
    } catch (error) {
      console.error('Error saving certification:', error);
      alert('Error saving certification');
    }
  };

  const handleDeleteCertification = async (certificationId: string) => {
    try {
      const response = await fetch(`/api/certifications?id=${certificationId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCertifications(certifications.filter(cert => cert._id !== certificationId));
        alert('Certification deleted successfully!');
      } else {
        alert('Failed to delete certification');
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Error deleting certification');
    }
  };

  // Certification image upload
  const handleCertificationImageUpload = async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.data[0].url;
        setCertificationImage(imageUrl);
        setNewCertification(prev => ({ ...prev, image: imageUrl }));
        alert('Image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  // Journey CRUD functions
  const handleAddJourneyItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJourneyItem.title || !newJourneyItem.company) return;

    try {
      if (editingJourneyItem) {
        // Update existing journey item
        const response = await fetch(`/api/journey?id=${editingJourneyItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newJourneyItem),
        });

        if (response.ok) {
          const result = await response.json();
          setJourneyItems(journeyItems.map(j => j._id === editingJourneyItem._id ? result.data : j));
          alert('Journey item updated successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update journey item');
        }
      } else {
        // Add new journey item
        const response = await fetch('/api/journey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newJourneyItem),
        });

        if (response.ok) {
          const result = await response.json();
          setJourneyItems([...journeyItems, result.data]);
          alert('Journey item added successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to add journey item');
        }
      }

      // Close modal and reset form
      setShowJourneyForm(false);
      setEditingJourneyItem(null);
      setNewJourneyItem({
        title: '',
        company: '',
        location: '',
        year: '',
        period: '',
        description: '',
        achievements: [],
        technologies: [],
        type: 'work'
      });
    } catch (error) {
      console.error('Error saving journey item:', error);
      alert('Error saving journey item');
    }
  };

  const handleDeleteJourneyItem = async (journeyId: string) => {
    try {
      const response = await fetch(`/api/journey?id=${journeyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setJourneyItems(journeyItems.filter(item => item._id !== journeyId));
        alert('Journey item deleted successfully!');
      } else {
        alert('Failed to delete journey item');
      }
    } catch (error) {
      console.error('Error deleting journey item:', error);
      alert('Error deleting journey item');
    }
  };

  // Contact CRUD functions
  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      if (response.ok) {
        const result = await response.json();
        setContactInfo(result.data);
        alert('Contact information updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update contact information');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert('Error updating contact information');
    }
  };

  // Dashboard Stats Component
  const DashboardStats = () => {
    const stats = [
      {
        title: 'Total Projects',
        value: projects.length,
        icon: <Briefcase className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        change: '+12%'
      },
      {
        title: 'Certifications',
        value: certifications.length,
        icon: <Award className="w-6 h-6" />,
        color: 'from-green-500 to-green-600',
        change: '+8%'
      },
      {
        title: 'Skills',
        value: skills.length,
        icon: <Code className="w-6 h-6" />,
        color: 'from-purple-500 to-purple-600',
        change: '+15%'
      },
      {
        title: 'Categories',
        value: skillCategories.length,
        icon: <Grid className="w-6 h-6" />,
        color: 'from-orange-500 to-orange-600',
        change: '+5%'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-2">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Admin Portal
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Access your portfolio dashboard
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background/50 border-primary/20 focus:border-primary"
                    placeholder="Enter your username"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border-primary/20 focus:border-primary"
                    placeholder="Enter your password"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg shadow-lg">
                    Sign In
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
              <p className="text-muted-foreground font-medium">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Manage your portfolio content and settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString()}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Eye className="w-4 h-4 mr-2" />
                Admin View
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Enhanced Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

            {/* MOBILE HEADER & DRAWER (Visible on < lg) */}
            <div className="lg:hidden flex items-center justify-between mb-6 sticky top-0 z-40 bg-background/80 backdrop-blur-xl p-4 -mx-6 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                  {activeTab === 'overview' && <BarChart3 className="w-5 h-5 text-white" />}
                  {activeTab === 'about' && <Users className="w-5 h-5 text-white" />}
                  {activeTab === 'skills' && <Code className="w-5 h-5 text-white" />}
                  {activeTab === 'projects' && <Briefcase className="w-5 h-5 text-white" />}
                  {activeTab === 'certifications' && <Award className="w-5 h-5 text-white" />}
                  {activeTab === 'journey' && <MapPin className="w-5 h-5 text-white" />}
                  {activeTab === 'contact' && <Users className="w-5 h-5 text-white" />}
                  {activeTab === 'cv' && <FileText className="w-5 h-5 text-white" />}
                </div>
                <span className="font-bold text-lg capitalize">{activeTab}</span>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="border border-primary/20">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-primary/20 bg-background/95 backdrop-blur-xl p-0">
                  <div className="p-6 border-b border-primary/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Menu
                    </h2>
                  </div>
                  <div className="flex flex-col p-4 gap-2">
                    {[
                      { id: 'overview', icon: BarChart3, label: 'Overview' },
                      { id: 'about', icon: Users, label: 'About' },
                      { id: 'skills', icon: Code, label: 'Skills' },
                      { id: 'projects', icon: Briefcase, label: 'Projects' },
                      { id: 'certifications', icon: Award, label: 'Certificates' },
                      { id: 'journey', icon: MapPin, label: 'Journey' },
                      { id: 'contact', icon: Users, label: 'Contact' },
                      { id: 'cv', icon: FileText, label: 'CV' },
                    ].map((item) => (
                      <SheetClose key={item.id} asChild>
                        <Button
                          variant={activeTab === item.id ? "default" : "ghost"}
                          onClick={() => setActiveTab(item.id)}
                          className={`justify-start h-12 text-base font-medium ${activeTab === item.id ? 'bg-gradient-to-r from-primary to-accent' : 'hover:bg-primary/10'}`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </Button>
                      </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* DESKTOP TABS LIST (Visible on >= lg) */}
            <div className="hidden lg:block sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-primary/10 pb-4">
              <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-background/50 to-secondary/20 backdrop-blur-sm border border-primary/20 rounded-xl p-2">
                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="certifications" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Certificates</span>
                </TabsTrigger>
                <TabsTrigger value="journey" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Journey</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Contact</span>
                </TabsTrigger>
                <TabsTrigger value="cv" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">CV</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Enhanced Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  Welcome Back! 👋
                </h2>
                <p className="text-muted-foreground text-lg">
                  Here's what's happening with your portfolio today
                </p>
              </motion.div>

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Recent Activity & Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Activity */}
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Latest updates and changes to your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projects.slice(0, 4).map((project, index) => (
                          <motion.div
                            key={project._id || `project-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-background/40 to-secondary/10 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                          >
                            <div className="relative">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
                              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{project.title}</p>
                              <p className="text-sm text-muted-foreground">Project updated • {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                Active
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                        {projects.length === 0 && (
                          <div className="text-center py-8">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No recent activity. Start by adding your first project!</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions Grid */}
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        Quick Actions
                      </CardTitle>
                      <CardDescription>Fast access to common tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { icon: Plus, label: 'Add Project', color: 'from-blue-500 to-blue-600', action: () => { setItemType('Project'); setEditingItem({}); } },
                          { icon: Award, label: 'Add Certificate', color: 'from-green-500 to-green-600', action: () => { setItemType('Certification'); setEditingItem({}); } },
                          { icon: Code, label: 'Add Skill', color: 'from-purple-500 to-purple-600', action: () => setNewSkill({ name: '', icon: '', category: '', level: 'Intermediate' }) },
                          { icon: Upload, label: 'Upload CV', color: 'from-orange-500 to-orange-600', action: () => { } }
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              className="h-24 w-full flex flex-col items-center gap-3 bg-gradient-to-br from-background/30 to-secondary/10 hover:from-background/50 hover:to-secondary/20 border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                              onClick={item.action}
                            >
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-medium">{item.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Stats & Categories */}
                <div className="space-y-6">
                  {/* Portfolio Stats */}
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        Portfolio Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { label: 'Projects', value: projects.length, color: 'text-blue-600', bg: 'bg-blue-100' },
                          { label: 'Certifications', value: certifications.length, color: 'text-green-600', bg: 'bg-green-100' },
                          { label: 'Skills', value: skills.length, color: 'text-purple-600', bg: 'bg-purple-100' },
                          { label: 'Categories', value: skillCategories.length, color: 'text-orange-600', bg: 'bg-orange-100' }
                        ].map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-background/30"
                          >
                            <span className="font-medium text-foreground">{stat.label}</span>
                            <div className={`px-3 py-1 rounded-full ${stat.bg} ${stat.color} font-bold text-lg`}>
                              {stat.value}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Categories Management */}
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                          <Grid className="w-5 h-5 text-white" />
                        </div>
                        Categories
                      </CardTitle>
                      <CardDescription>Manage your content categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={newSkillCategory}
                            onChange={e => setNewSkillCategory(e.target.value)}
                            placeholder="New category..."
                            className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
                          />
                          <Button onClick={handleAddCategory} size="sm" className="bg-gradient-to-r from-primary to-accent">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {skillCategories.map((cat, index) => (
                            <motion.div
                              key={cat}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background/40 to-secondary/10 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                            >
                              <span className="font-medium text-foreground">{cat}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive/20"
                                onClick={() => handleDeleteCategory(cat)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* About Tab - Manages About Content, Skills & Services */}
            <TabsContent value="about" className="space-y-8">
              {/* About Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    About Section
                  </h3>
                  <p className="text-muted-foreground text-lg mt-2">
                    Manage your personal story, skills, and services
                  </p>
                </div>
              </div>

              {/* About Content Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* About Content */}
                <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      About Content
                    </CardTitle>
                    <CardDescription>Edit your personal story and introduction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={aboutContent}
                      onChange={(e) => setAboutContent(e.target.value)}
                      rows={8}
                      className="w-full bg-background/50 border-primary/20 focus:border-primary resize-none"
                      placeholder="Tell your story... Who are you? What drives you? What's your background?"
                    />
                    <Button onClick={handleSaveAbout} className="bg-gradient-to-r from-primary to-accent w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save About Content
                    </Button>
                  </CardContent>
                </Card>

                {/* Skills Overview */}
                <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      Skills Overview
                      <Badge variant="secondary" className="ml-auto">
                        {skills.length} skills
                      </Badge>
                    </CardTitle>
                    <CardDescription>Quick overview of your technical skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                        <div className="text-2xl font-bold text-blue-600">{skillCategories.length}</div>
                        <div className="text-sm text-muted-foreground">Categories</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                        <div className="text-2xl font-bold text-green-600">{skills.filter(s => s.level === 'Expert').length}</div>
                        <div className="text-sm text-muted-foreground">Expert Level</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActiveTab('skills')}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600"
                      variant="outline"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Manage Skills
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Services Section */}
              <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    Services
                    <Badge variant="secondary" className="ml-auto">
                      {services.length} services
                    </Badge>
                  </CardTitle>
                  <CardDescription>Manage the services you offer to clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service, index) => (
                      <motion.div
                        key={service._id || `service-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-background/40 to-secondary/10 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-600/20">
                            <Briefcase className="w-5 h-5 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{service.title}</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/20"
                            onClick={() => handleDeleteService(service._id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: services.length * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="h-full min-h-[120px] w-full flex flex-col items-center gap-3 bg-gradient-to-br from-background/30 to-secondary/10 hover:from-background/50 hover:to-secondary/20 border-primary/20 hover:border-primary/40 transition-all duration-300"
                        onClick={() => setNewService({ title: '', description: '', icon: '' })}
                      >
                        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium">Add Service</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Skills Tab */}
            <TabsContent value="skills" className="space-y-8">
              {/* Skills Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Skills & Expertise
                  </h3>
                  <p className="text-muted-foreground text-lg mt-2">
                    Manage your technical skills, categories, and proficiency levels
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowSkillForm(true)}
                    className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </div>

              {/* Skills Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Skills', value: skills.length, icon: Code, color: 'from-blue-500 to-blue-600' },
                  { label: 'Categories', value: skillCategories.length, icon: Grid, color: 'from-green-500 to-green-600' },
                  { label: 'Expert Level', value: skills.filter(s => s.level === 'Expert').length, icon: Star, color: 'from-yellow-500 to-yellow-600' },
                  { label: 'Learning', value: skills.filter(s => s.level === 'Beginner').length, icon: TrendingUp, color: 'from-purple-500 to-purple-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Skills Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Categories Management */}
                <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                        <Grid className="w-5 h-5 text-white" />
                      </div>
                      Categories
                    </CardTitle>
                    <CardDescription>Organize your skills into categories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        placeholder="New category name"
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <Button onClick={handleAddCategory} size="sm" className="bg-gradient-to-r from-primary to-accent">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {skillCategories.map((cat, index) => (
                        <motion.div
                          key={cat}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background/40 to-secondary/10 border border-primary/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent"></div>
                            <span className="font-medium">{cat}</span>
                            <Badge variant="outline" className="text-xs">
                              {skills.filter(s => s.category === cat).length}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat)}
                            className="h-8 w-8 p-0 hover:bg-destructive/20"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills List */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Search and Filter */}
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            value={skillSearch}
                            onChange={(e) => setSkillSearch(e.target.value)}
                            placeholder="Search skills..."
                            className="bg-background/50 border-primary/20 focus:border-primary"
                          />
                        </div>
                        <select
                          value={skillCategoryFilter}
                          onChange={(e) => setSkillCategoryFilter(e.target.value)}
                          className="px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                        >
                          <option value="">All Categories</option>
                          {skillCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSkills.map((skill, index) => {
                      const IconComponent = SimpleIcons[skill.icon as keyof typeof SimpleIcons] || Code;
                      const levelColors = {
                        'Beginner': 'from-red-500 to-red-600',
                        'Intermediate': 'from-yellow-500 to-yellow-600',
                        'Advanced': 'from-blue-500 to-blue-600',
                        'Expert': 'from-green-500 to-green-600'
                      };

                      return (
                        <motion.div
                          key={skill._id || `skill-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group"
                        >
                          <Card className="border-0 bg-gradient-to-br from-background/40 to-secondary/10 hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
                                  <IconComponent className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {skill.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">{skill.category}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      setEditingSkill(skill);
                                      setNewSkill(skill);
                                      setShowSkillForm(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4 text-primary" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                                    onClick={() => handleDeleteSkill(skill._id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground">Proficiency</span>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${levelColors[skill.level as keyof typeof levelColors] || levelColors.Intermediate}`}>
                                    {skill.level}
                                  </div>
                                </div>
                                <div className="w-full bg-secondary/30 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full bg-gradient-to-r ${levelColors[skill.level as keyof typeof levelColors] || levelColors.Intermediate} transition-all duration-500`}
                                    style={{
                                      width: skill.level === 'Beginner' ? '25%' :
                                        skill.level === 'Intermediate' ? '50%' :
                                          skill.level === 'Advanced' ? '75%' : '100%'
                                    }}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Empty State */}
                  {filteredSkills.length === 0 && (
                    <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                          <Code className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Skills Found</h3>
                        <p className="text-muted-foreground mb-6">
                          {skillSearch || skillCategoryFilter ? 'Try adjusting your search or filter.' : 'Start building your skills portfolio.'}
                        </p>
                        <Button
                          onClick={() => setShowSkillForm(true)}
                          className="bg-gradient-to-r from-primary to-accent"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Skill
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Enhanced Projects Tab */}
            <TabsContent value="projects" className="space-y-8">
              {/* Projects Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Projects Portfolio
                  </h3>
                  <p className="text-muted-foreground text-lg mt-2">
                    Showcase your best work and achievements
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowProjectForm(true)}
                    className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              {/* Projects Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Projects', value: projects.length, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
                  { label: 'Featured', value: projects.filter(p => p.featured).length, icon: Star, color: 'from-yellow-500 to-yellow-600' },
                  { label: 'Categories', value: projectCategories.length, icon: Grid, color: 'from-purple-500 to-purple-600' },
                  { label: 'With Images', value: projects.filter(p => p.images && p.images.length > 0).length, icon: Eye, color: 'from-green-500 to-green-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Project Management */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Project Categories Management */}
                <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <Grid className="w-5 h-5 text-white" />
                      </div>
                      Project Categories
                    </CardTitle>
                    <CardDescription>Organize your projects by type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newProjectCategory}
                        onChange={(e) => setNewProjectCategory(e.target.value)}
                        placeholder="New category name"
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddProjectCategory()}
                      />
                      <Button onClick={handleAddProjectCategory} size="sm" className="bg-gradient-to-r from-primary to-accent">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {projectCategories.map((cat, index) => (
                        <motion.div
                          key={cat}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background/40 to-secondary/10 border border-primary/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                            <span className="font-medium">{cat}</span>
                            <Badge variant="outline" className="text-xs">
                              {projects.filter(p => p.category === cat).length}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProjectCategory(cat)}
                            className="h-8 w-8 p-0 hover:bg-destructive/20"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Projects List */}
                <div className="lg:col-span-3 space-y-6">

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <Card key={project._id} className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="relative w-full aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                          {project.images && project.images.length > 0 ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase className="w-12 h-12 text-primary/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <div className="w-full flex justify-between items-center">
                              <Badge variant="secondary" className="backdrop-blur-md bg-background/50">
                                {project.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg line-clamp-1" title={project.title}>
                              {project.title}
                            </h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditingProject(project);
                                  setItemType('Project'); // fix for 'setNewProject' if needed, or use generic
                                  // adapting based on context - Admin.tsx seems to use explicit setters
                                  // Assuming old logic was valid:
                                  // setNewProject(project); // Checking if this exists?
                                  // setUploadedImages(project.images || []);
                                  setShowProjectForm(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProject(project._id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mt-auto">
                            {project.technologies?.slice(0, 3).map((tech, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] py-0 h-5">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {projects.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
                      <Button onClick={() => setShowProjectForm(true)}>Create Project</Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Certifications Tab */}
            < TabsContent value="certifications" className="space-y-6" >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Certifications</h3>
                  <p className="text-muted-foreground">Manage your professional certifications</p>
                </div>
                <Button
                  onClick={() => setShowCertificationForm(true)}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert: Certification, index) => (
                  <motion.div
                    key={cert._id || `cert-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="aspect-video bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg mb-4 flex items-center justify-center">
                          {cert.image ? (
                            <img
                              src={cert.image}
                              alt={cert.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Award className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {cert.title}
                        </h4>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-muted-foreground">
                            <strong>Issuer:</strong> {cert.issuer}
                          </p>
                          {cert.date && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Date:</strong> {new Date(cert.date).toLocaleDateString()}
                            </p>
                          )}
                          {cert.credentialId && (
                            <p className="text-sm text-muted-foreground">
                              <strong>ID:</strong> {cert.credentialId}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setEditingCertification(cert);
                              setNewCertification(cert);
                              setCertificationImage(cert.image || '');
                              setShowCertificationForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCertification(cert._id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {cert.verificationUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer">
                                <Award className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {
                certifications.length === 0 && (
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Certifications Yet</h3>
                      <p className="text-muted-foreground mb-6">Showcase your professional achievements and certifications</p>
                      <Button
                        onClick={() => setShowCertificationForm(true)}
                        className="bg-gradient-to-r from-primary to-accent"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Certification
                      </Button>
                    </CardContent>
                  </Card>
                )
              }
            </TabsContent >

            {/* Journey Tab - Manages Career Timeline */}
            < TabsContent value="journey" className="space-y-8" >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Career Journey
                  </h3>
                  <p className="text-muted-foreground text-lg mt-2">
                    Manage your career timeline and milestones
                  </p>
                </div>
                <Button
                  onClick={() => setShowJourneyForm(true)}
                  className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Journey Item
                </Button>
              </div>

              {/* Journey Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Items', value: journeyItems.length, icon: MapPin, color: 'from-blue-500 to-blue-600' },
                  { label: 'Work Experience', value: journeyItems.filter(j => j.type === 'work').length, icon: Briefcase, color: 'from-green-500 to-green-600' },
                  { label: 'Education', value: journeyItems.filter(j => j.type === 'education').length, icon: Award, color: 'from-purple-500 to-purple-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Journey Items */}
              {
                journeyItems.length > 0 ? (
                  <div className="space-y-6">
                    {journeyItems.map((item, index) => (
                      <motion.div
                        key={item._id || `journey-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group"
                      >
                        <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.type === 'work' ? 'from-blue-500 to-blue-600' :
                                  item.type === 'education' ? 'from-purple-500 to-purple-600' :
                                    'from-green-500 to-green-600'
                                  }`}>
                                  {item.type === 'work' ? <Briefcase className="w-5 h-5 text-white" /> :
                                    item.type === 'education' ? <Award className="w-5 h-5 text-white" /> :
                                      <MapPin className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-lg text-muted-foreground">{item.company}</p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    {item.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {item.location}
                                      </span>
                                    )}
                                    {item.period && <span>{item.period}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingJourneyItem(item);
                                    setNewJourneyItem(item);
                                    setShowJourneyForm(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteJourneyItem(item._id!)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {item.description && (
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            {item.achievements && item.achievements.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                                  Key Achievements
                                </h5>
                                <ul className="space-y-1">
                                  {item.achievements.map((achievement, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                      {achievement}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.technologies && item.technologies.length > 0 && (
                              <div>
                                <h5 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                                  Technologies
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {item.technologies.map((tech, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm">
                    <CardContent className="p-16 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">No Journey Items Yet</h3>
                      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        Start building your career timeline by adding your work experience and education.
                      </p>
                      <Button
                        onClick={() => setShowJourneyForm(true)}
                        className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                        size="lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Journey Item
                      </Button>
                    </CardContent>
                  </Card>
                )
              }
            </TabsContent >

            {/* Contact Tab - Manages Contact Information */}
            < TabsContent value="contact" className="space-y-8" >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Contact Information
                  </h3>
                  <p className="text-muted-foreground text-lg mt-2">
                    Manage your contact details and social links
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateContact} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        Contact Details
                      </CardTitle>
                      <CardDescription>Update your primary contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <Input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@example.com"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          value={contactInfo.location}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, State, Country"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Website</label>
                        <Input
                          type="url"
                          value={contactInfo.website}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://yourwebsite.com"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        Social Links
                      </CardTitle>
                      <CardDescription>Add your social media profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <Input
                          type="url"
                          value={contactInfo.linkedin}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">GitHub</label>
                        <Input
                          type="url"
                          value={contactInfo.github}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, github: e.target.value }))}
                          placeholder="https://github.com/yourusername"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Twitter</label>
                        <Input
                          type="url"
                          value={contactInfo.twitter}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, twitter: e.target.value }))}
                          placeholder="https://twitter.com/yourusername"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Instagram</label>
                        <Input
                          type="url"
                          value={contactInfo.instagram}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, instagram: e.target.value }))}
                          placeholder="https://instagram.com/yourusername"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Facebook</label>
                        <Input
                          type="url"
                          value={contactInfo.facebook}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, facebook: e.target.value }))}
                          placeholder="https://facebook.com/yourprofile"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">WhatsApp</label>
                        <Input
                          type="tel"
                          value={contactInfo.whatsapp}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
                          placeholder="+1234567890 (phone number only)"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Messenger</label>
                        <Input
                          type="url"
                          value={contactInfo.messenger}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, messenger: e.target.value }))}
                          placeholder="https://m.me/yourprofile"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                    size="lg"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Update Contact Information
                  </Button>
                </div>
              </form>
            </TabsContent >

            {/* CV Management Tab */}
            < TabsContent value="cv" className="space-y-8" >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    CV Management
                  </h3>
                  <p className="text-muted-foreground text-lg mt-2">
                    Upload and manage your CV/Resume file
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current CV Display */}
                <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      Current CV
                    </CardTitle>
                    <CardDescription>Your currently active CV file</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentCV ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-green-600">CV Available</p>
                              <p className="text-sm text-muted-foreground">Last updated: {new Date(currentCV.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <Button
                              onClick={() => window.open(currentCV.url, '_blank')}
                              variant="outline"
                              size="sm"
                              className="border-green-500/20 hover:bg-green-500/10"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={async () => {
                            if (!currentCV) return;
                            try {
                              const response = await fetch('/api/cv/download');
                              const disposition = response.headers.get('Content-Disposition');
                              let name = currentCV.filename || 'resume.pdf';
                              if (disposition) { const m = disposition.match(/filename="?([^"\n]+)"?/); if (m) name = m[1]; }
                              const blob = await response.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url; a.download = name;
                              document.body.appendChild(a); a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            } catch (err) { console.error('Download failed:', err); }
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download Current CV
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                        <p className="text-orange-600 font-medium">No CV uploaded yet</p>
                        <p className="text-sm text-muted-foreground">Upload your first CV using the form on the right</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upload New CV */}
                <Card className="border-0 bg-gradient-to-br from-background/50 to-secondary/20 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      Upload New CV
                    </CardTitle>
                    <CardDescription>Replace your current CV with a new version</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Select CV File</label>
                      <ImageUpload
                        onFilesChange={setCvFile}
                        maxFiles={1}
                        accept=".pdf,.doc,.docx"
                        multiple={false}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: PDF, DOC, DOCX (Max size: 10MB)
                      </p>
                    </div>
                    <Button
                      onClick={handleSaveCv}
                      disabled={cvFile.length === 0 || isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload CV
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent >
          </Tabs >
        </motion.div >

        {/* Enhanced Modals */}
        <AnimatePresence>
          {
            editingItem && itemType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  <Card className="border-0 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                          {itemType === 'Project' ? <Briefcase className="w-5 h-5 text-white" /> : <Award className="w-5 h-5 text-white" />}
                        </div>
                        {editingItem._id ? `Edit ${itemType}` : `Add New ${itemType}`}
                      </CardTitle>
                      <CardDescription>
                        {itemType === 'Project' ? 'Showcase your work and achievements' : 'Add your professional certifications'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <PortfolioItemForm
                        item={editingItem}
                        onSave={handleSaveItem}
                        onCancel={() => setEditingItem(null)}
                        itemType={itemType}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence >

        {/* Enhanced Skill Form Modal */}
        <AnimatePresence>
          {
            showSkillForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-2xl"
                >
                  <Card className="border-0 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                      </CardTitle>
                      <CardDescription>
                        {editingSkill ? 'Update your skill information' : 'Add a new skill to your portfolio with auto-generated icon'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddSkill} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Skill Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Skill Name</label>
                            <Input
                              value={newSkill.name}
                              onChange={(e) => handleSkillNameChange(e.target.value)}
                              placeholder="e.g., React, Python, MongoDB"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              required
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                              value={newSkill.category}
                              onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                              required
                            >
                              <option value="">Select Category</option>
                              {skillCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Proficiency Level */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Proficiency Level</label>
                            <select
                              value={newSkill.level}
                              onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                              className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                              required
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>

                          {/* Icon Preview */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Icon Preview</label>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background/40 to-secondary/10 border border-primary/10">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
                                {(() => {
                                  const IconComponent = SimpleIcons[newSkill.icon as keyof typeof SimpleIcons] || Code;
                                  return <IconComponent className="w-6 h-6 text-primary" />;
                                })()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{newSkill.icon || 'Auto-generated'}</p>
                                <p className="text-xs text-muted-foreground">Icon updates automatically</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Manual Icon Override */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Manual Icon Override (Optional)</label>
                          <Input
                            value={newSkill.icon}
                            onChange={(e) => setNewSkill(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="e.g., SiReact, SiPython, SiMongodb"
                            className="bg-background/50 border-primary/20 focus:border-primary"
                          />
                          <p className="text-xs text-muted-foreground">
                            Leave empty for auto-generation. Use SimpleIcons format (e.g., SiReact, SiPython)
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowSkillForm(false);
                              setEditingSkill(null);
                              setNewSkill({ name: '', icon: '', category: '', level: 'Intermediate' });
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-primary to-accent"
                            disabled={!newSkill.name || !newSkill.category}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingSkill ? 'Update Skill' : 'Add Skill'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence >

        {/* Enhanced Project Form Modal */}
        <AnimatePresence>
          {
            showProjectForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  <Card className="border-0 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        {editingProject ? 'Edit Project' : 'Add New Project'}
                      </CardTitle>
                      <CardDescription>
                        {editingProject ? 'Update your project information' : 'Add a new project to your portfolio'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddProject} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Project Title */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Project Title</label>
                            <Input
                              value={newProject.title}
                              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., E-commerce Platform"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              required
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                              value={newProject.category}
                              onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                              required
                            >
                              <option value="">Select Category</option>
                              {projectCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Live URL */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Live URL (Optional)</label>
                            <Input
                              value={newProject.liveUrl}
                              onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                              placeholder="https://your-project.com"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              type="url"
                            />
                          </div>

                          {/* GitHub URL */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">GitHub URL (Optional)</label>
                            <Input
                              value={newProject.githubUrl}
                              onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                              placeholder="https://github.com/username/repo"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              type="url"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            value={newProject.description}
                            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your project, its features, and what makes it special..."
                            className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary resize-none"
                            rows={4}
                            required
                          />
                        </div>

                        {/* Technologies */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Technologies Used</label>
                          <Input
                            value={newProject.technologies.join(', ')}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev,
                              technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)
                            }))}
                            placeholder="React, Node.js, MongoDB, TypeScript (comma separated)"
                            className="bg-background/50 border-primary/20 focus:border-primary"
                          />
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newProject.featured}
                            onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                            className="rounded border-primary/20"
                          />
                          <label htmlFor="featured" className="text-sm font-medium">
                            Mark as Featured Project
                          </label>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                          <label className="text-sm font-medium">Project Images</label>

                          {/* Drag and Drop Area */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                              }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">
                              {dragActive ? 'Drop images here' : 'Drag & drop images here'}
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              or click to select files
                            </p>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                              className="hidden"
                              id="image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              className="bg-background/50 border-primary/20 hover:border-primary/40"
                            >
                              Select Images
                            </Button>
                          </div>

                          {/* Uploaded Images Preview */}
                          {uploadedImages.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages.map((imageUrl, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={imageUrl}
                                      alt={`Project image ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg border border-primary/20"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleRemoveImage(imageUrl)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowProjectForm(false);
                              setEditingProject(null);
                              setNewProject({
                                title: '',
                                description: '',
                                images: [],
                                technologies: [],
                                category: '',
                                liveUrl: '',
                                githubUrl: '',
                                featured: false
                              });
                              setUploadedImages([]);
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-primary to-accent"
                            disabled={!newProject.title || !newProject.description || !newProject.category}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingProject ? 'Update Project' : 'Add Project'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence >

        {/* Enhanced Certification Form Modal */}
        <AnimatePresence>
          {
            showCertificationForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <Card className="border-0 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        {editingCertification ? 'Edit Certification' : 'Add New Certification'}
                      </CardTitle>
                      <CardDescription>
                        {editingCertification ? 'Update your certification information' : 'Add a new professional certification to your portfolio'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddCertification} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Certification Title */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Certification Title</label>
                            <Input
                              value={newCertification.title}
                              onChange={(e) => setNewCertification(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., AWS Certified Solutions Architect"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              required
                            />
                          </div>

                          {/* Issuer */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Issuing Organization</label>
                            <Input
                              value={newCertification.issuer}
                              onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                              placeholder="e.g., Amazon Web Services"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              required
                            />
                          </div>

                          {/* Issue Date */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Issue Date</label>
                            <Input
                              type="date"
                              value={newCertification.date}
                              onChange={(e) => setNewCertification(prev => ({ ...prev, date: e.target.value }))}
                              className="bg-background/50 border-primary/20 focus:border-primary"
                            />
                          </div>

                          {/* Credential ID */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Credential ID (Optional)</label>
                            <Input
                              value={newCertification.credentialId}
                              onChange={(e) => setNewCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                              placeholder="e.g., AWS-SAA-2023-001"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* Verification URL */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Verification URL (Optional)</label>
                          <Input
                            type="url"
                            value={newCertification.verificationUrl}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, verificationUrl: e.target.value }))}
                            placeholder="https://verify.example.com/credential-id"
                            className="bg-background/50 border-primary/20 focus:border-primary"
                          />
                        </div>

                        {/* Certificate Image Upload */}
                        <div className="space-y-4">
                          <label className="text-sm font-medium">Certificate Image</label>

                          {/* Current Image Preview */}
                          {certificationImage && (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Current Image:</p>
                              <div className="relative inline-block">
                                <img
                                  src={certificationImage}
                                  alt="Certificate preview"
                                  className="w-32 h-24 object-cover rounded-lg border border-primary/20"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => {
                                    setCertificationImage('');
                                    setNewCertification(prev => ({ ...prev, image: '' }));
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Upload Area */}
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${dragActive
                              ? 'border-primary bg-primary/10'
                              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                              }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => {
                              handleDrop(e);
                              const files = e.dataTransfer.files;
                              if (files && files.length > 0) {
                                handleCertificationImageUpload(files);
                              }
                            }}
                          >
                            <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium mb-1">
                              {dragActive ? 'Drop certificate image here' : 'Drag & drop certificate image here'}
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                              or click to select file
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files && handleCertificationImageUpload(e.target.files)}
                              className="hidden"
                              id="cert-image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('cert-image-upload')?.click()}
                              className="bg-background/50 border-primary/20 hover:border-primary/40"
                            >
                              Select Image
                            </Button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowCertificationForm(false);
                              setEditingCertification(null);
                              setNewCertification({
                                title: '',
                                issuer: '',
                                date: '',
                                credentialId: '',
                                verificationUrl: '',
                                image: ''
                              });
                              setCertificationImage('');
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600"
                            disabled={!newCertification.title || !newCertification.issuer}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingCertification ? 'Update Certification' : 'Add Certification'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence >

        {/* Enhanced Journey Form Modal */}
        <AnimatePresence>
          {
            showJourneyForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                >
                  <Card className="border-0 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="border-b border-primary/10">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        {editingJourneyItem ? 'Edit Journey Item' : 'Add New Journey Item'}
                      </CardTitle>
                      <CardDescription>
                        {editingJourneyItem ? 'Update your career timeline item' : 'Add a new milestone to your career journey'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddJourneyItem} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Title */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Position/Title</label>
                            <Input
                              value={newJourneyItem.title}
                              onChange={(e) => setNewJourneyItem(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Senior Full-Stack Developer"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              required
                            />
                          </div>

                          {/* Company */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Company/Institution</label>
                            <Input
                              value={newJourneyItem.company}
                              onChange={(e) => setNewJourneyItem(prev => ({ ...prev, company: e.target.value }))}
                              placeholder="e.g., TechCorp Solutions"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                              required
                            />
                          </div>

                          {/* Location */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input
                              value={newJourneyItem.location}
                              onChange={(e) => setNewJourneyItem(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g., San Francisco, CA"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                            />
                          </div>

                          {/* Type */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                              value={newJourneyItem.type}
                              onChange={(e) => setNewJourneyItem(prev => ({ ...prev, type: e.target.value as 'work' | 'education' | 'project' }))}
                              className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary"
                            >
                              <option value="work">Work Experience</option>
                              <option value="education">Education</option>
                              <option value="project">Project</option>
                            </select>
                          </div>

                          {/* Year */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <Input
                              value={newJourneyItem.year}
                              onChange={(e) => setNewJourneyItem(prev => ({ ...prev, year: e.target.value }))}
                              placeholder="e.g., 2023"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                            />
                          </div>

                          {/* Period */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Period</label>
                            <Input
                              value={newJourneyItem.period}
                              onChange={(e) => setNewJourneyItem(prev => ({ ...prev, period: e.target.value }))}
                              placeholder="e.g., 2022 - Present"
                              className="bg-background/50 border-primary/20 focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            value={newJourneyItem.description}
                            onChange={(e) => setNewJourneyItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your role, responsibilities, and key contributions..."
                            className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary resize-none"
                            rows={4}
                          />
                        </div>

                        {/* Achievements */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Key Achievements</label>
                          <textarea
                            value={newJourneyItem.achievements.join('\n')}
                            onChange={(e) => setNewJourneyItem(prev => ({
                              ...prev,
                              achievements: e.target.value.split('\n').filter(a => a.trim())
                            }))}
                            placeholder="Enter each achievement on a new line..."
                            className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background/50 focus:border-primary resize-none"
                            rows={3}
                          />
                        </div>

                        {/* Technologies */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Technologies Used</label>
                          <Input
                            value={newJourneyItem.technologies.join(', ')}
                            onChange={(e) => setNewJourneyItem(prev => ({
                              ...prev,
                              technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)
                            }))}
                            placeholder="React, Node.js, MongoDB, AWS (comma separated)"
                            className="bg-background/50 border-primary/20 focus:border-primary"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowJourneyForm(false);
                              setEditingJourneyItem(null);
                              setNewJourneyItem({
                                title: '',
                                company: '',
                                location: '',
                                year: '',
                                period: '',
                                description: '',
                                achievements: [],
                                technologies: [],
                                type: 'work'
                              });
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                            disabled={!newJourneyItem.title || !newJourneyItem.company}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingJourneyItem ? 'Update Journey Item' : 'Add Journey Item'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          }
        </AnimatePresence >

        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setItemToDelete(null)}
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete the item."
        />
      </div >
    </div >
  );
};

export default Admin;