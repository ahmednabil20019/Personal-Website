import { Project, Certification } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import { X } from "lucide-react";

interface PortfolioItemFormProps {
  item: Partial<Project | Certification>;
  onSave: (item: any) => void;
  onCancel: () => void;
  itemType: 'Project' | 'Certification';
}

export const PortfolioItemForm = ({ item, onSave, onCancel, itemType }: PortfolioItemFormProps) => {
  const [formData, setFormData] = useState(item);
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('');

  useEffect(() => {
    setFormData(item);
  }, [item]);

  useEffect(() => {
    if (itemType === 'Project') {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (data.success) setCategories(data.data);
        });
    }
  }, [itemType]);

  useEffect(() => {
    // Fetch config for Cloudinary
    fetch('/api/config')
      .then(res => res.json())
      .then(config => {
        if (config.success) {
          setCloudinaryCloudName(config.data.cloudinaryCloudName);
        }
      });
  }, []);

  // Always treat technologies as a string for the input, but as an array in the data
  const techString = Array.isArray(formData.technologies)
    ? formData.technologies.join(', ')
    : typeof formData.technologies === 'string'
      ? formData.technologies
      : '';

  // Show uploaded images (if any)
  const images = (formData as any).images || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // If the field is technologies, always store as a string in formData
    if (name === 'technologies') {
      setFormData(prev => ({ ...prev, technologies: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalData = { ...formData };

    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'portofolio');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        return data.secure_url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      
      if (isProject(formData)) {
        finalData.images = [...(finalData.images || []), ...imageUrls];
      } else {
        finalData.image = imageUrls[0]; // For certifications
      }
    }
    
    if (isProject(formData)) {
      finalData = {
        ...finalData,
        technologies: typeof formData.technologies === 'string'
          ? formData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
          : Array.isArray(formData.technologies)
            ? formData.technologies
            : [],
      };
    }
    onSave(finalData);
  };

  const handleDeleteImage = async (imageUrl: string) => {
    const updatedImages = (formData.images || []).filter(img => img !== imageUrl);
    setFormData(prev => ({ ...prev, images: updatedImages }));

    // Also update the backend
    await fetch(`/api/projects/${formData._id}/images`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: updatedImages }),
    });
  };

  const handleDeleteCertificateImage = async () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    await fetch(`/api/certifications/${formData._id}/image`, { method: 'DELETE' });
  };

  const isProject = (item: any): item is Partial<Project> => itemType === 'Project';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 bg-secondary/50 rounded-lg shadow-glow w-full max-w-lg glass-card">
        <h2 className="text-2xl font-bold mb-6 text-gradient">
          {item.id ? 'Edit' : 'Add'} {itemType}
        </h2>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
          {/* Show thumbnails for uploaded images */}
          {isProject(formData) && images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img: string, idx: number) => (
                <div key={idx} className="relative">
                  <img src={img} alt="uploaded" className="w-16 h-16 object-cover rounded border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                    onClick={() => handleDeleteImage(img)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {!isProject(formData) && formData.image && (
            <div className="relative w-24 h-24 mb-2">
              <img src={formData.image} alt="certificate" className="w-full h-full object-cover rounded border" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                onClick={handleDeleteCertificateImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Input name="title" placeholder="Title" value={formData.title || ''} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />
          {isProject(formData) && (
            <select
              name="category"
              value={(formData as Project).category || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          )}
          <Textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />
          {isProject(formData) && <Input name="technologies" placeholder="Technologies (comma-separated)" value={techString} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />}
          {isProject(formData) && <Input name="liveUrl" placeholder="Demo URL (optional)" value={(formData as Project).liveUrl || ''} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />}
          {isProject(formData) && <Input name="githubUrl" placeholder="GitHub URL (optional)" value={(formData as Project).githubUrl || ''} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />}
          {!isProject(formData) && (
            <>
              <Input name="issuer" placeholder="Issuer" value={(formData as Certification).issuer || ''} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />
              <Input type="date" name="date" placeholder="Issue Date" value={(formData as Certification).date?.split('T')[0] || ''} onChange={handleChange} className="w-full px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50" />
            </>
          )}
          <ImageUpload onFilesChange={setFiles} multiple={isProject(formData)} />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}; 