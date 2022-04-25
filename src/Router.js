import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './LandingPage';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  )
};