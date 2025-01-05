import { useAuth } from "../../context/Auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import { Outlet } from "react-router-dom";

function AdminPrivateRoute() {
  const [auth] = useAuth();
  const [decodedData, setDecodedData] = useState(null);

  const accessToken = auth?.accessToken;

  useEffect(() => {
    let decoded = null;
    if (accessToken && accessToken.split(".").length === 3) {
      try {
        decoded = jwtDecode(accessToken);
        setDecodedData(decoded.role);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    } else {
      console.error("Invalid JWT format");
    }
  }, [accessToken]);

  return (
    <>
      {decodedData === "ADMIN" ? <Outlet /> : <Spinner />}
    </>
  );
}

export default AdminPrivateRoute;
