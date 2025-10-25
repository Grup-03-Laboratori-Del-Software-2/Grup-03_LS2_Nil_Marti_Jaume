import Home from "./pages/Home";
import { AuthProvider } from "./auth/useAuth";

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
