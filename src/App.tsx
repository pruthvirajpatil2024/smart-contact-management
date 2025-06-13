import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ContactsPage from './components/contacts/ContactsPage';
import AddContactPage from './components/contacts/AddContactPage';
import ImportPage from './components/import/ImportPage';
import SyncPage from './components/sync/SyncPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import { ThemeProvider } from './context/ThemeContext';
import { ContactProvider } from './context/ContactContext';
import { NotificationProvider } from './context/NotificationContext';
function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <ContactProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/add-contact" element={<AddContactPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/sync-logs" element={<SyncPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </Layout>
          </Router>
        </ContactProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
