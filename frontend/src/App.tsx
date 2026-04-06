import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { KanbanBoard } from './pages/KanbanBoard';
import { CardGallery } from './pages/CardGallery';
import { GanttTimeline } from './pages/GanttTimeline';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={<KanbanBoard />} />
          <Route path="/timeline" element={<GanttTimeline />} />
          <Route path="/gallery" element={<CardGallery />} />
          <Route path="/team" element={<div className="p-8">Team Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
