import React from "react";
import type { Resume } from "../../types";
import Link from "next/link";

async function getResume() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/resume`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch resume');
  return res.json();
}

export default async function ResumePage() {
  const resume: Resume = await getResume();
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{resume.name}</h1>
      <h2 className="text-xl text-gray-600 mb-4">{resume.title}</h2>
      <p className="mb-6">{resume.summary}</p>
      <section className="mb-6">
        <h3 className="font-semibold">Contact</h3>
        <ul>
          <li>Email: <a href={`mailto:${resume.contact.email}`} className="text-blue-600 underline">{resume.contact.email}</a></li>
          <li>Phone: <a href={`tel:${resume.contact.phone}`} className="text-blue-600 underline">{resume.contact.phone}</a></li>
          <li>Location: {resume.contact.location}</li>
          <li>Website: <a href={resume.contact.website} className="text-blue-600 underline" target="_blank">{resume.contact.website}</a></li>
          <li>LinkedIn: <a href={resume.contact.linkedin} className="text-blue-600 underline" target="_blank">{resume.contact.linkedin}</a></li>
          <li>GitHub: <a href={resume.contact.github} className="text-blue-600 underline" target="_blank">{resume.contact.github}</a></li>
        </ul>
      </section>
      <section className="mb-6">
        <h3 className="font-semibold">Education</h3>
        <ul>
          {resume.education.map((edu, i) => (
            <li key={i} className="mb-2">
              <span className="font-medium">{edu.degree}</span>, {edu.school} <span className="text-gray-500">({edu.year})</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h3 className="font-semibold">Experience</h3>
        <ul>
          {resume.experience.map((exp, i) => (
            <li key={i} className="mb-4">
              <div className="font-medium">{exp.role} at {exp.company} <span className="text-gray-500">({exp.year})</span></div>
              <div>{exp.description}</div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h3 className="font-semibold">Skills</h3>
        <ul className="flex flex-wrap gap-2">
          {resume.skills.map((skill: string, i: number) => (
            <li key={i} className="bg-gray-200 rounded px-2 py-1 text-sm">{skill}</li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h3 className="font-semibold">Certifications</h3>
        <ul>
          {resume.certifications.map((cert: string, i: number) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </section>
      <div className="flex gap-4 mt-8">
        <Link href="/api/resume-pdf" className="btn btn-primary">Download as PDF</Link>
        <Link href="/api/resume?download=json" className="btn btn-secondary">Download as JSON</Link>
      </div>
    </main>
  );
} 