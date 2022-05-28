import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConferencePage } from './ConferencePage';
import { LandingPage } from './LandingPage';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/conference' element={<ConferencePage />} />
      </Routes>
    </Router>
  )
};