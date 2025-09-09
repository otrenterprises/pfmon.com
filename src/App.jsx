import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './aws-config';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import { ConnectionProvider } from './context/ConnectionContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Authenticator
      formFields={{
        signUp: {
          username: {
            label: 'Email',
            placeholder: 'Enter your email'
          }
        },
        signIn: {
          username: {
            label: 'Email',
            placeholder: 'Enter your email'
          }
        }
      }}
    >
      {({ signOut, user }) => (
        <ThemeProvider>
          <ConnectionProvider user={user}>
            <Router>
              <div className="h-full flex bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                {/* Mobile backdrop */}
                {isMobile && sidebarOpen && (
                  <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
                
                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Top navbar */}
                  <Navbar 
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
                    user={user}
                    onSignOut={signOut}
                  />
                  
                  {/* Page content */}
                  <main className="flex-1 overflow-auto focus:outline-none">
                    <div className="py-4 px-4 sm:px-6 lg:px-8">
                      <Routes>
                        <Route path="/" element={<Dashboard user={user} />} />
                        <Route path="/accounts" element={<Accounts />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            </Router>
          </ConnectionProvider>
        </ThemeProvider>
      )}
    </Authenticator>
  );
}

export default App;