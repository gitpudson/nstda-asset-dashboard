import AppRoutes from "./routes/AppRoutes";
import NetworkGuard from "./components/cards/NetworkGuard";

function App() {
  return (
    <NetworkGuard>
      <AppRoutes />
    </NetworkGuard>
  );
}

export default App;