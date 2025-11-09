import { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <main className={className}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
