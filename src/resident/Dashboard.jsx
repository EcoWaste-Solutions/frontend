import Layout from "../components/Layout/Layout";
import useReports from "../hooks/useReports";
import { MapPin, Search , Loader} from "lucide-react";
import { useState } from "react";

function Dashboard() {
  const [loading, setLoading] = useState(false); // Loading state
  const { wasteReports } = useReports(setLoading); // Pass setLoading to the hook
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = wasteReports.filter((task) =>
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 5;
  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout title={"Resident-Dashboard"}>
      <div className="max-w-5xl mx-auto">
        {/* Show Loader if Loading */}
        {loading ? (
          <>
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          </>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-4 flex items-center">
              <input
                type="text"
                placeholder="Search by status..."
                className="mr-2 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>
                <Search className="h-4 w-4" />
              </button>
            </div>
            {/* Reports Table */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                          {report.location}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words line-clamp-6">
                          {report.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 rounded ${
                              report.status === "RESOLVED"
                                ? "bg-purple-200 text-purple-900"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.image ? (
                            <img
                              src={report.image}
                              alt="Report"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            "No image"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.date).toLocaleString()}
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
              {/* Pagination */}
              <section className="text-center mb-3">
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="mr-2 bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                  >
                    Previous
                  </button>
                  <span className="mx-2 self-center font-medium">
                    Page {currentPage} of {pageCount}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                    }
                    disabled={currentPage === pageCount}
                    className="ml-2 bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                  >
                    Next
                  </button>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
