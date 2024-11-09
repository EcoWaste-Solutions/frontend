import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { message } from "antd";

function Register() {
  const [file, setFile] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      message.error("PLEASE UPLOAD AN IMAGE");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.message === "SUCCESS") {
        message.success("USER REGISTERED SUCCESSFULLY");
        navigate("/login");
      }
    } catch (error) {
      console.error("USER RESGITERD FAILED", error);
      message.error("USER REGISTER FAILED");
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
            className="w-full mb-2 bg-slate-600 hover:bg-slate-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
          >
            Upload Image
          </button>

          {
            // Display the uploaded image
            formData.image && (
              <div className="flex justify-between p-3 border items-center">
                <img
                  src={formData.image}
                  alt="waste"
                  className="w-40 h-20 object-cover rounded-lg"
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
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="address"
              id="address"
              name="address"
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full mb-2 bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
            >
              Register
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
