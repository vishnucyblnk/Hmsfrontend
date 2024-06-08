import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import HmsHome from "./Pages/HmsHome";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DashboardRoute from "./Pages/DashboardRoute";

function App() {
  return (
    <>
      <div
        className="bg-dark w-100 p-0"
        style={{ zIndex: "3", position: "fixed", top: 0, overflowY: "auto" }}
      >
        <Header />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<HmsHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myDashboard" element={<DashboardRoute />} />
        </Routes>
      </div>
      <div
        className="w-100 text-center bg-dark text-light"
        style={{ bottom: "0", position: "sticky" }}
      >
        <Footer />
      </div>
    </>
  );
}

export default App;
