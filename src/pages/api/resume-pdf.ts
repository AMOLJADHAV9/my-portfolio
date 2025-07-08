import type { NextApiRequest, NextApiResponse } from 'next';
import type { Resume } from '../../src/types';
import fs from 'fs/promises';
import path from 'path';
import PDFDocument from 'pdfkit';

const RESUME_PATH = path.join(process.cwd(), 'src/data/resume.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await fs.readFile(RESUME_PATH, 'utf-8');
  const resume: Resume = JSON.parse(data);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(22).text(resume.name, { underline: true });
  doc.fontSize(16).text(resume.title);
  doc.moveDown();
  doc.fontSize(12).text(resume.summary);
  doc.moveDown();

  doc.fontSize(14).text('Contact', { underline: true });
  Object.entries(resume.contact).forEach(([k, v]) => {
    doc.fontSize(12).text(`${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Education', { underline: true });
  resume.education.forEach((edu) => {
    doc.fontSize(12).text(`${edu.degree}, ${edu.school} (${edu.year})`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Experience', { underline: true });
  resume.experience.forEach((exp) => {
    doc.fontSize(12).text(`${exp.role} at ${exp.company} (${exp.year})`);
    doc.fontSize(11).text(exp.description, { indent: 20 });
    doc.moveDown(0.5);
  });
  doc.moveDown();

  doc.fontSize(14).text('Skills', { underline: true });
  doc.fontSize(12).text(resume.skills.join(', '));
  doc.moveDown();

  doc.fontSize(14).text('Certifications', { underline: true });
  resume.certifications.forEach((cert: string) => {
    doc.fontSize(12).text(cert);
  });

  doc.end();
} 