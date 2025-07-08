"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAnimation } from "framer-motion";
import { FaArrowDown, FaEnvelope, FaPhone, FaLinkedin, FaGithub } from "react-icons/fa6";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiFramer } from "react-icons/si";
import { FaMobileAlt } from "react-icons/fa";
import { FaCode, FaPaintBrush, FaRocket } from "react-icons/fa";
import FloatingNav from "../components/FloatingNav";
import Image from "next/image";

// Type definitions
interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  icon: React.ReactNode;
  live: string;
  github: string;
}

const typewriterWords = [
  "a Creative Web Developer.",
  "a UI/UX Enthusiast.",
  "a Futuristic Coder.",
];

function useTypewriter(words: string[], speed = 80, pause = 1200) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, speed, pause]);

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span>
      {words[index].substring(0, subIndex)}
      <span className="inline-block w-2">{blink ? "|" : " "}</span>
    </span>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  const [count, setCount] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = 0;
    setCount(0);
    const end = value;
    if (end === 0) return;
    const increment = end / 40;
    const timer = setInterval(() => {
      startRef.current += increment;
      if (startRef.current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(startRef.current));
      }
    }, 24);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold text-accent drop-shadow-lg">{count}+</span>
      <span className="text-sm text-foreground/70 mt-1">{label}</span>
    </div>
  );
}

const skills = [
  { name: "HTML", icon: <FaHtml5 />, level: 95 },
  { name: "CSS", icon: <FaCss3Alt />, level: 92 },
  { name: "JavaScript", icon: <FaJs />, level: 90 },
  { name: "TypeScript", icon: <SiTypescript />, level: 85 },
  { name: "React", icon: <FaReact />, level: 90 },
  { name: "Next.js", icon: <SiNextdotjs />, level: 85 },
  { name: "Node.js", icon: <FaNodeJs />, level: 80 },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, level: 88 },
  { name: "Framer Motion", icon: <SiFramer />, level: 80 },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Product Manager, TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Amol is a rare developer who combines technical skill with a designer's eye. Our project was a huge success!",
  },
  {
    name: "Rahul Verma",
    role: "Lead Engineer, Webify",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    quote: "Working with Amol was a delight. He delivered on time and exceeded our expectations in every way.",
  },
  {
    name: "Sara Lee",
    role: "Founder, StartupX",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "The animations and polish Amol brought to our site made all the difference. Highly recommended!",
  },
];

