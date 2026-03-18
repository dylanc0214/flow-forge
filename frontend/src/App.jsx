import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import SubmitRequest from './pages/SubmitRequest';
import MyRequests from './pages/MyRequests';
import PendingApprovals from './pages/PendingApprovals';
import WorkflowBuilder from './pages/WorkflowBuilder';
import HelpCenter from './pages/HelpCenter';
import ContactSupport from './pages/ContactSupport';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        
        {/* Public Routes */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests/submit" element={<SubmitRequest />} />
            <Route path="/requests/my" element={<MyRequests />} />
            <Route path="/approvals" element={<PendingApprovals />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/workflows" element={<WorkflowBuilder />} />
            <Route path="/contact" element={<ContactSupport />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
