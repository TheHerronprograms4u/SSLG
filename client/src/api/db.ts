import { supabase } from './supabase';
import type { Project, Publication, GalleryItem, FeedbackSubmission, TeamMember } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'sslg_projects',
  PUBLICATIONS: 'sslg_publications',
  GALLERY: 'sslg_gallery',
  FEEDBACK: 'sslg_feedback',
  TEAM: 'sslg_team'
};

// -------------------------------------------------------------
// HELPER MAPPERS FOR SUPABASE LOWERCASE COLUMNS
// -------------------------------------------------------------
function mapProjectFromDb(row: any): Project {
  return {
    id: String(row.id),
    title: row.title || '',
    shortSummary: row.shortSummary ?? row.shortsummary ?? '',
    fullDescription: row.fullDescription ?? row.fulldescription ?? '',
    category: row.category || '',
    status: row.status || 'Active',
    authors: row.authors || [],
    organization: row.organization || '',
    datePublished: row.datePublished ?? row.datepublished ?? '',
    coverImage: row.coverImage ?? row.coverimage ?? '',
    galleryImages: row.galleryImages ?? row.galleryimages ?? [],
    resources: row.resources || [],
    comments: row.comments || [],
    likes: row.likes || 0,
    reads: row.reads || 0,
    featured: row.featured || false
  };
}

function mapProjectToDb(p: Project): any {
  return {
    id: p.id,
    title: p.title,
    shortsummary: p.shortSummary,
    fulldescription: p.fullDescription,
    category: p.category,
    status: p.status,
    authors: p.authors,
    organization: p.organization,
    datepublished: p.datePublished,
    coverimage: p.coverImage,
    galleryimages: p.galleryImages,
    resources: p.resources,
    comments: p.comments,
    likes: p.likes,
    reads: p.reads,
    featured: p.featured
  };
}

function mapPublicationFromDb(row: any): Publication {
  return {
    id: String(row.id),
    title: row.title || '',
    journal: row.journal || '',
    year: row.year || new Date().getFullYear(),
    doi: row.doi || '',
    abstract: row.abstract || '',
    authors: row.authors || [],
    pdfUrl: row.pdfUrl ?? row.pdfurl ?? '',
    citation: row.citation || '',
    category: row.category || ''
  };
}

function mapPublicationToDb(pub: Publication): any {
  return {
    id: pub.id,
    title: pub.title,
    journal: pub.journal,
    year: pub.year,
    doi: pub.doi,
    abstract: pub.abstract,
    authors: pub.authors,
    pdfurl: pub.pdfUrl,
    citation: pub.citation,
    category: pub.category
  };
}

function mapTeamFromDb(row: any): TeamMember {
  return {
    id: String(row.id),
    name: row.name || '',
    role: row.role || '',
    avatar: row.avatar || '',
    bio: row.bio || '',
    department: row.department || '',
    email: row.email || '',
    socials: row.socials || {},
    projectsCount: row.projectsCount ?? row.projectscount ?? 0
  };
}

function mapTeamToDb(member: TeamMember): any {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    avatar: member.avatar,
    bio: member.bio,
    department: member.department,
    email: member.email,
    socials: member.socials,
    projectscount: member.projectsCount
  };
}

// -------------------------------------------------------------
// PROJECTS
// -------------------------------------------------------------
export async function dbGetProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('datepublished', { ascending: false });
    if (!error && data) {
      const mapped = data.map(mapProjectFromDb);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mapped));
      return mapped;
    }
    if (error) {
      console.warn('Supabase projects fetch error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase projects fetch error, falling back to local cache:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function dbSaveProject(project: Project): Promise<void> {
  const cached = await dbGetProjects();
  const index = cached.findIndex((p) => p.id === project.id);
  let updated: Project[];
  if (index >= 0) {
    updated = cached.map((p) => (p.id === project.id ? project : p));
  } else {
    updated = [project, ...cached];
  }
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));

  try {
    const dbPayload = mapProjectToDb(project);
    const { error } = await supabase.from('projects').upsert(dbPayload);
    if (error) {
      console.warn('Supabase projects save error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase projects save error:', err);
  }
}

export async function dbDeleteProject(id: string): Promise<void> {
  const cached = await dbGetProjects();
  const updated = cached.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.warn('Supabase projects delete error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase projects delete error:', err);
  }
}

