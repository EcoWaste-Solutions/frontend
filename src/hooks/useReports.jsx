import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";

function useReports() {
  const [auth] = useAuth();
  const accessToken = auth?.accessToken;
  const [wasteReports, setWasteReports] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_API}/resident/getReports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Access the inner array and set it to state
        if (data.length > 0 && Array.isArray(data[0])) {
          setWasteReports(data[0]);
        } else {
          setWasteReports([]);
        }
      });
  }, [accessToken]);

  return { wasteReports };
}

export default useReports;
