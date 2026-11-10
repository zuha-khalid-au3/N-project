import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import WhatsAppFloat from '../components/WhatsAppFloat.jsx';

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
