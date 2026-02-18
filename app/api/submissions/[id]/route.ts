import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { addSubmission, getSubmissions } from "@/lib/submissions";
import type { Submission } from "@/lib/types";

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get brand from cookie
    const cookieStore = cookies();
    const brand = cookieStore.get('brand')?.value as 'ringomode' | 'cintasign' || 'ringomode';

    // Validate required fields
    if (!body.formType || !body.formTitle || !body.submittedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const submission: Submission = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      formType: body.formType,
      formTitle: body.formTitle,
      submittedBy: body.submittedBy,
      submittedAt: new Date().toISOString(),
      data: body.data || {},
      hasDefects: body.hasDefects || false,
      brand, // store the brand
    };

    await addSubmission(submission);

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to submit form", details: String(error) },
      { status: 500 }
    );
  }
}