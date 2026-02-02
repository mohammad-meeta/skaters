import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './screens/HomeScreen';
import { TrickListScreen } from './screens/TrickListScreen';
import { TrainingScreen } from './screens/TrainingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ShopScreen } from './screens/ShopScreen';
import { AdminScreen } from './screens/AdminScreen';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/level/:levelId" element={<TrickListScreen />} />
            <Route path="/trick/:trickId" element={<TrainingScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;