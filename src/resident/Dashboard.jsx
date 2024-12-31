import Layout from "../components/Layout/Layout";
import useReports from "../hooks/useReports";

function Dashboard() {
  
  const { wasteReports } = useReports();

  return (
    <Layout title={"Resident-Dashboard"}>
      <div className="p-3 max-w-5xl mx-auto">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Rewards
                </th>
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
              </tr>
            </thead>
            <tbody>
              {wasteReports.length > 0 ? (
                wasteReports.map((report) => (
                  <tr key={report.id} className="bg-white border-b">
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {report.location}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {report.description}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-700">
                    <span
                        className={`px-2 py-1 rounded ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {report.reward}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {report.image.startsWith("http") ? (
                        <img
                          src={report.image}
                          alt="Report"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No reports available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
