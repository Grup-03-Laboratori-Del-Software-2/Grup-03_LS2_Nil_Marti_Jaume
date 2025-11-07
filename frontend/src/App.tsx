import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WatchPage from "./pages/WatchPage";
import { AuthProvider } from "./auth/useAuth";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
