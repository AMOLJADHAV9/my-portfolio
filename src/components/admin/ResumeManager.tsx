"use client";
import { useState, useEffect } from "react";
import type { Resume } from "../../types";

export default function ResumeManager({ password }: { password: string }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/resume")
      .then((res) => res.json())
      .then(setResume)
      .catch(() => setError("Failed to load resume."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof Resume, value: string | string[] | Resume["contact"] | Resume["education"] | Resume["experience"] | Resume["certifications"]) => {
    setResume((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleContactChange = (field: keyof Resume["contact"], value: string) => {
    setResume((prev) => prev ? { ...prev, contact: { ...prev.contact, [field]: value } } : prev);
  };

  const handleArrayChange = (
    field: "education" | "experience",
    idx: number,
    subfield: string,
    value: string
  ) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = field === "education"
        ? [...prev.education]
        : [...prev.experience];
      arr[idx] = { ...arr[idx], [subfield]: value };
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayAdd = (
    field: "education" | "experience",
    template: Resume["education"][0] | Resume["experience"][0]
  ) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = field === "education"
        ? [...prev.education]
        : [...prev.experience];
      return { ...prev, [field]: [...arr, template] };
    });
  };

  const handleArrayRemove = (field: "education" | "experience", idx: number) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = field === "education"
        ? [...prev.education]
        : [...prev.experience];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSkillChange = (idx: number, value: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = [...prev.skills];
      arr[idx] = value;
      return { ...prev, skills: arr };
    });
  };

  const handleSkillAdd = () => {
    setResume((prev) => prev ? { ...prev, skills: [...prev.skills, ""] } : prev);
  };

  const handleSkillRemove = (idx: number) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = [...prev.skills];
      arr.splice(idx, 1);
      return { ...prev, skills: arr };
    });
  };

  const handleCertChange = (idx: number, value: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = [...prev.certifications];
      arr[idx] = value;
      return { ...prev, certifications: arr };
    });
  };

  const handleCertAdd = () => {
    setResume((prev) => prev ? { ...prev, certifications: [...prev.certifications, ""] } : prev);
  };

  const handleCertRemove = (idx: number) => {
    setResume((prev) => {
      if (!prev) return prev;
      const arr = [...prev.certifications];
      arr.splice(idx, 1);
      return { ...prev, certifications: arr };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, resume }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSuccess(true);
    } catch {
      setError("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading resume...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!resume) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Edit Resume</h2>
      <div>
        <label>Name: <input className="input" value={resume.name} onChange={e => handleChange("name", e.target.value)} /></label>
      </div>
      <div>
        <label>Title: <input className="input" value={resume.title} onChange={e => handleChange("title", e.target.value)} /></label>
      </div>
      <div>
        <label>Summary:<br/>
          <textarea className="input w-full" value={resume.summary} onChange={e => handleChange("summary", e.target.value)} />
        </label>
      </div>
      <div>
        <h3 className="font-semibold">Contact</h3>
        {(Object.keys(resume.contact) as (keyof Resume["contact"])[]).map((key) => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}: <input className="input" value={resume.contact[key]} onChange={e => handleContactChange(key, e.target.value)} /></label>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold">Education</h3>
        {resume.education.map((edu, i) => (
          <div key={i} className="border p-2 my-2">
            <label>Degree: <input className="input" value={edu.degree} onChange={e => handleArrayChange("education", i, "degree", e.target.value)} /></label><br/>
            <label>School: <input className="input" value={edu.school} onChange={e => handleArrayChange("education", i, "school", e.target.value)} /></label><br/>
            <label>Year: <input className="input" value={edu.year} onChange={e => handleArrayChange("education", i, "year", e.target.value)} /></label><br/>
            <button className="btn" onClick={() => handleArrayRemove("education", i)}>Remove</button>
          </div>
        ))}
        <button className="btn" onClick={() => handleArrayAdd("education", { degree: "", school: "", year: "" })}>Add Education</button>
      </div>
      <div>
        <h3 className="font-semibold">Experience</h3>
        {resume.experience.map((exp, i) => (
          <div key={i} className="border p-2 my-2">
            <label>Role: <input className="input" value={exp.role} onChange={e => handleArrayChange("experience", i, "role", e.target.value)} /></label><br/>
            <label>Company: <input className="input" value={exp.company} onChange={e => handleArrayChange("experience", i, "company", e.target.value)} /></label><br/>
            <label>Year: <input className="input" value={exp.year} onChange={e => handleArrayChange("experience", i, "year", e.target.value)} /></label><br/>
            <label>Description:<br/>
              <textarea className="input w-full" value={exp.description} onChange={e => handleArrayChange("experience", i, "description", e.target.value)} />
            </label><br/>
            <button className="btn" onClick={() => handleArrayRemove("experience", i)}>Remove</button>
          </div>
        ))}
        <button className="btn" onClick={() => handleArrayAdd("experience", { role: "", company: "", year: "", description: "" })}>Add Experience</button>
      </div>
      <div>
        <h3 className="font-semibold">Skills</h3>
        {resume.skills.map((skill: string, i: number) => (
          <div key={i} className="flex items-center gap-2 my-1">
            <input className="input" value={skill} onChange={e => handleSkillChange(i, e.target.value)} />
            <button className="btn" onClick={() => handleSkillRemove(i)}>Remove</button>
          </div>
        ))}
        <button className="btn" onClick={handleSkillAdd}>Add Skill</button>
      </div>
      <div>
        <h3 className="font-semibold">Certifications</h3>
        {resume.certifications.map((cert: string, i: number) => (
          <div key={i} className="flex items-center gap-2 my-1">
            <input className="input" value={cert} onChange={e => handleCertChange(i, e.target.value)} />
            <button className="btn" onClick={() => handleCertRemove(i)}>Remove</button>
          </div>
        ))}
        <button className="btn" onClick={handleCertAdd}>Add Certification</button>
      </div>
      <button className="btn btn-primary mt-4" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Resume"}</button>
      {success && <div className="text-green-600">Resume saved!</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
} 