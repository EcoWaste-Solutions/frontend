import { useAuth } from "../context/Auth"
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function useDecodeData() {
    const [auth] = useAuth();
  const [role, setRole] = useState(null);

  const accessToken = auth?.accessToken;

  useEffect(() => {
    let decoded = null;
    if (accessToken && accessToken.split(".").length === 3) {
      try {
        decoded = jwtDecode(accessToken);
        setRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    } else {
      console.error("Invalid JWT format");
    }
  }, [accessToken]);
  
    return { role };
}

export default useDecodeData
