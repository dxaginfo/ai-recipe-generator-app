import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import RecipeGeneratorPage from './pages/RecipeGeneratorPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import RecipeListPage from './pages/RecipeListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Redux actions
import { checkAuthStatus } from './redux/slices/authSlice';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green for food theme
    },
    secondary: {
      main: '#ff8a65', // Warm orange for accent
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const dispatch = useDispatch();

  // Check auth status on app load
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header />
          <Container maxWidth="lg" sx={{ minHeight: 'calc(100vh - 150px)', py: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generate" element={<RecipeGeneratorPage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;