'use client';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function AdminLayoutInner({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [logoSrc, setLogoSrc] = useState('/images/logos/logo-blanc.png');
  const isLoginPage = pathname === '/admin/login';
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
    fetch('/api/content')
      .then(r => r.json())
      .then(data => { if (data.logo_white) setLogoSrc(data.logo_white); })
      .catch(() => {});
  }, [status, isLoginPage, router]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--navy-darkest)', color: 'var(--white)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  const menuItems = [
    { href: '/admin', label: 'Tableau de bord', icon: '📊' },
    { href: '/admin/projets', label: 'Gérer les Projets', icon: '📂' },
    { href: '/admin/services', label: 'Gérer les Services', icon: '💼' },
    { href: '/admin/formations', label: 'Gérer les Formations', icon: '🎓' },
    { href: '/admin/evenements', label: 'Gérer les Événements', icon: '📅' },
    { href: '/admin/contenu', label: 'Textes, Images & Bio', icon: '📝' },
    { href: '/admin/contact-info', label: 'Coordonnées', icon: '📍' },
    { href: '/admin/messages', label: 'Messages reçus', icon: '✉️' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Toggle */}
      <button 
        style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1002, background: 'var(--navy-dark)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.8rem', cursor: 'pointer' }}
        className="hidden show-mobile-inline"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        Menu
      </button>

      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src={logoSrc} alt="TAVLEN" />
          <span>Console Admin</span>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-section">Gestion du site</div>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); signOut({ callbackUrl: '/admin/login' }); }}>
            <span>🚪</span> Déconnexion
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>TAVLEN Solutions</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Connecté en tant que : {session.user.name}</p>
          </div>
          <div className="admin-topbar-actions">
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              👁️ Voir le site public
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayoutClient({ children }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
