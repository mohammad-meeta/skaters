import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, ShoppingBag } from 'lucide-react';

export const Navigation: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500'}`;

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t border-gray-800 shadow-lg pb-safe">
      <div className="flex w-full h-full max-w-md mx-auto justify-around">
        <NavLink to="/" className={navClass}>
          <Home size={24} />
          <span className="text-xs mt-1">تمرین</span>
        </NavLink>
        <NavLink to="/shop" className={navClass}>
          <ShoppingBag size={24} />
          <span className="text-xs mt-1">جایزه</span>
        </NavLink>
        <NavLink to="/profile" className={navClass}>
          <User size={24} />
          <span className="text-xs mt-1">پروفایل</span>
        </NavLink>
      </div>
    </nav>
  );
};