import React from "react";
import PropTypes from "prop-types";

const Sidebar = ({ role, onNavigate }) => {
  return (
    <aside className="sidebar bg-gray-900 text-white w-64 h-full fixed top-0 left-0 flex flex-col p-4 z-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">UNITED24</h2>
      </div>
      <nav className="flex-1">
        <ul>
          <li>
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-800" onClick={() => onNavigate("calendar")}>
              Calendar
            </button>
          </li>
          {(role === "admin" || role === "editor") && (
            <li>
              <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-800" onClick={() => onNavigate("requests")}>
                Requests
              </button>
            </li>
          )}
          {role === "admin" && (
            <li>
              <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-800" onClick={() => onNavigate("admin")}>
                Admin Panel
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
};

export default Sidebar;
