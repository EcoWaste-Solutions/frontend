import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { message } from "antd";
import { Modal} from "antd";
import { Loader } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_APP_API}/signin`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      //console.log(data);
      if (data.detail === "NOTFOUND" || data.detail === "PASSWORDERROR") {
        message.error("INVALID CREDENTIALS");
      } else {
        message.success("LOGIN SUCCESSFUL");
        setAuth({
          ...auth,
          accessToken: data.accessToken,
        }); // Set the auth context
        localStorage.setItem("auth", JSON.stringify(data)); // Set local storage
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error("FAILED TO LOGIN");
    } finally {
      setIsLoading(false);
    }
  };

  // for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [recoverEmail, setRecoverEmail] = useState("");

  const handleRecover = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API}/forgotPassword`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: recoverEmail }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.detail === "NOTFOUND") {
        message.error("EMAIL NOT FOUND");
      } else {
        message.success("OTP SENT TO YOUR EMAIL");
        navigate("/resetPassword");
      }
    } catch (error) {
      console.log(error);
      message.error("FAILED TO RECOVER");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <section className="text-center max-w-2xl mx-auto">
          <h1 className="font-bold text-3xl  text-green-600 text-center my-7 tracking-tight">
            SIGN IN
          </h1>
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-lg px-5 py-2 text-center inline-flex items-center  me-2 mb-2 justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Login ...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="flex flex-col">
            <div className="flex gap-2 mt-2 text-sm text-gray-800 font-medium">
              <Link onClick={showModal} className="text-green-600">
                Forgot Password?
              </Link>
            </div>

            <hr className="mt-2" />
            <div className="flex gap-2 mt-2 text-sm text-gray-800 font-medium">
              <p>If You donnot have an accounnt?</p>
              <Link to="/register">
                <span className="text-green-600">Register</span>
              </Link>
              <p>please</p>
            </div>
          </div>
        </section>

        <Modal
          title="Recover Password"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer=""
          className="text-center text-sm"
        >
          <div className="">
            <p className="mb-3">
              You will get an OTP after enter your email here
            </p>
            <form
              action=""
              onSubmit={handleRecover}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
              >
                Submit
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Login;
