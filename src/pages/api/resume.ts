import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const RESUME_PATH = path.join(process.cwd(), 'src/data/resume.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Download as JSON if ?download=json
    if (req.query.download === 'json') {
      try {
        const data = await fs.readFile(RESUME_PATH, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.json"');
        res.status(200).send(data);
        return;
      } catch (err) {
        res.status(500).json({ error: 'Failed to download resume.' });
        return;
      }
    }
    try {
      const data = await fs.readFile(RESUME_PATH, 'utf-8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to load resume.' });
    }
  } else if (req.method === 'POST') {
    const { password, resume } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      await fs.writeFile(RESUME_PATH, JSON.stringify(resume, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save resume.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 