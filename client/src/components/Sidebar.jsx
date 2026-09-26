import React from 'react';
import { Nav, Card } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, User, Compass, ChevronRight } from 'lucide-react';

const Sidebar = ({ trips = [] }) => {
  const location = useLocation();

  return (
    <Card className="glass-card border-0 p-3 text-light">
      <div className="text-secondary small fw-semibold text-uppercase tracking-wider mb-3 ms-2">
        Menu
      </div>

      <Nav className="flex-column gap-1">
        <Nav.Link
          as={Link}
          to="/dashboard"
          className={`d-flex align-items-center justify-content-between p-2 px-3 rounded-3 text-light ${
            location.pathname === '/dashboard' ? 'bg-indigo-600 fw-bold' : 'hover-bg-slate'
          }`}
          style={{
            background: location.pathname === '/dashboard' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <ChevronRight size={16} className="opacity-50" />
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/trips/create"
          className={`d-flex align-items-center justify-content-between p-2 px-3 rounded-3 text-light ${
            location.pathname === '/trips/create' ? 'bg-indigo-600 fw-bold' : 'hover-bg-slate'
          }`}
          style={{
            background: location.pathname === '/trips/create' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <PlusCircle size={18} />
            <span>Create New Trip</span>
          </div>
          <ChevronRight size={16} className="opacity-50" />
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/profile"
          className={`d-flex align-items-center justify-content-between p-2 px-3 rounded-3 text-light ${
            location.pathname === '/profile' ? 'bg-indigo-600 fw-bold' : 'hover-bg-slate'
          }`}
          style={{
            background: location.pathname === '/profile' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <User size={18} />
            <span>My Profile</span>
          </div>
          <ChevronRight size={16} className="opacity-50" />
        </Nav.Link>
      </Nav>

      {trips.length > 0 && (
        <>
          <hr className="my-3 border-secondary" style={{ opacity: 0.2 }} />
          <div className="text-secondary small fw-semibold text-uppercase tracking-wider mb-2 ms-2 d-flex align-items-center gap-1">
            <Compass size={14} /> My Recent Trips
          </div>
          <div className="d-flex flex-column gap-1 max-h-200 overflow-auto">
            {trips.slice(0, 5).map(trip => (
              <Link
                key={trip._id}
                to={`/trips/${trip._id}`}
                className={`p-2 px-3 rounded-2 text-decoration-none small text-truncate ${
                  location.pathname === `/trips/${trip._id}` ? 'text-indigo-400 fw-bold bg-slate-800' : 'text-secondary hover-text-light'
                }`}
                style={{
                  color: location.pathname === `/trips/${trip._id}` ? '#818cf8' : '#94a3b8',
                  background: location.pathname === `/trips/${trip._id}` ? 'rgba(99, 102, 241, 0.15)' : 'transparent'
                }}
              >
                🏝️ {trip.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default Sidebar;
