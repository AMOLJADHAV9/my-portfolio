"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import SkillsManager from "./SkillsManager";
import type { Project } from "../../types";

const ADMIN_PASSWORD = "amoladmin123"; // Change this to your secure password

function emptyProject() {
  return {
    id: "",
    icon: "💻",
    title: "",
    description: "",
    tech: "",
    live: "",
    github: "",
    featured: false,
    visible: true,
    order: 0,
  };
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyProject());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'projects' | 'skills'>('projects');

  useEffect(() => {
    if (authenticated) fetchProjects();
    // eslint-disable-next-line
  }, [authenticated]);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAddOrEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title || !form.description) return;
    if (editingId) {
      // Edit
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
    } else {
      // Add
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: Date.now().toString() }),
      });
    }
    setForm(emptyProject());
    setEditingId(null);
    fetchProjects();
  }

  function handleEdit(project: Project) {
    setForm(project);
    setEditingId(project.id);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this project?")) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProjects();
  }

  function handleCancelEdit() {
    setForm(emptyProject());
    setEditingId(null);
  }

  async function handleReorder(id: string, direction: number) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= projects.length) return;
    // Swap order values
    const updated = [...projects];
    const temp = updated[idx].order;
    updated[idx].order = updated[newIdx].order;
    updated[newIdx].order = temp;
    // Update both projects in backend
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated[idx]),
    });
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated[newIdx]),
    });
    fetchProjects();
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-glass backdrop-blur-md">
        <form onSubmit={handleLogin} className="bg-white/80 p-8 rounded-xl shadow-lg flex flex-col gap-4 w-80">
          <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            className="px-4 py-2 rounded border border-accent focus:outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="bg-accent text-white py-2 rounded font-semibold hover:bg-accent-dark transition">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-glass backdrop-blur-md py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab('projects')} className={`px-4 py-2 rounded font-semibold ${tab === 'projects' ? 'bg-accent text-white' : 'bg-white/80 text-accent'}`}>Projects</button>
        <button onClick={() => setTab('skills')} className={`px-4 py-2 rounded font-semibold ${tab === 'skills' ? 'bg-accent text-white' : 'bg-white/80 text-accent'}`}>Skills</button>
      </div>
      {tab === 'projects' ? (
        <form onSubmit={handleAddOrEdit} className="bg-white/80 p-6 rounded-xl shadow-lg flex flex-col gap-3 w-full max-w-xl mb-8">
          <h2 className="text-xl font-semibold mb-2">{editingId ? "Edit Project" : "Add Project"}</h2>
          <div className="flex gap-2">
            <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (emoji)" className="w-16 px-2 py-2 rounded border border-accent text-2xl text-center" maxLength={2} />
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="flex-1 px-4 py-2 rounded border border-accent" required />
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="px-4 py-2 rounded border border-accent" required />
          <input name="tech" value={form.tech} onChange={handleChange} placeholder="Tech (comma separated)" className="px-4 py-2 rounded border border-accent" />
          <div className="flex gap-2">
            <input name="live" value={form.live} onChange={handleChange} placeholder="Live URL" className="flex-1 px-4 py-2 rounded border border-accent" />
            <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub URL" className="flex-1 px-4 py-2 rounded border border-accent" />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} /> Featured</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="visible" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} /> Visible</label>
            <label className="flex items-center gap-1 text-sm">Order: <input type="number" name="order" value={form.order} onChange={handleChange} className="w-16 px-2 py-1 rounded border border-accent" /></label>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-accent text-white px-4 py-2 rounded font-semibold hover:bg-accent-dark transition">{editingId ? "Update" : "Add"}</button>
            {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-300 px-4 py-2 rounded font-semibold">Cancel</button>}
          </div>
          {/* Live Preview Card */}
          <div className="mt-6">
            <div className="bg-glass rounded-2xl shadow-glass p-6 flex flex-col min-h-[220px] max-w-xl mx-auto border border-accent/20">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl">{form.icon || "💻"}</span>
                <h4 className="text-xl font-bold text-accent">{form.title || "Project Title"} {form.featured && <span className="ml-2 px-2 py-1 text-xs bg-accent/20 text-accent rounded">Featured</span>}</h4>
              </div>
              <p className="text-foreground/80 mb-2">{form.description || "Project description..."}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tech && form.tech.split ? form.tech.split(",").map((t: string) => (
                  <span key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">{t.trim()}</span>
                )) : null}
              </div>
              <div className="flex gap-3 mt-2">
                {form.live && <a href={form.live} target="_blank" className="px-4 py-2 rounded-full bg-accent text-background font-semibold shadow-glass hover:bg-accent-dark transition-colors text-sm">Live Preview</a>}
                {form.github && <a href={form.github} target="_blank" className="px-4 py-2 rounded-full border border-accent text-accent font-semibold bg-glass hover:bg-accent hover:text-background transition-colors text-sm">GitHub</a>}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <SkillsManager />
      )}
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">All Projects</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full bg-white/80 rounded-xl shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-accent/10">
                <th className="p-2 text-left">Icon</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Tech</th>
                <th className="p-2 text-left">Live</th>
                <th className="p-2 text-left">GitHub</th>
                <th className="p-2 text-left">Featured</th>
                <th className="p-2 text-left">Visible</th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, idx) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="p-2 text-2xl">{p.icon}</td>
                  <td className="p-2 font-semibold">{p.title}</td>
                  <td className="p-2 text-sm max-w-xs truncate">{p.description}</td>
                  <td className="p-2 text-xs">{p.tech}</td>
                  <td className="p-2 text-xs"><a href={p.live} target="_blank" className="text-accent underline">Live</a></td>
                  <td className="p-2 text-xs"><a href={p.github} target="_blank" className="text-accent underline">GitHub</a></td>
                  <td className="p-2 text-center">{p.featured ? "✅" : ""}</td>
                  <td className="p-2 text-center">{p.visible ? "✅" : "❌"}</td>
                  <td className="p-2 text-center">{p.order}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                    {/* Reorder controls */}
                    <button disabled={idx === 0} onClick={async () => { await handleReorder(p.id, -1); }} className="bg-gray-300 text-xs px-2 py-1 rounded disabled:opacity-50">↑</button>
                    <button disabled={idx === projects.length - 1} onClick={async () => { await handleReorder(p.id, 1); }} className="bg-gray-300 text-xs px-2 py-1 rounded disabled:opacity-50">↓</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 