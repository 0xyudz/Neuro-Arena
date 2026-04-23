import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { ArenaPage } from './pages/ArenaPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CreateAgentPage } from './pages/CreateAgentPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

// Layout Component: Mengandung Navbar yang hanya muncul di halaman ini
function AppLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* 1. LANDING PAGE (Tanpa Navbar) */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. APP ROUTES (Dengan Navbar) */}
      <Route element={<AppLayout />}>
        <Route path="/arena" element={<ArenaPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create" element={<CreateAgentPage />} />
        <Route path="/agent/:id" element={<AgentDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;