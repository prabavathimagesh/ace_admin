import '../globals.css';
import './dashboard.css';
import Sidebar from './components/Sidebar';

export const metadata = { title: 'Admin' };

export default function AdminLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
