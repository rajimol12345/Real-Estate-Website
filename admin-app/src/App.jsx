import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Components
import DashboardLayout from './components/layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageProperties from './pages/ManageProperties';
import ManageUsers from './pages/ManageUsers';
import ManageAgents from './pages/ManageAgents';
import ManageBlogs from './pages/ManageBlogs';
import ManageMessages from './pages/ManageMessages';
import ContactInquiries from './pages/ContactInquiries';
import LeadCRM from './pages/LeadCRM';
import BotLogic from './pages/BotLogic';
import Notifications from './pages/Notifications';
import ManageAppointments from './pages/ManageAppointments';
import ManageAIChats from './pages/ManageAIChats';
import ManageGallery from './pages/ManageGallery';
import ManageLocations from './pages/ManageLocations';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/appointments" element={<ManageAppointments />} />
          <Route path="/ai-chats" element={<ManageAIChats />} />
          <Route path="/properties" element={<ManageProperties />} />
          <Route path="/gallery" element={<ManageGallery />} />
          <Route path="/locations" element={<ManageLocations />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/agents" element={<ManageAgents />} />
          <Route path="/blogs" element={<ManageBlogs />} />
          <Route path="/messages" element={<ContactInquiries />} />
          <Route path="/leads" element={<LeadCRM />} />
          <Route path="/bot-settings" element={<BotLogic />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
