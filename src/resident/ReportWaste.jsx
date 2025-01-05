import Layout from "../components/Layout/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, MapPin, CheckCircle } from "lucide-react";
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

function ReportWaste() {
  const { wasteReports } = useReports();
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
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
      try {
        const url = await storeImage(file);
        setFormData((prevData) => ({
          ...prevData,
          image: url,
        }));
        message.success("IMAGE UPLOADED SUCCESSFULLY");
      } catch (error) {
        console.error("Image upload failed:", error);
        message.error("IMAGE UPLOAD FAILED");
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

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Image Verification

  function parseBackendResponse(response) {
    const jsonObject = {};
    
    // Split the response by lines
    const lines = response.trim().split(",\n");
    
    lines.forEach(line => {
      // Split each line by the first colon
      const [key, value] = line.split(/:(.+)/);
      const cleanKey = key.trim(); // Clean key
      
      let cleanValue = value.trim(); // Clean value
      if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
        // Remove quotes for string values
        cleanValue = cleanValue.slice(1, -1);
      } else if (!isNaN(parseFloat(cleanValue))) {
        // Convert numeric values
        cleanValue = parseFloat(cleanValue);
      }
      
      // Assign to JSON object
      jsonObject[cleanKey] = cleanValue;
    });
  
    return jsonObject;
  }

  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyImage = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API}/resident/getDescription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth?.accessToken,
          },
          body: JSON.stringify({ image: formData.image }),
        }
      );

      const data = await res.json();
      console.log(data);
      const result = parseBackendResponse(data);
      console.log(result);

      if( result.WasteType && result.Quantity && result.Confidence && result.Other){
        setVerificationResult(result);
        setFormData((prevData) => ({
          ...prevData,
          description: result.Other,
        }));
      }

    } catch (error) {
      console.error("IMAGE VERIFICATION FAILED", error);
      message.error("IMAGE VERIFICATION FAILED");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API}/resident/reportWaste/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth?.accessToken,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      //console.log(data);

      if (data.message === "SUCCESS") {
        message.success("WASTE REPORTED SUCCESSFULLY");
        navigate("/");
      }
    } catch (error) {
      console.error("WASTE REPORTED FAILED", error);
      message.error("WASTE REPORT FAILED");
    }
  };
  return (
    <Layout title={"Report-Waste"}>
      <div className="p-3 max-w-5xl mx-auto">
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
            className="w-full mb-8 bg-slate-600 hover:bg-slate-700 text-white py-2 text-lg rounded-xl transition-colors duration-300"
          >
            Upload Image
          </button>

          {
            // Display the uploaded image
            formData.image && (
              <>
                <div className="flex justify-between p-3 border items-center">
                  <img
                    src={formData.image}
                    alt="waste"
                    className="w-40 h-20 object-cover rounded-lg"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2"
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={handleVerifyImage}
                      className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2"
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
                        <p>Waste Type: {verificationResult.WasteType}</p>
                        <p>Quantity: {verificationResult.Quantity}</p>
                        <p>
                          Confidence:{" "}
                          {(verificationResult.Confidence * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          }

          <div className="flex flex-col gap-2 mt-3">
            <input
              type="text"
              id="description"
              name="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              placeholder="Enter Description"
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              placeholder="Enter Location"
              required
              onChange={handleChange}
              value={formData.location}
            />
            <button
              type="submit"
              className="w-full mb-8 bg-green-600 hover:bg-green-700 text-white py-2 text-lg rounded-xl transition-colors duration-300"
            >
              Report Waste
            </button>
          </div>
        </form>
      </div>

      <h2 className="block text-lg font-medium text-gray-700 mb-2">
        Recent Reports
      </h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
      </div>
    </Layout>
  );
}

export default ReportWaste;
