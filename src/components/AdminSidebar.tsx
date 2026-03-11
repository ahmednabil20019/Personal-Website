import { Button } from '@/components/ui/button';
import { LayoutDashboard, Newspaper, Award, Star, Settings, User, FileDown } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: Newspaper },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'skills', label: 'Skills', icon: Star },
  { id: 'about', label: 'About', icon: User },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'cv', label: 'CV Management', icon: FileDown },
];

export const AdminSidebar = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-background/50 backdrop-blur-sm p-4 z-40">
      <h2 className="text-2xl font-bold mb-8 text-gradient">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="justify-start"
            onClick={() => scrollToSection(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}; 