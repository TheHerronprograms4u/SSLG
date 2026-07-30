export interface Resource {
  id: string;
  name: string;
  url: string;
  size: string;
  format: 'pdf' | 'doc' | 'zip' | 'link';
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
}

export interface Project {
  id: string;
  title: string;
  shortSummary: string;
  fullDescription: string;
  category: 'AI & Learning' | 'Campus Infrastructure' | 'Educational Tech' | 'Sustainable Energy' | 'Student Welfare' | 'Innovation';
  status: 'Active' | 'Completed' | 'Under Review' | 'Featured';
  authors: string[];
  organization: string;
  datePublished: string;
  coverImage: string;
  galleryImages: string[];
  resources?: Resource[];
  comments?: Comment[];
  likes: number;
  reads: number;
  featured?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  authors: string[];
  pdfUrl: string;
  citation: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  department: 'Executive Board' | 'Tech & Innovation' | 'Academic Affairs' | 'Student Welfare' | 'Research & Dev';
  email: string;
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  projectsCount: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Research' | 'Events' | 'Campus' | 'Innovation Showcase';
  url: string;
  caption: string;
  date: string;
}

export interface FeedbackSubmission {
  id: string;
  category: string;
  rating: number;
  message: string;
  is_anonymous: boolean;
  student_id?: string;
  created_at: string;
}
