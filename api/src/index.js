import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sslg-feedback-secret-123';
app.use(cors());
app.use(express.json());
// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};
// Public Routes
app.post('/api/feedback', (req, res) => {
    const { category, rating, message, is_anonymous, student_id } = req.body;
    if (!category || !rating) {
        return res.status(400).json({ error: 'Category and rating are required.' });
    }
    try {
        db.prepare(`
      INSERT INTO feedback (category, rating, message, is_anonymous, student_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(category, rating, message, is_anonymous ? 1 : 0, student_id || null);
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
});
// Admin Protected Routes
app.get('/api/admin/stats', authenticateToken, (req, res) => {
    try {
        const totalResponses = db.prepare('SELECT count(*) as count FROM feedback').get().count;
        const categoryDistribution = db.prepare(`
      SELECT category, count(*) as count, AVG(rating) as avg_rating 
      FROM feedback 
      GROUP BY category
    `).all();
        res.json({ totalResponses, categoryDistribution });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats.' });
    }
});
app.get('/api/admin/responses', authenticateToken, (req, res) => {
    try {
        const responses = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all();
        res.json(responses);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch responses.' });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map