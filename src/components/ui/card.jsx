// card.jsx
import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-2">
    {children}
  </div>
);
