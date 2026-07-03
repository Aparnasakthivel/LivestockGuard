import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DocumentPage from './pages/Documentation';
import FarmerDashboard from './pages/FarmerDashboard';
import VeterinarianDashboard from './pages/VeterinarianDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import ConsumerVerification from './pages/ConsumerVerification';
import Animals from './pages/Animals';
import Treatments from './pages/Treatments';
import Vaccinations from './pages/Vaccinations';
import DiseaseReports from './pages/DiseaseReports';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Blockchain from './pages/Blockchain';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/documentation" element={<DocumentPage />} />
      <Route path="/verify" element={<ConsumerVerification />} />
      <Route path="/consumer" element={<ConsumerVerification />} />
      <Route path="/consumer-verification" element={<Navigate to="/verify" replace />} />
      <Route path="/animals" element={<Navigate to="/dashboard/animals" replace />} />
      <Route path="/treatments" element={<Navigate to="/dashboard/treatments" replace />} />
      <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
      <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      <Route path="/government" element={<GovernmentDashboard />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<FarmerDashboard />} />
        <Route path="animals" element={<Animals />} />
        <Route path="treatments" element={<Treatments />} />
        <Route path="vaccinations" element={<Vaccinations />} />
        <Route path="disease-reports" element={<DiseaseReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="blockchain" element={<Blockchain />} />
        <Route path="search" element={<DocumentPage />} />
        <Route path="farmer" element={<FarmerDashboard />} />
        <Route path="vet" element={<VeterinarianDashboard />} />
        <Route path="gov" element={<GovernmentDashboard />} />
        <Route path="verify" element={<ConsumerVerification />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
