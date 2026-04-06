import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { KanbanBoard } from './pages/KanbanBoard';
import { CardGallery } from './pages/CardGallery';
import { GanttTimeline } from './pages/GanttTimeline';
import { Collaborators } from './pages/Collaborators';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './hooks/useAuthStore';

const HomeRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? '/board' : '/login'} replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/board" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/board" element={<KanbanBoard />} />
            <Route path="/timeline" element={<GanttTimeline />} />
            <Route path="/gallery" element={<CardGallery />} />
            <Route path="/team" element={<Collaborators />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
