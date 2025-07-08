import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Skill } from "../../../types";

const DATA_PATH = path.join(process.cwd(), 'src/data/skills.json');

function readSkills(): Skill[] {
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data) as Skill[];
}

function writeSkills(skills: Skill[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(skills, null, 2));
}

export async function GET() {
  let skills = readSkills();
  skills = skills.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const skills = readSkills();
  skills.push({
    ...body,
    icon: body.icon || '🛠️',
    category: body.category || 'General',
    proficiency: body.proficiency || 'Intermediate',
    order: typeof body.order === 'number' ? body.order : skills.length
  });
  writeSkills(skills);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const skills = readSkills();
  const idx = skills.findIndex((s: Skill) => s.id === body.id);
  if (idx !== -1) {
    skills[idx] = {
      ...skills[idx],
      ...body,
      icon: body.icon || skills[idx].icon || '🛠️',
      category: body.category || skills[idx].category || 'General',
      proficiency: body.proficiency || skills[idx].proficiency || 'Intermediate',
      order: typeof body.order === 'number' ? body.order : skills[idx].order
    };
    writeSkills(skills);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let skills = readSkills();
  const initialLength = skills.length;
  skills = skills.filter((s: Skill) => s.id !== id);
  if (skills.length !== initialLength) {
    writeSkills(skills);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
} 