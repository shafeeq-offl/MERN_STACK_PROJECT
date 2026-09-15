import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { Navbar } from "./components/Navbar.js";
import { HomeEvents } from "./pages/HomeEvents.js";
import { EventDetails } from "./pages/EventDetails.js";
import { StudentDashboard } from "./pages/StudentDashboard.js";
import { OrganizerDashboard } from "./pages/OrganizerDashboard.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { AuthModal } from "./pages/AuthModal.js";
import { CreateEditEventModal } from "./pages/CreateEditEventModal.js";
import { AttendanceScannerModal } from "./components/AttendanceScannerModal.js";
const AppContent = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState("login");
  const [authDefaultRole, setAuthDefaultRole] = useState("student");
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const openAuth = (tab = "login", role = "student") => {
    setAuthDefaultTab(tab);
    setAuthDefaultRole(role);
    setAuthModalOpen(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800", children: [
    /* @__PURE__ */ jsx(
      Navbar,
      {
        onOpenAuth: openAuth,
        onOpenCreateEvent: () => setCreateEventOpen(true),
        onOpenScanner: () => setScannerOpen(true)
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12", children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(HomeEvents, { onOpenAuth: openAuth }) }),
      /* @__PURE__ */ jsx(Route, { path: "/events/:id", element: /* @__PURE__ */ jsx(EventDetails, { onOpenAuth: openAuth }) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/student/dashboard",
          element: user ? /* @__PURE__ */ jsx(StudentDashboard, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/student/tickets",
          element: user ? /* @__PURE__ */ jsx(StudentDashboard, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/student/certificates",
          element: user ? /* @__PURE__ */ jsx(StudentDashboard, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/organizer/dashboard",
          element: user ? /* @__PURE__ */ jsx(OrganizerDashboard, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/profile",
          element: user ? /* @__PURE__ */ jsx(ProfilePage, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
    ] }) }),
    /* @__PURE__ */ jsx(
      AuthModal,
      {
        isOpen: authModalOpen,
        onClose: () => setAuthModalOpen(false),
        defaultTab: authDefaultTab,
        defaultRole: authDefaultRole
      }
    ),
    /* @__PURE__ */ jsx(
      CreateEditEventModal,
      {
        isOpen: createEventOpen,
        onClose: () => setCreateEventOpen(false),
        onEventSaved: () => {
        }
      }
    ),
    /* @__PURE__ */ jsx(
      AttendanceScannerModal,
      {
        isOpen: scannerOpen,
        onClose: () => setScannerOpen(false)
      }
    )
  ] });
};
export default function App() {
  return /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) }) });
}
