import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import BrandSelectClient from './BrandSelectClient';

export default async function BrandSelectPage() {
  const session = await getSession();

  // If the user is an admin, redirect them to the admin dashboard
  if (session.role === 'admin') {
    redirect('/admin');
  }

  // Otherwise render the client component
  return <BrandSelectClient />;
}