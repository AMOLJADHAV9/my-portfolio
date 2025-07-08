"use client";
import { useState, useEffect } from "react";

const CATEGORIES = ["Frontend", "Backend & Tools", "Certifications", "Other"];
const PROFICIENCIES = ["Beginner", "Intermediate", "Proficient", "Advanced", "Expert"];

function emptySkill() {
  return {
    id: "",
    name: "",
    icon: "🛠️",
    category: CATEGORIES[0],
    proficiency: PROFICIENCIES[2],
    level: 80,
    order: 0,
    visible: true,
  };
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [form, setForm] = useState(emptySkill());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data);
    setLoading(false);
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSlider(e: any) {
    setForm({ ...form, level: Number(e.target.value) });
  }

  async function handleAddOrEdit(e: any) {
    e.preventDefault();
    if (!form.name) return;
    if (editingId) {
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingId }),
      });
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: Date.now().toString() }),
      });
    }
    setForm(emptySkill());
    setEditingId(null);
    fetchSkills();
  }

  function handleEdit(skill: any) {
    setForm(skill);
    setEditingId(skill.id);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this skill?")) return;
    await fetch("/api/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchSkills();
  }

  function handleCancelEdit() {
    setForm(emptySkill());
    setEditingId(null);
  }

  async function handleReorder(id: string, direction: number) {
    const idx = skills.findIndex(s => s.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= skills.length) return;
    const updated = [...skills];
    const temp = updated[idx].order;
    updated[idx].order = updated[newIdx].order;
    updated[newIdx].order = temp;
    await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated[idx]),
    });
    await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated[newIdx]),
    });
    fetchSkills();
  }

  async function handleToggleVisible(skill: any) {
    await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...skill, visible: !skill.visible }),
    });
    fetchSkills();
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Skills</h2>
      <form onSubmit={handleAddOrEdit} className="bg-white/80 p-6 rounded-xl shadow-lg flex flex-col gap-3 mb-8">
        <div className="flex gap-2">
          <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (emoji)" className="w-16 px-2 py-2 rounded border border-accent text-2xl text-center" maxLength={2} />
          <input name="name" value={form.name} onChange={handleChange} placeholder="Skill Name" className="flex-1 px-4 py-2 rounded border border-accent" required />
        </div>
        <div className="flex gap-2">
          <select name="category" value={form.category} onChange={handleChange} className="flex-1 px-4 py-2 rounded border border-accent">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="proficiency" value={form.proficiency} onChange={handleChange} className="flex-1 px-4 py-2 rounded border border-accent">
            {PROFICIENCIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input type="number" name="level" value={form.level} onChange={handleSlider} min={0} max={100} className="w-24 px-2 py-2 rounded border border-accent" />
          <input type="number" name="order" value={form.order} onChange={handleChange} className="w-16 px-2 py-2 rounded border border-accent" />
        </div>
        <div className="flex gap-4 items-center mt-2">
          <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="visible" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} /> Visible</label>
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-accent text-white px-4 py-2 rounded font-semibold hover:bg-accent-dark transition">{editingId ? "Update" : "Add"}</button>
          {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-300 px-4 py-2 rounded font-semibold">Cancel</button>}
        </div>
        {/* Live Preview Card */}
        <div className="mt-6">
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="text-5xl md:text-6xl text-accent drop-shadow-lg mb-2">{form.icon}</div>
            <span className="text-xs text-foreground/70 bg-glass px-2 py-1 rounded shadow-glass mt-1">{form.name || "Skill Name"}</span>
            <div className="w-full mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground/80">{form.name || "Skill Name"}</span>
                <span className="text-sm text-accent font-bold">{form.level}%</span>
              </div>
              <div className="w-full h-3 bg-glass rounded-full overflow-hidden">
                <div className="h-3 bg-accent rounded-full shadow-glass" style={{ width: form.level + "%" }} />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2">All Skills</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full bg-white/80 rounded-xl shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-accent/10">
                <th className="p-2 text-left">Icon</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Proficiency</th>
                <th className="p-2 text-left">Level</th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Visible</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, idx) => (
                <tr key={s.id} className="border-b last:border-b-0">
                  <td className="p-2 text-2xl">{s.icon}</td>
                  <td className="p-2 font-semibold">{s.name}</td>
                  <td className="p-2">{s.category}</td>
                  <td className="p-2">{s.proficiency}</td>
                  <td className="p-2">{s.level}</td>
                  <td className="p-2">{s.order}</td>
                  <td className="p-2 text-center">{s.visible ? "✅" : "❌"}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                    <button onClick={() => handleToggleVisible(s)} className="bg-gray-300 text-xs px-2 py-1 rounded">{s.visible ? "Hide" : "Show"}</button>
                    <button disabled={idx === 0} onClick={async () => { await handleReorder(s.id, -1); }} className="bg-gray-300 text-xs px-2 py-1 rounded disabled:opacity-50">↑</button>
                    <button disabled={idx === skills.length - 1} onClick={async () => { await handleReorder(s.id, 1); }} className="bg-gray-300 text-xs px-2 py-1 rounded disabled:opacity-50">↓</button>
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