import Movies from '../../components/Movies/Movies';
import Sessions from '../../components/Sessions/Sessions';

export default function AdminPage() {
  return (
    <div className="min-h-screen w-full bg-base-200">
      <Movies/>
      <Sessions/>
      
    </div>
  );
}