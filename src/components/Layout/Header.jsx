import { Menu, Leaf, Search, Bell, Coins, LogIn} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, message } from "antd";
import { useAuth } from "../../context/Auth";
import useProfile from "../../hooks/useProfile";
import useDecodeData from "../../hooks/useDecodeData";


const items = (onLogout , role) => [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "2",
    label: (
      <Link to={role === "ADMIN" ? "/dashboard/adminprofile" : "/dashboard/profile"} className="cursor-pointer font-medium">
        Profile
      </Link>
      
    ),
  },
  {
    key: "3",
    label: <span className="cursor-pointer font-medium">Billing</span>,
  },
  {
    key: "4",
    label: <span className="cursor-pointer font-medium">Settings</span>,
  },
  {
    type: "divider",
  },
  {
    key: "5",
    label: (
      <span onClick={onLogout} className="cursor-pointer font-medium">
        Logout
      </span>
    ),
  },
];

function Header({ onMenuClick }) {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const { data } = useProfile();

  const { role } = useDecodeData();

  const handleLogout = () => {
    setAuth({
      ...auth,
      accessToken: "",
    });
    localStorage.removeItem("auth");
    navigate("/");
    message.success("LOGGED OUT SUCCESSFULLY");
  };
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button className="mr-2 md:mr-4" onClick={onMenuClick}>
              <Menu className="h-6 w-6" />
            </button>
            <Link className="flex items-center">
              <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-600 mr-1 md:mr-2" />
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg text-gray-800">
                  Waste Management
                </span>
                <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">
                  SDP Project
                </span>
              </div>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-2">
              <Bell className="h-5 w-5" />
            </div>
            <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
              <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-600" />
              <span className="font-semibold text-sm md:text-base text-gray-800">
                {data?.reward}
              </span>
            </div>
            <div className="">
              {!auth.accessToken ? (
                <Link
                  to={"/login"}
                  className=" text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  Login
                  <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              ) : (
                <Dropdown menu={{ items: items(handleLogout , role) }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <img src={data?.image} className="h-8 w-8 rounded-full" />
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Header;
