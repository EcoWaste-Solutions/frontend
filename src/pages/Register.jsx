import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Loader } from "lucide-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { message, Select } from "antd";

function Register() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    password: "",
    address: "",
    image: "",
  });

  console.log(formData);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }
    try {
      setIsUploading(true);
      const url = await storeImage(file);
      setFormData((prevData) => ({
        ...prevData,
        image: url,
      }));
      message.success("IMAGE UPLOADED SUCCESSFULLY");
    } catch (error) {
      console.error("Image upload failed:", error);
      message.error("IMAGE UPLOAD FAILED");
    } finally {
      setIsUploading(false);
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

  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: "",
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      address: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_API}/signup`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      //console.log(data);
      if (data.message === "SUCCESS") {
        message.success("USER REGISTERED SUCCESSFULLY");
        navigate("/login");
      } else {
        message.error("REGISTRATION FAILED");
      }
    } catch (error) {
      console.error("USER REGISTRATION FAILED", error);
      message.error("USER REGISTER FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-3 max-w-2xl mx-auto">
        <h1 className="font-bold text-3xl  text-green-600 text-center my-6 tracking-tight">
          SIGN UP
        </h1>
        <form action="" className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="waste-image"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Upload Your Image
            </label>
            <div className="mt-1 flex justify-center px-10 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-6 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="profile-image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="profile-image"
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
            className="w-full text-white bg-slate-600 hover:bg-slate-700 font-medium rounded-lg text-lg px-5 py-2 text-center inline-flex items-center  me-2 mb-2 justify-center"
          >
            Upload Image
          </button>

          {
            // Display the uploaded image
            formData.image && (
              <div className="flex flex-col p-3 border gap-2">
                <img
                  src={formData.image}
                  alt="waste"
                  className="max-w-full h-auto object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  DELETE
                </button>
              </div>
            )
          }
          <div className="flex flex-col gap-2 mt-3">
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Select
              value={formData.location}
              onChange={handleSelectChange}
              name="location"
              showSearch
              className="w-full focus:outline-none"
              placeholder="Search to Select"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Register ...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <div className="flex gap-1 mt-2 text-sm text-gray-800 font-medium">
          <p>If You already have an accounnt?</p>
          <Link to="/login">
            <span className="text-green-600">Login</span>
          </Link>
          <p>please</p>
        </div>
      </div>
    </>
  );
}

export default Register;
