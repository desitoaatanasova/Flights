import { Link } from 'react-router-dom';
import { Plane, MessageCircle, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#060B17] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <Plane className="w-5 h-5 text-sky-400" />
              <span className="text-white">Aero</span>
              <span className="text-sky-400">Track</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Modern airline flight management system. Track flights, manage aircraft, pilots, and crew in real time.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Navigation</h4>
            <div className="space-y-2 text-sm">
              {['Flights', 'Airlines', 'Aircraft', 'Pilots', 'Crew'].map((l) => (
                <Link
                  key={l}
                  to={`/${l.toLowerCase()}`}
                  className="block text-white/40 hover:text-white transition"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Tools</h4>
            <div className="space-y-2 text-sm">
              <Link to="/radar" className="block text-white/40 hover:text-white transition">Flight Radar</Link>
              <Link to="/statistics" className="block text-white/40 hover:text-white transition">Statistics</Link>
              <Link to="/search" className="block text-white/40 hover:text-white transition">Search</Link>
              <Link to="/admin" className="block text-white/40 hover:text-white transition">Admin Panel</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              {[MessageCircle, ExternalLink, Globe].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center text-white/30 text-xs">
          &copy; {new Date().getFullYear()} AeroTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
