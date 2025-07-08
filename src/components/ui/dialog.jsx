// dialog.jsx
import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => (
  open ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        {children}
        <button onClick={() => onOpenChange(false)} className="mt-4 bg-red-500 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  ) : null
);

export const DialogTrigger = ({ children }) => <>{children}</>;

export const DialogContent = ({ children }) => (
  <div className="dialog-content">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-bold">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
);
