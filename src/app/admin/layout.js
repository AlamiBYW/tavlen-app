import AdminLayoutClient from './AdminLayoutClient';

export const metadata = {
  title: 'Panneau d&apos;administration — TAVLEN Solutions',
  description: 'Gérer le contenu du site TAVLEN Solutions',
};

export default function AdminLayout({ children }) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
