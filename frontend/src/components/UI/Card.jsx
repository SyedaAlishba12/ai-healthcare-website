import React from 'react';

const Card = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div 
      className={`bg-white rounded-3xl border border-slate-100 p-6 shadow-sm transition-all duration-300 
        ${hoverEffect ? 'hover:shadow-xl hover:-translate-y-1 hover:border-blue-50' : ''} 
        ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;