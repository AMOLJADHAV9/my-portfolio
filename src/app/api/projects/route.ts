import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Project } from "../../../types";

const DATA_PATH = path.join(process.cwd(), 'src/data/projects.json');

function readProjects(): Project[] {
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data) as Project[];
}

function writeProjects(projects: Project[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
}

export async function GET() {
  let projects = readProjects();
  projects = projects.sort((a, b) => {
    if (b.featured !== a.featured) return Number(b.featured) - Number(a.featured);
    return (a.order ?? 0) - (b.order ?? 0);
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const projects = readProjects();
  projects.push({
    ...body,
    icon: body.icon || '💻',
    featured: !!body.featured,
    visible: body.visible !== false,
    order: typeof body.order === 'number' ? body.order : projects.length
  });
  writeProjects(projects);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const projects = readProjects();
  const idx = projects.findIndex((p: Project) => p.id === body.id);
  if (idx !== -1) {
    projects[idx] = {
      ...projects[idx],
      ...body,
      icon: body.icon || projects[idx].icon || '💻',
      featured: !!body.featured,
      visible: body.visible !== false,
      order: typeof body.order === 'number' ? body.order : projects[idx].order
    };
    writeProjects(projects);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let projects = readProjects();
  const initialLength = projects.length;
  projects = projects.filter((p: Project) => p.id !== id);
  if (projects.length !== initialLength) {
    writeProjects(projects);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
} 