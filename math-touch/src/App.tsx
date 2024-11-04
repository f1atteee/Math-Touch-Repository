import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes/useRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
    const { isAuthorized } = useAuth();
    const routes = useRoutes(isAuthorized);

    return (
        <Router>
            {routes}
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
