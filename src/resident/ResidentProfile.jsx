import Layout from "../components/Layout/Layout";
import useProfile from "../hooks/useProfile";
import { User, Mail, MapPin, Phone, Coins, Upload } from "lucide-react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
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

function ResidentProfile() {
  const { data } = useProfile();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });

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
        message.success("USER INFO UPDATED SUCCESSFULLY");
        setOpen(false);
      }
    } catch (error) {
      console.error("USER INFO UPDATED FAILED", error);
      message.error("USER INFO UPDATED FAILED");
    }
  };

  return (
    <Layout title={"Resident-Profile"}>
      <div className="max-w-5xl mx-auto">
        <div>
          <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
            <div className="mt-1 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
              <div className="p-2 flex flex-col gap-3 rounded-md">
                <div className="">
                  <div className="flex gap-2 items-center p-3">
                    <img
                      src={data?.image}
                      alt=""
                      className="w-[100px] h-[100px] object-cover rounded-md left-0"
                    />
                    <div className="flex flex-col">
                      <span className="px-5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-200 text-indigo-800">
                        RESIDENT
                      </span>
                      <h1 className="font-medium tex-xl">{data?.name}</h1>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
              <div className="border-dashed border-2 p-2 flex flex-col gap-3 rounded-md">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={data?.name}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={data?.email}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={data?.address}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={data?.phone}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="points"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Points
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="points"
                      name="points"
                      value={data?.reward}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <Coins
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <button
                    className="mb-2 bg-blue-600 hover:bg-blue-700 text-white p-2 text-xl rounded-xl transition-colors duration-300 w-full"
                    onClick={handleOpen}
                  >
                    Update Info
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form action="" className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="profile-image"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Upload Profile Image
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
              className="w-full mb-2 bg-slate-600 hover:bg-slate-700 text-white py-2 text-lg rounded-xl transition-colors duration-300"
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
                    className="max-w-full h-auto rounded-xl shadow-md"
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
                type="name"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={formData.name}
                defaultValue={data?.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={formData.phone}
                defaultValue={data?.phone}
                onChange={handleChange}
                required
              />

              <input
                type="address"
                id="address"
                name="address"
                placeholder="Enter your address"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={formData.address}
                defaultValue={data?.address}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full mb-2 bg-green-600 hover:bg-green-700 text-white py-2 text-lg rounded-xl transition-colors duration-300"
              >               
                Save Changes
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </Layout>
  );
}

export default ResidentProfile;
