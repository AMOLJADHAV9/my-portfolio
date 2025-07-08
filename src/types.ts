// Project interface
export interface Project {
  id: string;
  icon: string;
  title: string;
  description: string;
  tech: string; // comma-separated string in admin, string[] in API
  live: string;
  github: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

// Skill interface
export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  proficiency: string;
  level: number;
  order: number;
  visible: boolean;
}

// Resume interface
export interface Resume {
  name: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  experience: {
    role: string;
    company: string;
    year: string;
    description: string;
  }[];
  skills: string[];
  certifications: string[];
} 