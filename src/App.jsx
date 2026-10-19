import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CompareFloatingBar from './components/careers/CompareFloatingBar';

import HomePage from './pages/HomePage';
import CareersPage from './pages/CareersPage';
import CareerDetailPage from './pages/CareerDetailPage';
import UniversitiesPage from './pages/UniversitiesPage';
import ComparePage from './pages/ComparePage';
import VocationalTestPage from './pages/VocationalTestPage';
import AdminPage from './pages/admin/AdminPage';
import UniversityPortal from './pages/university/UniversityPortal';

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-campus-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/carreras" element={<CareersPage />} />
                <Route path="/carrera/:id" element={<CareerDetailPage />} />
                <Route path="/universidades" element={<UniversitiesPage />} />
                <Route path="/universidades/portal" element={<UniversityPortal />} />
                <Route path="/portal-universidades" element={<UniversityPortal />} />
                <Route path="/comparador" element={<ComparePage />} />
                <Route path="/test-vocacional" element={<VocationalTestPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <CompareFloatingBar />
            <Footer />
          </div>
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}
