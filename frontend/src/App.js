import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "min-h-screen bg-black text-white", children: [_jsx(Navbar, {}), _jsx("main", { className: "max-w-7xl mx-auto px-6 py-8", children: _jsx(Outlet, {}) })] }));
}
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/arena", element: _jsx(ArenaPage, {}) }), _jsx(Route, { path: "/marketplace", element: _jsx(MarketplacePage, {}) }), _jsx(Route, { path: "/leaderboard", element: _jsx(LeaderboardPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/create", element: _jsx(CreateAgentPage, {}) }), _jsx(Route, { path: "/agent/:id", element: _jsx(AgentDetailPage, {}) })] })] }));
}
export default App;
//# sourceMappingURL=App.js.map