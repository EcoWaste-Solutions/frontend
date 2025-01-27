import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";
import {
  Download,
  Upload,
  Bot,
  Search,
  Loader,
  MapPin,
  Clock,
  Calendar,
  Trash2,
} from "lucide-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { message } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

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

function AdminDashboard() {
  // for generating QRCode
  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredWasteType, setHoveredWasteType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmiiting, setIsSubmitting] = useState(false);

  const handleOpen = (imageUrl) => {
    setModalImage(imageUrl);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setModalImage("");
    setQrCodeDataUrl("");
  };
  // for uploading QRCode
  const [open2, setOpen2] = useState(false);
  const [imageID, setImageID] = useState("");

  const handleOpen2 = (id) => {
    setImageID(id);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
    setImageID("");
    formData.qrcode = "";
    formData.id = "";
  };

  const [auth] = useAuth();
  const accessToken = auth?.accessToken;
  const [showAllReports, setShowAllReports] = useState([]);

  useEffect(() => {
    setLoading(true);
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

  // pagination
  const filteredTasks = showAllReports.filter(
    (task) =>
      task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 5;
  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const generateQRCode = async () => {
    try {
      if (!modalImage) {
        message.error("No image found");
        return;
      }
      const qrcode = await QRCode.toDataURL(modalImage);
      setQrCodeDataUrl(qrcode);
    } catch (error) {
      console.log(error);
      message.error("Failed to generate QRCode");
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = "qrcode.png";
    link.click();
  };

  // for uploading QRCode
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    qrcode: "",
    id: "",
  });
  console.log(formData);

  const handleImageSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    if (file) {
      setIsUploading(true);
      try {
        const url = await storeImage(file);
        setFormData((prevData) => ({
          ...prevData,
          qrcode: url,
        }));
        message.success("QRCode UPLOADED SUCCESSFULLY");
        setIsUploading(false);
      } catch (error) {
        console.error("QRcode upload failed:", error);
        message.error("QRcode UPLOAD FAILED");
        setIsUploading(false);
      }
    } else {
      message.error("PLEASE UPLOAD AN IMAGE");
    }
  };
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };
  //remove image
  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      qrcode: "",
    }));
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_API}/admin/addQrcode`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok && data.message === "SUCCESS") {
        message.success("QRCode uploaded successfully");
      } else {
        message.error(data.error || "Failed to upload QRCode");
      }
    } catch (error) {
      console.error("QRCode upload failed:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title={"Admin-Dashboard"}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by area or status..."
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
                    <span
                      className={`px-2 py-1 rounded ${
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
                    <div className="flex items-center justify-center">
                      <button
                        className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center me-2 mb-2"
                        onClick={() => handleOpen(task.image)}
                        type="button"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Generate QRcode
                      </button>
                      <button
                        className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center me-2 mb-2"
                        onClick={() => handleOpen2(task.id)}
                        type="button"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <div>
                        {task.qrCode ? (
                          <>
                            <h1 className="font-medium text-green-600">
                              QRCode Available
                            </h1>
                          </>
                        ) : ""}
                      </div>
                      <img
                        src={task.image}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg"
                      />
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
          {modalImage ? (
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={modalImage}
              onChange={(e) => setModalImage(e.target.value)}
              readOnly
            />
          ) : (
            <p>No image available</p>
          )}
          <div className="mt-4 text-center">
            <button
              className="text-white bg-slate-600 hover:bg-slate-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2"
              onClick={generateQRCode}
            >
              <Bot className="w-4 h-4 mr-2" />
              Generate QRcode
            </button>
            <hr />
            {qrCodeDataUrl && (
              <div>
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="mt-4 mx-auto"
                />
                <hr />
                <button
                  className="text-white bg-slate-600 hover:bg-slate-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 mt-4"
                  onClick={downloadQRCode}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleImageSubmit} className="flex flex-col gap-2">
            <div className="">
              <input
                type="file"
                name="qrcode"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <div className="text-center">
                <button
                  type="submit"
                  className="text-white bg-slate-600 hover:bg-slate-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 mt-4 w-full justify-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload QRcode
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col p-3 border gap-2">
              {formData.qrcode && (
                <>
                  <img
                    src={formData.qrcode}
                    alt="waste"
                    className="max-w-full h-[150px] rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    className="text-white bg-slate-600 hover:bg-slate-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 justify-center"
                    onClick={handleRemoveImage}
                  >
                    Remove Qrcode
                  </button>
                </>
              )}
            </div>
            <div>
              <h1 className="font-medium text-gray-900">
                Please enter the image ID. Image ID no{" "}
                <span className="text-red-500">{imageID}</span>
              </h1>
            </div>
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <div>
              <button
                type="submit"
                className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 mt-4 w-full justify-center"
                onClick={handleFinalSubmit}
                disabled={isSubmiiting}
              >
                {isSubmiiting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting QRcode...
                  </>
                ) : (
                  "Submit QRcode"
                )}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
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

export default AdminDashboard;
