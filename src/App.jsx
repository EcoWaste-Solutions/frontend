import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentProfile from "./resident/ResidentProfile";
import PrivateRoute from "./components/Routes/PrivateRoute";
import ReportWaste from "./resident/ReportWaste";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="profile" element={<ResidentProfile />} />
          <Route path="reportWaste" element={<ReportWaste/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
