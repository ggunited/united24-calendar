import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import logo from "../assets/U24Media-logo-frame.png";

const USER_ROLES = ["user", "editor", "admin"];
const localizer = momentLocalizer(moment);

Modal.setAppElement("#root");

const eventTypeOptions = ["Holiday", "Day Off", "Sick Leave", "Business Trip"]; // No "Real-time"

const calendarStyle = {
  backgroundColor: "#000000",
  color: "#FFFFFF",
  fontFamily: "'Arial', Arial, sans-serif",
};

const btnStyle = {
  backgroundColor: "#CCCCCC",
  color: "#0D47A1",
  fontFamily: "'Arial Black', Arial, sans-serif",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  margin: "0 8px",
};

const United24Calendar = () => {
  // Login state
  const [user, setUser] = useState(null);
  // Calendar state
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Modal state
  const [showLogin, setShowLogin] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  // Calendar view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);
  // New event form
  const [newEvent, setNewEvent] = useState({
    event_type: "Holiday",
    description: "",
    start_date: "",
    end_date: "",
    time_start: "",
    time_end: "",
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/events");
      setEvents(
        res.data.map((event) => ({
          ...event,
          id: event.id,
          title: `${event.event_type}: ${event.description}`,
          start: new Date(`${event.start_date}T${event.time_start}`),
          end: new Date(`${event.end_date}T${event.time_end}`),
        }))
      );
    } catch (e) {
      alert("Failed to fetch events");
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const role = e.target.role.value;
    setUser({ username, role });
    setShowLogin(false);
  };

  // Add event handler
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/add_event", {
        ...newEvent,
        created_by: user.username,
        status: user.role === "user" ? "Pending" : "Approved",
      });
      setShowAddModal(false);
      setNewEvent({
        event_type: "Holiday",
        description: "",
        start_date: "",
        end_date: "",
        time_start: "",
        time_end: "",
      });
      fetchEvents();
    } catch (e) {
      alert("Failed to add event");
    }
  };

  // Approve/Reject
  const handleApprove = async (id) => {
    await axios.post("http://127.0.0.1:8000/approve_event", { id });
    setShowEventModal(false);
    fetchEvents();
  };
  const handleReject = async (id) => {
    await axios.post("http://127.0.0.1:8000/reject_event", { id });
    setShowEventModal(false);
    fetchEvents();
  };

  // Pending events
  const pendingEvents = events.filter((e) => e.status === "Pending");

  // Custom Event Style
  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: "#4D4D4D",
      color: "#FFFFFF",
      borderRadius: "6px",
      border: "none",
      fontFamily: "'Arial Black', Arial, sans-serif",
    },
  });

  // Custom Day Prop
  const dayPropGetter = (date) => ({
    style: {
      backgroundColor: "#CCCCCC",
      color: "#000000",
      fontFamily: "'Arial Black', Arial, sans-serif",
    },
  });

  // Custom Toolbar
  function CustomToolbar({ label, onNavigate }) {
    return (
      <div className="flex items-center justify-between p-4" style={{ background: "#000" }}>
        <button style={btnStyle} onClick={() => onNavigate("PREV")}>Previous month</button>
        <span style={{ fontFamily: "'Arial Black'", fontSize: 22 }}>{label}</span>
        <button style={btnStyle} onClick={() => onNavigate("TODAY")}>This month</button>
        <button style={btnStyle} onClick={() => onNavigate("NEXT")}>Next month</button>
      </div>
    );
  }

  if (showLogin)
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={calendarStyle}>
        <img src={logo} alt="U24 Media Logo" style={{ width: 240, marginBottom: 16 }} />
        <h1 className="text-3xl mb-4">Calendar</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="username" required placeholder="Username" className="p-2 rounded" />
          <select name="role" className="p-2 rounded">
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <button type="submit" style={btnStyle}>Log in</button>
        </form>
      </div>
    );

  // Sidebar links
  const links = [
    { name: "Calendar", onClick: () => setShowAddModal(false) },
    ...(user.role !== "user" ? [{ name: "Requests", onClick: () => setShowAddModal(false) }] : []),
    ...(user.role !== "user" ? [{ name: "Admin Panel", onClick: () => setShowAddModal(false) }] : []),
  ];

  return (
    <div className="flex h-screen" style={calendarStyle}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col" style={{ background: "#111" }}>
        <div className="flex items-center p-4 border-b border-gray-700" style={{ minHeight: 60 }}>
          <img src={logo} alt="U24 Media Logo" style={{ height: 42 }} />
        </div>
        {links.map((l) => (
          <button
            key={l.name}
            className="text-left px-4 py-2 hover:bg-gray-700"
            style={{ color: "#FFF", fontFamily: "'Arial Black'" }}
            onClick={l.onClick}
          >
            {l.name}
          </button>
        ))}
        <button className="mt-auto p-4 text-red-400" style={{ fontFamily: "'Arial Black'" }} onClick={() => setShowLogin(true)}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header and Add-event button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700" style={{ background: "#000" }}>
          <span className="text-2xl font-bold" style={{ fontFamily: "'Arial Black'" }}></span>
          <button style={btnStyle} onClick={() => setShowAddModal(true)}>
            + Add Event
          </button>
        </div>
        {/* Calendar */}
        <div className="p-4 flex-1">
          <Calendar
            localizer={localizer}
            events={events.filter((e) => e.status === "Approved")}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "70vh", ...calendarStyle }}
            views={['month', 'agenda']}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            components={{
              toolbar: CustomToolbar,
            }}
            eventPropGetter={eventPropGetter}
            dayPropGetter={dayPropGetter}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setShowEventModal(true);
            }}
          />
        </div>
        {/* Requests (Moderation) panel for editors/admins */}
        {user.role !== "user" && (
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <h3 className="font-bold mb-2" style={{ fontFamily: "'Arial Black'" }}>Pending Requests</h3>
            {pendingEvents.length === 0 && <div>No pending events</div>}
            {pendingEvents.map((event) => (
              <div key={event.id} className="mb-2 flex justify-between bg-gray-700 p-2 rounded">
                <span>
                  {event.event_type}: {event.description} ({moment(event.start_date).format("ll")} - {moment(event.end_date).format("ll")})
                </span>
                <div>
                  <button style={{ ...btnStyle, color: "#008000" }} onClick={() => handleApprove(event.id)}>
                    Approve
                  </button>
                  <button style={{ ...btnStyle, color: "#B71C1C" }} onClick={() => handleReject(event.id)}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Event Modal */}
      <Modal
        isOpen={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        contentLabel="Add Event"
        className="fixed top-1/2 left-1/2 bg-white text-black rounded-lg shadow-lg p-8 w-96 -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40"
      >
        <h3 className="text-xl mb-4" style={{ fontFamily: "'Arial Black'" }}>Add Event</h3>
        <form onSubmit={handleAddEvent} className="space-y-3">
          <select
            value={newEvent.event_type}
            onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
            className="w-full p-2 rounded"
            style={{ fontFamily: "'Arial Black'" }}
          >
            {eventTypeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full p-2 rounded"
            style={{ fontFamily: "'Arial Black'" }}
            required
          />
          <input
            type="date"
            value={newEvent.start_date}
            onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
            className="w-full p-2 rounded"
            style={{ fontFamily: "'Arial Black'" }}
            required
          />
          <input
            type="date"
            value={newEvent.end_date}
            onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
            className="w-full p-2 rounded"
            style={{ fontFamily: "'Arial Black'" }}
            required
          />
          <input
            type="time"
            value={newEvent.time_start}
            onChange={(e) => setNewEvent({ ...newEvent, time_start: e.target.value })}
            className="w-full p-2 rounded"
            style={{ fontFamily: "'Arial Black'" }}
            required
          />
          <input
            type="time"
            value={newEvent.time_end}
            onChange={(e) => setNewEvent({ ...newEvent, time_end: e.target.value })}
            className="w-full p-2 rounded"
            style={{ fontFamily: "'Arial Black'" }}
            required
          />
          <button type="submit" className="w-full" style={btnStyle}>
            Submit Event
          </button>
        </form>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={showEventModal}
        onRequestClose={() => setShowEventModal(false)}
        contentLabel="Event Details"
        className="fixed top-1/2 left-1/2 bg-white text-black rounded-lg shadow-lg p-8 w-96 -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40"
      >
        {selectedEvent && (
          <>
            <h3 className="text-xl mb-4" style={{ fontFamily: "'Arial Black'" }}>{selectedEvent.title}</h3>
            <div>
              <div><b>Type:</b> {selectedEvent.event_type}</div>
              <div><b>Start:</b> {moment(selectedEvent.start_date).format("LL")} {selectedEvent.time_start}</div>
              <div><b>End:</b> {moment(selectedEvent.end_date).format("LL")} {selectedEvent.time_end}</div>
              <div><b>Status:</b> {selectedEvent.status}</div>
              <div><b>Created by:</b> {selectedEvent.created_by}</div>
            </div>
            {/* Approve/Reject if pending and admin/editor */}
            {user.role !== "user" && selectedEvent.status === "Pending" && (
              <div className="mt-4 flex gap-4">
                <button className="px-4 py-2 rounded" style={{ ...btnStyle, backgroundColor: "#008000", color: "#fff" }} onClick={() => handleApprove(selectedEvent.id)}>
                  Approve
                </button>
                <button className="px-4 py-2 rounded" style={{ ...btnStyle, backgroundColor: "#B71C1C", color: "#fff" }} onClick={() => handleReject(selectedEvent.id)}>
                  Reject
                </button>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default United24Calendar;
