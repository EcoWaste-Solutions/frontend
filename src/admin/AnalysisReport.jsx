import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import { useState, useEffect , useMemo } from "react";
import { Coins, Leaf, MapPin, UserCheck } from "lucide-react";
import PropTypes from "prop-types";
import { PieChart } from "@mui/x-charts/PieChart";

function AnalysisReport() {
  const [auth] = useAuth();
  const accessToken = auth?.accessToken;
  const [showAllReports, setShowAllReports] = useState([]);

  const [statusCount, setStatusCount] = useState({
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_API}/admin/getAllWasteReports`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Access the inner array and set it to state
        if (data.length > 0 && Array.isArray(data)) {
          setShowAllReports(data);
          // calculate status
          const pendingCount = data.filter(
            (report) => report.status === "PENDING"
          ).length;

          const resolvedCount = data.filter(
            (report) => report.status === "RESOLVED"
          ).length;

          setStatusCount({
            pending: pendingCount,
            resolved: resolvedCount,
          });
        } else {
          setShowAllReports([]);
          setStatusCount({
            pending: 0,
            resolved: 0,
          });
        }
      });
  }, [accessToken]);

  const uniqueUsers = useMemo(() => {
    const uniqueEmails = new Set(showAllReports.map((report) => report.email));
    return uniqueEmails.size;
  }, [showAllReports]);

  return (
    <Layout title={"Admin-Dashboard"}>
      <div className="max-w-5xl mx-auto">
        <div className="">
          <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
            <div className="mt-1 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <ImpactCard
                title="Reports Submitted"
                value={statusCount.pending + statusCount.resolved}
                icon={MapPin}
              />
              <ImpactCard title="Pending Reports" value={statusCount.pending} icon={Coins} />
              <ImpactCard title="Resolved Reports" value={statusCount.resolved} icon={Leaf} />
              <ImpactCard title="Total Users" value={uniqueUsers} icon={UserCheck} />
            </div>
            <section className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md mt-3">
              <div className="mt-3 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
                <div>
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: statusCount.pending,
                            label: "Pending",
                          },
                          {
                            id: 1,
                            value: statusCount.resolved,
                            label: "Resolved",
                          },
                          {
                            id: 2,
                            value: statusCount.pending + statusCount.resolved,
                            label: "Total",
                          },
                        ],
                      },
                    ]}
                    width={400}
                    height={200}
                  />
                  <h1 className="text-sm text-gray-600">Pie chart view of pending and resolved status</h1>
                </div>
                
              </div>
            </section>
          </section>
        </div>
      </div>
    </Layout>
  );
}

function ImpactCard({ title, value, icon: Icon }) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-US", { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <div className="flex justify-between items-center">
        <Icon className="h-10 w-10 text-green-500 mb-4" />
        <p className="text-3xl font-bold mb-2 text-gray-800">
          {formattedValue}
        </p>
      </div>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

ImpactCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType.isRequired,
};

export default AnalysisReport;