// Section animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Animation controls for each section
  const heroControls = useAnimation();
  const aboutControls = useAnimation();
  const skillsControls = useAnimation();
  const projectsControls = useAnimation();
  const servicesControls = useAnimation();
  const testimonialsControls = useAnimation();
  const contactControls = useAnimation();

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data as Project[]);
      setLoadingProjects(false);
    }
    fetchProjects();
  }, []);

  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    fetch("https://formspree.io/f/xjkrqwge", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (response.ok) {
        setContactSuccess(true);
        form.reset();
      }
    });
  }

  // Scroll to next section (placeholder)
  const handleScroll = () => {
    const about = document.getElementById("about");
    if (about) about.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <FloatingNav />
      <div className="snap-y overflow-y-auto h-screen" ref={mainScrollRef}>
        <motion.section
          ref={heroRef}
          className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-glass backdrop-blur-md text-foreground px-4 snap-start"
          style={{ fontFamily: "var(--font-geist-sans)" }}
          variants={sectionVariants}
          initial="hidden"
          animate={heroControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => heroControls.start('hidden')}
        >
          {/* Animated Blobs Background */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <svg width="100%" height="100%" className="w-full h-full absolute">
              <defs>
                <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse
                cx="60%" cy="40%" rx="340" ry="180"
                fill="url(#blob1)" filter="blur(80px)"
              />
              <ellipse
                cx="30%" cy="70%" rx="220" ry="120"
                fill="#fff" fillOpacity="0.08" filter="blur(60px)"
              />
            </svg>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl sm:text-6xl font-bold text-white text-glow drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Hi, I&apos;m Amol Jadhav
            </motion.h1>
            <motion.h2
              className="text-xl sm:text-3xl font-medium text-white text-glow bg-glass px-4 py-2 rounded-xl shadow-glass backdrop-blur-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {useTypewriter(typewriterWords)}
            </motion.h2>
            <motion.p
              className="max-w-xl text-base sm:text-lg text-foreground/80 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              I am a passionate web developer specializing in building immersive, animated, and accessible web experiences. With a strong background in UI/UX and a keen eye for detail, I transform ideas into high-performing digital products.
            </motion.p>
            <div className="flex flex-wrap justify-center gap-6 mt-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-accent">20+</span>
                <span className="text-xs text-foreground/70">Web Apps Built</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-accent">3</span>
                <span className="text-xs text-foreground/70">Years Experience</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-accent">5</span>
                <span className="text-xs text-foreground/70">Countries Served</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <motion.a
                href="#projects"
                className="px-6 py-3 rounded-full bg-accent text-white font-semibold shadow-glass hover:bg-accent-dark transition-colors"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                See My Work
              </motion.a>
              <motion.a
                href="#contact"
                className="px-6 py-3 rounded-full border border-accent text-accent font-semibold bg-glass hover:bg-accent hover:text-background transition-colors"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                Let&apos;s Talk
              </motion.a>
              <motion.a
                href="/api/resume-pdf"
                className="px-6 py-3 rounded-full border border-accent text-accent font-semibold bg-glass hover:bg-accent hover:text-background transition-colors"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
              >
                Download Resume
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll Down Icon */}
          <motion.button
            onClick={handleScroll}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            aria-label="Scroll down"
          >
            <FaArrowDown className="text-accent text-3xl animate-bounce group-hover:scale-110 transition-transform" />
            <span className="text-xs text-foreground/60 mt-1">Scroll</span>
          </motion.button>
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          className="relative flex flex-col md:flex-row items-center justify-center gap-10 py-24 px-4 sm:px-10 max-w-5xl mx-auto z-10 snap-start bg-glass backdrop-blur-md"
          variants={sectionVariants}
          initial="hidden"
          animate={aboutControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => aboutControls.start('hidden')}
        >
          {/* Photo with tilt effect */}
          <motion.div
            className="w-40 h-40 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-glass bg-glass backdrop-blur-xs flex-shrink-0"
            whileHover={{ rotate: 4, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <Image
              src="/profile/photo.jpg"
              alt="Amol Jadhav photo"
              width={224}
              height={224}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Text and counters */}
          <motion.div
            className="flex-1 flex flex-col gap-6 items-center md:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.4 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.18 } },
            }}
          >
            <motion.h3
              className="text-3xl sm:text-4xl font-bold text-white text-glow mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Me
            </motion.h3>
            <motion.p
              className="text-lg text-foreground/80 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              I&apos;m a creative developer with a background in Computer Science and a passion for blending design and technology. My journey began at a young age, and since then, I&apos;ve worked with startups, agencies, and global clients to deliver impactful digital solutions. I believe in continuous learning, collaboration, and building products that make a difference.
            </motion.p>
            <ul className="list-disc pl-6 text-foreground/70 text-base">
              <li>🎓 B.Tech in Computer Science</li>
              <li>🌏 Remote work experience with clients in 5+ countries</li>
              <li>💡 Loves rapid prototyping and design sprints</li>
            </ul>
            <div className="flex gap-8 mt-4">
              <Counter label="Projects" value={24} />
              <Counter label="Clients" value={8} />
              <Counter label="Years" value={3} />
            </div>
            <div className="mt-6 w-full">
              <h4 className="text-accent font-semibold mb-2">Timeline</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>2018: Wrote my first line of code</li>
                <li>2020: Built my first freelance website</li>
                <li>2021: Joined a startup as a Frontend Developer</li>
                <li>2022: Won a UI/UX hackathon</li>
                <li>2023: Launched this portfolio</li>
              </ul>
            </div>
            <motion.a
              href="/api/resume-pdf"
              className="mt-6 px-6 py-3 rounded-full bg-glass border border-accent text-accent font-semibold shadow-glass hover:bg-accent hover:text-background transition-colors backdrop-blur-xs"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              Download Resume
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          className="relative py-24 px-4 sm:px-10 max-w-5xl mx-auto z-10 flex flex-col items-center snap-start bg-glass backdrop-blur-md"
          variants={sectionVariants}
          initial="hidden"
          animate={skillsControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => skillsControls.start('hidden')}
        >
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-white text-glow mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Skills & Toolbox
          </motion.h3>
          <div className="w-full flex flex-col md:flex-row gap-12 mb-12">
            <div className="flex-1">
              <h4 className="text-accent font-semibold mb-4">Frontend</h4>
              <ul className="grid grid-cols-2 gap-3 text-foreground/80 text-base">
                <li>React <span className="text-xs text-accent ml-2">Advanced</span></li>
                <li>Next.js <span className="text-xs text-accent ml-2">Advanced</span></li>
                <li>TypeScript <span className="text-xs text-accent ml-2">Proficient</span></li>
                <li>Tailwind CSS <span className="text-xs text-accent ml-2">Proficient</span></li>
                <li>Framer Motion <span className="text-xs text-accent ml-2">Proficient</span></li>
                <li>HTML5/CSS3 <span className="text-xs text-accent ml-2">Expert</span></li>
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="text-accent font-semibold mb-4">Backend & Tools</h4>
              <ul className="grid grid-cols-2 gap-3 text-foreground/80 text-base">
                <li>Node.js <span className="text-xs text-accent ml-2">Intermediate</span></li>
                <li>Express.js <span className="text-xs text-accent ml-2">Intermediate</span></li>
                <li>MongoDB <span className="text-xs text-accent ml-2">Intermediate</span></li>
                <li>Git & GitHub <span className="text-xs text-accent ml-2">Proficient</span></li>
                <li>Figma <span className="text-xs text-accent ml-2">Proficient</span></li>
                <li>Vercel <span className="text-xs text-accent ml-2">Proficient</span></li>
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="text-accent font-semibold mb-4">Certifications</h4>
              <ul className="text-foreground/80 text-base space-y-2">
                <li>Certified React Developer (Coursera)</li>
                <li>Responsive Web Design (freeCodeCamp)</li>
                <li>UI/UX Design Specialization (Google)</li>
              </ul>
            </div>
          </div>
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                className="flex flex-col items-center group cursor-pointer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.97 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="text-5xl md:text-6xl text-accent drop-shadow-lg mb-2">
                  {skill.icon}
                </div>
                <span className="text-xs text-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity bg-glass px-2 py-1 rounded shadow-glass mt-1">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
          {/* Progress bars */}
          <div className="w-full flex flex-col gap-6">
            {skills.map((skill) => (
              <motion.div
                key={skill.name + "-bar"}
                className="w-full"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground/80">{skill.name}</span>
                  <span className="text-sm text-accent font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-3 bg-glass rounded-full overflow-hidden">
                  <motion.div
                    className="h-3 bg-accent rounded-full shadow-glass"
                    initial={{ width: 0 }}
                    whileInView={{ width: skill.level + "%" }}
                    viewport={{ amount: 0.3 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          className="relative py-24 px-4 sm:px-10 max-w-6xl mx-auto z-10 flex flex-col items-center snap-start bg-glass backdrop-blur-md"
          variants={sectionVariants}
          initial="hidden"
          animate={projectsControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => projectsControls.start('hidden')}
        >
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-white text-glow mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Projects
          </motion.h3>
          {loadingProjects ? (
            <div className="text-center text-lg text-foreground/70 mb-8">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-lg text-foreground/70 mb-8">No projects found.</div>
          ) : (
            <>
              <div className="w-full mb-12">
                <div className="bg-glass rounded-2xl shadow-glass p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-accent mb-8">
                  <div className="flex-shrink-0 text-6xl text-accent">💻</div>
                  <div>
                    {(() => {
                      const { title, description, tech } = projects[0] as { title: string; description: string; tech: string | string[] };
                      return (
                        <>
                          <h4 className="text-2xl font-bold text-accent mb-2">{title} <span className="ml-2 px-2 py-1 text-xs bg-accent/20 text-accent rounded">Featured</span></h4>
                          <p className="text-foreground/80 mb-2">{description}</p>
                          <ul className="flex flex-wrap gap-2 mb-2">
                            {typeof tech === "string"
                              ? tech.split(",").map((t: string) => (
                                  <li key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">{t.trim()}</li>
                                ))
                              : Array.isArray(tech)
                              ? tech.map((t: string) => (
                                  <li key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">{t.trim()}</li>
                                ))
                              : null}
                          </ul>
                        </>
                      );
                    })()}
                    <div className="flex gap-3 mt-2">
                      <a href={projects[0].live} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-accent text-background font-semibold shadow-glass hover:bg-accent-dark transition-colors text-sm">Live Preview</a>
                      <a href={projects[0].github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-accent text-accent font-semibold bg-glass hover:bg-accent hover:text-background transition-colors text-sm">GitHub</a>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
              >
                {projects.slice(1).map((project) => (
                  <motion.div
                    key={project.id}
                    className="relative bg-glass rounded-2xl shadow-glass overflow-hidden group cursor-pointer flex flex-col min-h-[320px]"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="h-40 bg-gradient-to-br from-accent/30 to-glass-dark/60 flex items-center justify-center">
                      <span className="text-5xl">💻</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold mb-2 text-accent">{project.title}</h4>
                      <p className="text-foreground/80 mb-4 flex-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {typeof project.tech === "string"
                          ? (project.tech as string).split(",").map((t: string) => (
                              <span key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">{t.trim()}</span>
                            ))
                          : Array.isArray(project.tech)
                          ? (project.tech as string[]).map((t: string) => (
                              <span key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">{t.trim()}</span>
                            ))
                          : null}
                      </div>
                      <div className="flex gap-3 mt-auto">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full bg-accent text-background font-semibold shadow-glass hover:bg-accent-dark transition-colors text-sm"
                        >
                          Live Preview
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full border border-accent text-accent font-semibold bg-glass hover:bg-accent hover:text-background transition-colors text-sm"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-bold z-10 pointer-events-none">
                      View Details
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
          {/* Modal for project preview */}
          {modalProject && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setModalProject(null)}>
              <motion.div
                className="bg-glass-dark rounded-2xl shadow-glass p-8 max-w-lg w-full relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-4 right-4 text-accent text-2xl" onClick={() => setModalProject(null)}>&times;</button>
                <div className="flex flex-col items-center gap-4">
                  <span className="text-6xl">{modalProject.icon}</span>
                  <h4 className="text-2xl font-bold text-accent mb-2">{modalProject.title}</h4>
                  <p className="text-foreground/80 mb-4">{modalProject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {modalProject.tech.map((t: string) => (
                      <span key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={modalProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-accent text-background font-semibold shadow-glass hover:bg-accent-dark transition-colors text-sm"
                    >
                      Live Preview
                    </a>
                    <a
                      href="https://github.com/AMOLJADHAV9/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-accent text-accent font-semibold bg-glass hover:bg-accent hover:text-background transition-colors text-sm"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* Services Section */}
        <motion.section
          id="services"
          className="relative py-24 px-4 sm:px-10 max-w-5xl mx-auto z-10 flex flex-col items-center snap-start bg-glass backdrop-blur-md"
          variants={sectionVariants}
          initial="hidden"
          animate={servicesControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => servicesControls.start('hidden')}
        >
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-white text-glow mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Services
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.div
              className="relative bg-glass rounded-2xl shadow-glass overflow-hidden flex flex-col items-center p-8 min-h-[260px] group hover:shadow-[0_0_32px_0_rgba(56,189,248,0.25)] transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent/20 rounded-full p-4 shadow-lg animate-float">
                <span className="text-4xl text-accent drop-shadow-lg"><FaCode /></span>
              </div>
              <h4 className="text-xl font-bold text-accent mt-10 mb-2 text-center">Web Development</h4>
              <ul className="text-foreground/80 text-center text-base mb-2 space-y-1">
                <li>Modern, responsive websites</li>
                <li>Performance optimization</li>
                <li>SEO best practices</li>
                <li>Accessibility compliance</li>
              </ul>
            </motion.div>
            <motion.div
              className="relative bg-glass rounded-2xl shadow-glass overflow-hidden flex flex-col items-center p-8 min-h-[260px] group hover:shadow-[0_0_32px_0_rgba(56,189,248,0.25)] transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent/20 rounded-full p-4 shadow-lg animate-float">
                <span className="text-4xl text-accent drop-shadow-lg"><FaPaintBrush /></span>
              </div>
              <h4 className="text-xl font-bold text-accent mt-10 mb-2 text-center">UI/UX Design</h4>
              <ul className="text-foreground/80 text-center text-base mb-2 space-y-1">
                <li>Wireframing & prototyping</li>
                <li>Design systems & style guides</li>
                <li>Micro-interactions & animations</li>
                <li>User research & testing</li>
              </ul>
            </motion.div>
            <motion.div
              className="relative bg-glass rounded-2xl shadow-glass overflow-hidden flex flex-col items-center p-8 min-h-[260px] group hover:shadow-[0_0_32px_0_rgba(56,189,248,0.25)] transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent/20 rounded-full p-4 shadow-lg animate-float">
                <span className="text-4xl text-accent drop-shadow-lg"><FaMobileAlt /></span>
              </div>
              <h4 className="text-xl font-bold text-accent mt-10 mb-2 text-center">Mobile Apps</h4>
              <ul className="text-foreground/80 text-center text-base mb-2 space-y-1">
                <li>Cross-platform React Native apps</li>
                <li>App UI/UX design</li>
                <li>Performance & accessibility</li>
                <li>App store deployment</li>
              </ul>
            </motion.div>
            <motion.div
              className="relative bg-glass rounded-2xl shadow-glass overflow-hidden flex flex-col items-center p-8 min-h-[260px] group hover:shadow-[0_0_32px_0_rgba(56,189,248,0.25)] transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent/20 rounded-full p-4 shadow-lg animate-float">
                <span className="text-4xl text-accent drop-shadow-lg"><FaRocket /></span>
              </div>
              <h4 className="text-xl font-bold text-accent mt-10 mb-2 text-center">Performance & SEO</h4>
              <ul className="text-foreground/80 text-center text-base mb-2 space-y-1">
                <li>Site speed audits</li>
                <li>Core Web Vitals optimization</li>
                <li>SEO strategy & implementation</li>
                <li>Analytics & reporting</li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          id="testimonials"
          className="relative py-24 px-4 sm:px-10 max-w-3xl mx-auto z-10 flex flex-col items-center snap-start bg-glass backdrop-blur-md"
          variants={sectionVariants}
          initial="hidden"
          animate={testimonialsControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => testimonialsControls.start('hidden')}
        >
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-white text-glow mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Testimonials
          </motion.h3>
          <div className="relative w-full flex flex-col items-center">
            <motion.div
              className="w-full flex justify-center"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                key={testimonials[testimonialIdx].name}
                className="bg-glass rounded-2xl shadow-glass p-8 flex flex-col items-center gap-4 min-h-[220px] max-w-xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                layout
              >
                <Image
                  src={testimonials[testimonialIdx].avatar}
                  alt={testimonials[testimonialIdx].name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-4 border-accent mb-2"
                />
                <p className="text-lg text-foreground/80 text-center">&quot;{testimonials[testimonialIdx].quote}&quot;</p>
                <span className="text-accent font-bold mt-2">{testimonials[testimonialIdx].name}</span>
                <span className="text-xs text-foreground/60">{testimonials[testimonialIdx].role}</span>
              </motion.div>
            </motion.div>
            <div className="flex gap-4 mt-6">
              <button
                className="w-10 h-10 rounded-full bg-glass border border-accent text-accent hover:bg-accent hover:text-background transition-colors flex items-center justify-center"
                onClick={() => setTestimonialIdx((idx) => (idx - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
              >
                &#8592;
              </button>
              <button
                className="w-10 h-10 rounded-full bg-glass border border-accent text-accent hover:bg-accent hover:text-background transition-colors flex items-center justify-center"
                onClick={() => setTestimonialIdx((idx) => (idx + 1) % testimonials.length)}
                aria-label="Next testimonial"
              >
                &#8594;
              </button>
            </div>
            <div className="mt-8 text-center text-foreground/70 text-base">
              <p>Want to share your experience? <a href="#contact" className="text-accent underline">Contact me</a> to add your testimonial!</p>
            </div>
          </div>
        </motion.section>

        {/* Contact Me Section */}
        <motion.section
          id="contact"
          className="relative py-24 px-4 sm:px-10 max-w-2xl mx-auto z-10 flex flex-col items-center snap-start bg-glass backdrop-blur-md"
          variants={sectionVariants}
          initial="hidden"
          animate={contactControls}
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          onViewportLeave={() => contactControls.start('hidden')}
        >
          <motion.h3
            className="text-3xl sm:text-4xl font-bold text-white text-glow mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 0.8 }}
          >
            Contact Me
          </motion.h3>
          <div className="mb-6 text-lg text-foreground/80 text-center max-w-xl">
            <p>Have a project in mind, want to collaborate, or just want to say hello? I&apos;d love to hear from you! Fill out the form below or reach out via email or LinkedIn. I respond within 24 hours.</p>
          </div>
          {contactSuccess ? (
            <div className="bg-glass rounded-2xl shadow-glass p-8 text-center text-accent text-xl font-semibold">
              Thank you! Your message has been sent. I&apos;ll get back to you soon.
            </div>
          ) : (
            <form
              className="w-full bg-glass rounded-2xl shadow-glass p-8 flex flex-col gap-6"
              onSubmit={handleContactSubmit}
            >
              <motion.input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-accent/30 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              <motion.input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full px-4 py-3 rounded-lg border border-accent/30 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.textarea
                name="message"
                placeholder="Your Message"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-accent/30 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <input type="hidden" name="_replyto" value="amolj9238@gmail.com" />
              <motion.button
                type="submit"
                className="mt-2 px-6 py-3 rounded-full bg-accent text-white font-semibold shadow-glass hover:bg-accent-dark transition-colors"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Send Message
              </motion.button>
            </form>
          )}
          {/* Contact Icons */}
          <div className="flex gap-6 mt-8">
            <a href="mailto:amolj9238@gmail.com" className="text-accent text-2xl hover:scale-110 transition-transform" aria-label="Email"><FaEnvelope /></a>
            <a href="tel:9552678123" className="text-accent text-2xl hover:scale-110 transition-transform" aria-label="Phone"><FaPhone /></a>
            <a href="https://linkedin.com/in/amoljadhav" target="_blank" rel="noopener noreferrer" className="text-accent text-2xl hover:scale-110 transition-transform" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://github.com/AMOLJADHAV9/" target="_blank" rel="noopener noreferrer" className="text-accent text-2xl hover:scale-110 transition-transform" aria-label="GitHub"><FaGithub /></a>
          </div>
        </motion.section>

        {/* Footer Section */}
        <footer className="relative py-10 px-4 sm:px-10 w-full flex flex-col items-center bg-gradient-to-t from-glass-dark/80 via-glass/60 to-transparent z-10 mt-12 snap-start">
          <div className="flex gap-6 mb-4">
            <a href="#" className="text-foreground/60 text-sm hover:text-accent transition-colors">Home</a>
            <a href="#about" className="text-foreground/60 text-sm hover:text-accent transition-colors">About</a>
            <a href="#projects" className="text-foreground/60 text-sm hover:text-accent transition-colors">Projects</a>
            <a href="#contact" className="text-foreground/60 text-sm hover:text-accent transition-colors">Contact</a>
          </div>
          <div className="flex gap-6 mb-4">
            <a href="mailto:amolj9238@gmail.com" className="text-accent text-2xl hover:scale-125 transition-transform" aria-label="Email"><FaEnvelope /></a>
            <a href="https://linkedin.com/in/amoljadhav" target="_blank" rel="noopener noreferrer" className="text-accent text-2xl hover:scale-125 transition-transform" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://github.com/AMOLJADHAV9/" target="_blank" rel="noopener noreferrer" className="text-accent text-2xl hover:scale-125 transition-transform" aria-label="GitHub"><FaGithub /></a>
          </div>
          <motion.button
            onClick={() => {
              if (mainScrollRef.current) {
                mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="mt-2 px-6 py-2 rounded-full bg-glass border border-accent text-accent font-semibold shadow-glass hover:bg-accent hover:text-background transition-colors"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label="Back to top"
          >
            ↑ Back to Top
          </motion.button>
          <div className="mt-6 text-xs text-foreground/60 text-center">
            &copy; {new Date().getFullYear()} Amol Jadhav. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
