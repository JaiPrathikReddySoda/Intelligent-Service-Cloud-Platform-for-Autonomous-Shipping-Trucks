// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";

// Auth Pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";

// Truck Pages
import TrucksList from "./pages/trucks/TrucksList";
import TruckForm from "./pages/trucks/TruckForm";

// Schedule Pages
import ScheduleList from "./pages/schedule/ScheduleList";
import NewScheduleForm from "./pages/schedule/NewScheduleForm";

// Service Pages
import ServiceRequestList from "./pages/service/ServiceRequestList";
import NewServiceRequestForm from "./pages/service/NewServiceRequestForm";

// Simulation Pages
import Simulation from "./pages/simulation/Simulation";

// Profile Pages
import Profile from "./pages/profile/Profile";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Truck Routes */}
              <Route path="trucks" element={<TrucksList />} />
              <Route path="trucks/new" element={<TruckForm />} />
              <Route path="trucks/edit/:id" element={<TruckForm />} />

              {/* Schedule Routes */}
              <Route path="schedule" element={<ScheduleList />} />
              <Route path="schedule/new" element={<NewScheduleForm />} />
              <Route path="schedule/edit/:id" element={<NewScheduleForm />} />

              {/* Service Routes */}
              <Route path="service" element={<ServiceRequestList />} />
              <Route path="service/new" element={<NewServiceRequestForm />} />
              <Route path="service/edit/:id" element={<NewServiceRequestForm />} />

              {/* Simulation Route */}
              <Route path="simulation" element={<Simulation />} />

              {/* Profile Route */}
              <Route path="profile" element={<Profile />} />

              {/* Catch-all within layout */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Global Catch-all for unmatched root-level paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
