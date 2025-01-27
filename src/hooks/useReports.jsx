import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";

function useReports(setLoading) {
  const [auth] = useAuth();
  const accessToken = auth?.accessToken;
  const [wasteReports, setWasteReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API}/resident/getReports`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "69420",
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        const data = await response.json();
        setWasteReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setWasteReports([]); // Set empty array on error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (accessToken) fetchReports();
  }, [accessToken, setLoading]);

  return { wasteReports };
}

export default useReports;
