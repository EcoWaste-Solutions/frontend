import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  BadgeCheck,
  Search,
  Loader,
  MapPin,
  Trash2,
  Calendar,
  Clock,
  Mail,
} from "lucide-react";
import { message } from "antd";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CollectorDashboard() {
  const [auth] = useAuth();
  const accessToken = auth?.accessToken;
  const [showAllReports, setShowAllReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredWasteType, setHoveredWasteType] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    setLoading(true); // Start loading before the fetch begins
    fetch(`${import.meta.env.VITE_APP_API}/collector/getWasteReports`, {
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
          console.log(data);
        } else {
          setShowAllReports([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching waste reports:", err);
        setShowAllReports([]); // Optionally handle errors by clearing the state
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetch completes or fails
      });
  }, [accessToken]);

  const filteredTasks = showAllReports.filter((task) =>
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 5;
  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // for modal
  const [image, setImage] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [open, setOpen] = useState(false);
  const [reportID, setReportID] = useState(null);
  const handleOpen = (image, qrcode, id) => {
    setImage(image);
    setQrCode(qrcode);
    setReportID(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setQrCode(null);
    setReportID(null);
  };

  const handleVerifyImage = async (e) => {
    e.preventDefault();
    try {
      setIsApproved(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_API}/collector/updateReportStatus`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            report_id: reportID,
          }),
        }
      );
      const data = await response.json();
      if (data.message === "REPORTUPDATED") {
        message.success("Report updated successfully!");
        handleClose(); // Close modal or reset state
      } else {
        message.error(data.error || "Failed to update report");
      }
    } catch (error) {
      console.error("Error verifying image:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsApproved(false);
    }
  };

  return (
    <Layout title="Collector Dashboard">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by area..."
            className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="">
            <Search className="h-4 w-4" />
          </button>
        </div>
        {loading ? (
          <>
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-500" />
                      {task.location}
                    </h2>
                    <h2 className="text-sm text-gray-800">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      {new Date(task.date).toTimeString()}
                    </h2>

                    <h2 className="text-sm text-gray-800">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {new Date(task.date).toDateString()}
                    </h2>
                    <h2 className="text-sm text-gray-800">
                      {task.qrCode ? (
                        <>
                          <span className="px-2 py-2 rounded-lg bg-green-100 text-green-900">
                            QRCode Available
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded-lg ${
                        task.status === "RESOLVED"
                          ? "bg-purple-100 text-purple-800 text-sm font-medium"
                          : "bg-yellow-100 text-yellow-800 text-sm font-medium"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-1">
                    <div className="flex items-center relative">
                      <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                      <span
                        onMouseEnter={() =>
                          setHoveredWasteType(task.description)
                        }
                        onMouseLeave={() => setHoveredWasteType(null)}
                        className="cursor-pointer"
                      >
                        {task.description.length > 8
                          ? `${task.description.slice(0, 8)}...`
                          : task.description}
                      </span>
                      {hoveredWasteType === task.description && (
                        <div className="absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                          {task.description}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() =>
                          handleOpen(task.image, task.qrCode, task.id)
                        }
                        className="text-gray-900 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                      >
                        <BadgeCheck className="w-4 h-4 mr-2" />
                        Complete & Verify
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      <h2 className="text-sm text-gray-800 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-blue-500" />
                        {task.email}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                cursor="pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="mr-2 cursor-pointer bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
              >
                Previous
              </button>
              <span className="mx-2 self-center">
                Page {currentPage} of {pageCount}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                }
                disabled={currentPage === pageCount}
                className="ml-2 cursor-pointer bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <img
                src={image}
                alt="waste"
                className="w-[160px] h-[160px] object-cover rounded-lg"
              />
              <div className="flex flex-col gap-1 items-center">
                <img
                  src={qrCode}
                  alt="qr-code"
                  className="w-[150px] h-[150px] object-cover rounded-lg"
                />
                <h1 className="font-medium text-sm">Scan this QRCode</h1>
              </div>
            </div>
            <span>Report ID</span>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              value={reportID}
              readOnly
            />
            <div className="mt-4 text-center">
              <button
                className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 w-full justify-center"
                onClick={handleVerifyImage}
                disabled={isApproved}
              >
                {isApproved ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" />
                    Approving ...
                  </>
                ) : (
                  <>
                    <BadgeCheck className="w-4 h-4 mr-2" />
                    Approve if images match
                  </>
                )}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </Layout>
  );
}

export default CollectorDashboard;
