import Layout from "../components/Layout/Layout";
import { useState } from "react";
import { Upload, MapPin, CheckCircle, Loader } from "lucide-react";
import { ImSpinner, ImSpinner4 } from "react-icons/im";
import { Select } from "antd";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { message } from "antd";
import { useAuth } from "../context/Auth";
import useReports from "../hooks/useReports";
import Loadering from "../components/Spinner/Loadering";

function ReportWaste() {
  const [loading, setLoading] = useState(false);
  const { wasteReports } = useReports(setLoading);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [auth] = useAuth();

  const [formData, setFormData] = useState({
    description: "",
    location: "",
    image: "",
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
          image: url,
        }));
        message.success("IMAGE UPLOADED SUCCESSFULLY");
        setIsUploading(false);
      } catch (error) {
        console.error("Image upload failed:", error);
        message.error("IMAGE UPLOAD FAILED");
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
      image: "",
    }));
  };

  // Handle changes for the Select (location)
  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      location: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Image Verification

  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyImage = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }
    try {
      setIsVerifying(true);
      const res = await fetch(
        `${import.meta.env.VITE_APP_API}/resident/getDescription`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth?.accessToken,
          },
          body: JSON.stringify({ image: formData.image }),
        }
      );

      const data = await res.json();
      console.log(data);
      // const result = parseBackendResponse(data);
      // console.log(result);

      if (data.wasteType && data.quantity && data.confidence && data.other) {
        setVerificationResult(data);
        setFormData((prevData) => ({
          ...prevData,
          description: data.other,
        }));
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("IMAGE VERIFICATION FAILED", error);
      message.error("IMAGE VERIFICATION FAILED");
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }
    try {
      setIsSubmitted(true);
      const res = await fetch(
        `${import.meta.env.VITE_APP_API}/resident/reportWaste/`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth?.accessToken,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      //console.log(data);
      if (data.status === "PENDING") {
        message.success("WASTE REPORTED SUCCESSFULLY");
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error("WASTE REPORTED FAILED", error);
      message.error("WASTE REPORT FAILED");
      setIsSubmitted(false);
    }
  };
  return (
    <Layout title={"Report-Waste"}>
      <div className="p-3 max-w-5xl mx-auto">
        {
          // Display the spinner while uploading the image
          isUploading && (
            <Loadering
              isUploading={isUploading}
              title={"Uploading Image..."}
              spinner={ImSpinner}
            />
          )
        }
        {
          // Display the spinner while verifying the image
          isVerifying && (
            <Loadering
              isUploading={isVerifying}
              title={"Verifying Image..."}
              spinner={ImSpinner4}
            />
          )
        }
        <form
          className="bg-white p-8 rounded-2xl shadow-lg mb-2"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <label
              htmlFor="waste-image"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Upload Waste Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="waste-images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="waste-images"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleImageSubmit}
            className="w-full mb-8 bg-slate-600 hover:bg-slate-700 text-white py-2 text-lg rounded-xl transition-colors duration-300 font-medium"
          >
            Upload Image
          </button>

          {
            // Display the uploaded image
            formData.image && (
              <>
                <div className="flex flex-col p-3 border gap-2">
                  <img
                    src={formData.image}
                    alt="waste"
                    className="max-w-full h-auto rounded-xl shadow-md"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="w-full mb-1 bg-red-600 hover:bg-red-700 text-white py-2 text-lg rounded-xl transition-colors duration-300 font-medium"
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={handleVerifyImage}
                      className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg rounded-xl transition-colors duration-300 font-medium"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </>
            )
          }

          {
            // Display the verification result
            verificationResult && (
              <>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-green-800">
                        Verification Successful
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Waste Type: {verificationResult.wasteType}</p>
                        <p>
                          Quantity: {verificationResult.quantity}{" "}
                          {verificationResult.unit}
                        </p>
                        <p>
                          Confidence:{" "}
                          {(verificationResult.confidence * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }

          <div className="flex flex-col gap-2 mt-3">
            <span></span>
            <input
              type="text"
              id="description"
              name="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              placeholder="Enter Description"
              onChange={handleInputChange}
              value={formData.description}
              disabled
            />
            <span>
              <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
              Enter location
            </span>
            <Select
              value={formData.location}
              onChange={handleSelectChange}
              name="location"
              showSearch
              className="w-full focus:outline-none"
              placeholder="Enter Location"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "Mohammadpur",
                  label: "Mohammadpur",
                },
                {
                  value: "Dhanmondi",
                  label: "Dhanmondi",
                },
                {
                  value: "Mirpur",
                  label: "Mirpur",
                },
                {
                  value: "Uttara",
                  label: "Uttara",
                },
                {
                  value: "Gulshan",
                  label: "Gulshan",
                },
                {
                  value: "Banani",
                  label: "Banani",
                },
                {
                  value: "Shahbag",
                  label: "Shahbag",
                },
                {
                  value: "Farmgate",
                  label: "Farmgate",
                },
              ]}
            />
            <button
              type="submit"
              className="w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-lg px-5 py-2 text-center inline-flex items-center  me-2 mb-2 justify-center"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Submitting ...
                </>
              ) : (
                "Submit Repot"
              )}
            </button>
          </div>
        </form>
      </div>

      <h2 className="block text-lg font-medium text-gray-700 mb-2">
        Recent Reports
      </h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <>
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          </>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rewards
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {wasteReports.length > 0 ? (
                    wasteReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                          {report.location}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words line-clamp-5">
                          {report.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.reward}
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
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ReportWaste;
