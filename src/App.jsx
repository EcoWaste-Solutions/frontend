import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentProfile from "./resident/ResidentProfile";
import PrivateRoute from "./components/Routes/PrivateRoute";
import ReportWaste from "./resident/ReportWaste";
import Dashboard from "./resident/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import LeaderBoard from "./leaderboard/LeaderBoard";
import Rewards from "./resident/Rewards";
import AdminPrivateRoute from "./components/Routes/AdminPrivateRoute";
import AdminProfile from "./admin/AdminProfile";
import AdminDashboard from "./admin/AdminDashboard";
import Overview from "./resident/Overview";
import AnalysisReport from "./admin/AnalysisReport";
import CollectorPrivateRoute from "./components/Routes/CollectorPrivateRoute";
import CollectorDashboard from "./collector/CollectorDashboard";
import CollectorProfile from "./collector/CollectorProfile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<ResetPassword/>} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="resident" element={<Dashboard/>} />
          <Route path="profile" element={<ResidentProfile />} />
          <Route path="reportWaste" element={<ReportWaste/>} />
          <Route path="rewards" element={<Rewards/>} />
          <Route path="overview" element={<Overview/>} />
        </Route>

        <Route path="/dashboard" element={<AdminPrivateRoute/>}>
          <Route path="adminprofile" element={<AdminProfile/>} />
          <Route path="admin" element={<AdminDashboard/>} />
          <Route path="analysisReport" element={<AnalysisReport/>} />
        </Route>

        <Route path="/leaderboard" element={<LeaderBoard/>} />

        <Route path="/dashboard" element={<CollectorPrivateRoute/>}>
          <Route path="collector" element={<CollectorDashboard/>} />
          <Route path="collectorprofile" element={<CollectorProfile/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
