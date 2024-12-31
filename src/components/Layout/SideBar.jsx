import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import {
  Home,
  MapPin,
  Coins,
  Medal,
  Settings,
  LayoutDashboard,
} from "lucide-react";

function SideBar({ open }) {
  
  return (
    <>
      <aside
        className={`bg-white border-r pt-20 border-gray-200 text-gray-800 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col justify-between">
          <ul className="space-y-1 font-medium">
            <li>
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Home size={24} className={"mr-2"} />
                <span className="ms-3">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/dashboard/reportWaste"}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <MapPin size={24} className={"mr-2"} />
                <span className="ms-3">Report Waste</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={'/dashboard/resident'}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <LayoutDashboard size={24} className={"mr-2"} />
                <span className="ms-3">DashBoard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/*"}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Coins size={24} className={"mr-2"} />
                <span className="ms-3">Rewards</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/*"}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Medal size={24} className={"mr-2"} />
                <span className="ms-3">Leaderboard</span>
              </NavLink>
            </li>
          </ul>

          <ul className="font-medium">
            <li>
              <NavLink
                to={"/*"}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Settings size={24} className={"mr-2"} />
                <span className="ms-3">Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

SideBar.propTypes = {
  open: PropTypes.bool,
};

export default SideBar;
