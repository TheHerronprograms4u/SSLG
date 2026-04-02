import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sslg-feedback-secret-123';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Public Routes
app.post('/api/feedback', async (req: Request, res: Response) => {
  const { category, rating, message, is_anonymous, student_id } = req.body;
  
  if (!category || !rating) {
    return res.status(400).json({ error: 'Category and rating are required.' });
  }

  try {
    const { error } = await supabase
      .from('feedback')
      .insert([
        { 
          category, 
          rating: Number(rating), 
          message: message || '', 
          is_anonymous: Boolean(is_anonymous), 
          student_id: student_id || null 
        }
      ]);
    
    if (error) throw error;
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Supabase Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/admin/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Admin Protected Routes
app.get('/api/admin/stats', authenticateToken, async (req: any, res: Response) => {
  try {
    const { count: totalResponses, error: countError } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;

    const { data: feedbackData, error: dataError } = await supabase
      .from('feedback')
      .select('category, rating');
    
    if (dataError) throw dataError;

    const categories = ['academics', 'facilities', 'events', 'leadership', 'welfare'];
    const categoryDistribution = categories.map(cat => {
      const catFeedback = feedbackData?.filter(f => f.category === cat) || [];
      const count = catFeedback.length;
      const avg_rating = count > 0 
        ? catFeedback.reduce((sum, f) => sum + f.rating, 0) / count 
        : 0;
      
      return { category: cat, count, avg_rating };
    });
    
    res.json({ totalResponses, categoryDistribution });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

app.get('/api/admin/responses', authenticateToken, async (req: any, res: Response) => {
  try {
    const { data: responses, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(responses);
  } catch (error) {
    console.error('Responses Error:', error);
    res.status(500).json({ error: 'Failed to fetch responses.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
