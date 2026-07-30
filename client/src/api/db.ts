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
// PROJECTS
// -------------------------------------------------------------
export async function dbGetProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('datePublished', { ascending: false });
    if (!error && data && data.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data));
      return data as Project[];
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
    await supabase.from('projects').upsert(project);
  } catch (err) {
    console.warn('Supabase projects save error:', err);
  }
}

export async function dbDeleteProject(id: string): Promise<void> {
  const cached = await dbGetProjects();
  const updated = cached.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));

  try {
    await supabase.from('projects').delete().eq('id', id);
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
    if (!error && data && data.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(data));
      return data as Publication[];
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
    await supabase.from('publications').upsert(pub);
  } catch (err) {
    console.warn('Supabase publications save error:', err);
  }
}

export async function dbDeletePublication(id: string): Promise<void> {
  const cached = await dbGetPublications();
  const updated = cached.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(updated));

  try {
    await supabase.from('publications').delete().eq('id', id);
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
    if (!error && data && data.length > 0) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data));
      return data as GalleryItem[];
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
    await supabase.from('gallery').upsert(item);
  } catch (err) {
    console.warn('Supabase gallery save error:', err);
  }
}

export async function dbDeleteGalleryItem(id: string): Promise<void> {
  const cached = await dbGetGallery();
  const updated = cached.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));

  try {
    await supabase.from('gallery').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase gallery delete error:', err);
  }
}

// -------------------------------------------------------------
// FEEDBACK
// -------------------------------------------------------------
export async function dbGetFeedback(): Promise<FeedbackSubmission[]> {
  try {
    const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      if (data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(data));
      }
      return data as FeedbackSubmission[];
    }
    if (error) {
      console.warn('Supabase feedback fetch error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase feedback fetch error, falling back to local cache:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
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

// -------------------------------------------------------------
// TEAM
// -------------------------------------------------------------
export async function dbGetTeam(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase.from('team').select('*');
    if (!error && data && data.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(data));
      return data as TeamMember[];
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
    await supabase.from('team').upsert(member);
  } catch (err) {
    console.warn('Supabase team save error:', err);
  }
}
