import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteHeader } from "@/components/site-header";
import { getSubmissions } from '@/lib/submissions';
import type { Submission } from '@/lib/types';

export const metadata = {
  title: "Admin Dashboard",
  description: "Review and manage HSE inspection submissions.",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'admin') {
    redirect('/');
  }

  // Get brand from cookie
  const cookieStore = cookies();
  const brand = cookieStore.get('brand')?.value as 'ringomode' | 'cintasign' || 'ringomode';

  // Fetch submissions server-side
  let submissions: Submission[] = [];
  try {
    submissions = await getSubmissions();
    if (!Array.isArray(submissions)) submissions = [];
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    submissions = [];
  }

  // Filter submissions by brand.
  // For backward compatibility, submissions without a brand field are treated as 'ringomode'.
  const filteredSubmissions = submissions.filter(s => {
    // If brand field exists, match it; otherwise, include only if current brand is ringomode (old submissions)
    if (!s.brand) {
      return brand === 'ringomode';
    }
    return s.brand === brand;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="admin" />
      <AdminDashboard initialSubmissions={filteredSubmissions} />
    </div>
  );
}