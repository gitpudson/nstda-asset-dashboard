import AppRoutes from "./routes/AppRoutes";
import NetworkGuard from "./components/cards/NetworkGuard";
import Maintenance from "./pages/Maintenance/Maintenance";

function App() {
  const MAINTENANCE_MODE = false; // Set to true to enable maintenance mode

  if (MAINTENANCE_MODE) {
    return (
      <Maintenance />
    );
  }

  return (
    <NetworkGuard>
      <AppRoutes />
    </NetworkGuard>
  );
}

export default App;