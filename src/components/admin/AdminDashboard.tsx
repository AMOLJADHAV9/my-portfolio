import { useState } from "react";

const AdminDashboard = () => {
  const [tab, setTab] = useState("projects");

  return (
    <div className="flex gap-4 mb-6">
      <button className={tab === "projects" ? "tab-active" : "tab"} onClick={() => setTab("projects")}>Projects</button>
      <button className={tab === "skills" ? "tab-active" : "tab"} onClick={() => setTab("skills")}>Skills</button>
      <button className={tab === "resume" ? "tab-active" : "tab"} onClick={() => setTab("resume")}>Resume</button>
    </div>
  );
};

export default AdminDashboard; 