// -------------------------------------------------------------
// PUBLICATIONS
// -------------------------------------------------------------
export async function dbGetPublications(): Promise<Publication[]> {
  try {
    const { data, error } = await supabase.from('publications').select('*').order('year', { ascending: false });
    if (!error && data) {
      const mapped = data.map(mapPublicationFromDb);
      localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(mapped));
      return mapped;
    }
    if (error) {
      console.warn('Supabase publications fetch error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase publications fetch error, falling back to local cache:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.PUBLICATIONS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function dbSavePublication(pub: Publication): Promise<void> {
  const cached = await dbGetPublications();
  const index = cached.findIndex((p) => p.id === pub.id);
  let updated: Publication[];
  if (index >= 0) {
    updated = cached.map((p) => (p.id === pub.id ? pub : p));
  } else {
    updated = [pub, ...cached];
  }
  localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(updated));

  try {
    const dbPayload = mapPublicationToDb(pub);
    const { error } = await supabase.from('publications').upsert(dbPayload);
    if (error) {
      console.warn('Supabase publications save error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase publications save error:', err);
  }
}

export async function dbDeletePublication(id: string): Promise<void> {
  const cached = await dbGetPublications();
  const updated = cached.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(updated));

  try {
    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (error) {
      console.warn('Supabase publications delete error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase publications delete error:', err);
  }
}

// -------------------------------------------------------------
// GALLERY
// -------------------------------------------------------------
export async function dbGetGallery(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase.from('gallery').select('*').order('date', { ascending: false });
    if (!error && data) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data));
      return data as GalleryItem[];
    }
    if (error) {
      console.warn('Supabase gallery fetch error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase gallery fetch error, falling back to local cache:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.GALLERY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function dbSaveGalleryItem(item: GalleryItem): Promise<void> {
  const cached = await dbGetGallery();
  const index = cached.findIndex((g) => g.id === item.id);
  let updated: GalleryItem[];
  if (index >= 0) {
    updated = cached.map((g) => (g.id === item.id ? item : g));
  } else {
    updated = [item, ...cached];
  }
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));

  try {
    const { error } = await supabase.from('gallery').upsert(item);
    if (error) {
      console.warn('Supabase gallery save error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase gallery save error:', err);
  }
}

export async function dbDeleteGalleryItem(id: string): Promise<void> {
  const cached = await dbGetGallery();
  const updated = cached.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));

  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      console.warn('Supabase gallery delete error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase gallery delete error:', err);
  }
}

// -------------------------------------------------------------
// FEEDBACK
// -------------------------------------------------------------
export async function dbGetFeedback(): Promise<FeedbackSubmission[]> {
  const cached = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  let localItems: FeedbackSubmission[] = [];
  if (cached) {
    try {
      localItems = JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  try {
    const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const mergedMap = new Map<string, FeedbackSubmission>();
      localItems.forEach((f) => mergedMap.set(String(f.id), f));
      (data as FeedbackSubmission[]).forEach((f) => mergedMap.set(String(f.id), f));
      
      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      if (merged.length > 0) {
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(merged));
      }
      return merged;
    }
    if (error) {
      console.warn('Supabase feedback fetch error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase feedback fetch error, falling back to local cache:', err);
  }

  return localItems;
}

export async function dbSubmitFeedback(feedback: FeedbackSubmission): Promise<void> {
  const cached = await dbGetFeedback();
  const updated = [feedback, ...cached];
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(updated));

  const payload: any = {
    id: feedback.id,
    category: feedback.category,
    rating: feedback.rating,
    message: feedback.message,
    is_anonymous: feedback.is_anonymous,
    created_at: feedback.created_at || new Date().toISOString()
  };
  if (feedback.student_id) {
    payload.student_id = feedback.student_id;
  }

  try {
    const { error } = await supabase.from('feedback').insert([payload]);
    if (error) {
      console.warn('Supabase feedback insert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase feedback insert error:', err);
  }
}

export async function dbDeleteFeedback(id: string): Promise<void> {
  const cached = await dbGetFeedback();
  const updated = cached.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(updated));

  try {
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) {
      console.warn('Supabase feedback delete error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase feedback delete error:', err);
  }
}

// -------------------------------------------------------------
// TEAM
// -------------------------------------------------------------
export async function dbGetTeam(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase.from('team').select('*');
    if (!error && data) {
      const mapped = data.map(mapTeamFromDb);
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(mapped));
      return mapped;
    }
    if (error) {
      console.warn('Supabase team fetch error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase team fetch error:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.TEAM);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function dbSaveTeamMember(member: TeamMember): Promise<void> {
  const cached = await dbGetTeam();
  const index = cached.findIndex((m) => m.id === member.id);
  let updated: TeamMember[];
  if (index >= 0) {
    updated = cached.map((m) => (m.id === member.id ? member : m));
  } else {
    updated = [member, ...cached];
  }
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));

  try {
    const dbPayload = mapTeamToDb(member);
    const { error } = await supabase.from('team').upsert(dbPayload);
    if (error) {
      console.warn('Supabase team save error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase team save error:', err);
  }
}
