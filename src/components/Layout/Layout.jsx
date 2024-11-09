import PropTypes from "prop-types";
import Header from "./Header";
import SideBar from "./SideBar";
import { useState } from "react";

function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar state
  };
  return (
    <div>
      <Header onMenuClick={toggleSidebar}/>
      <div className="flex flex-1">
        <SideBar open={sidebarOpen} />

        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
