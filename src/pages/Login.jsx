import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { message } from "antd";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data);
      if (data.detail === "NOTFOUND" || data.detail === "PASSWORDERROR") {
        message.error("INVALID CREDENTIALS");     
      }else{
        message.success("LOGIN SUCCESSFUL");
        setAuth({
          ...auth,
          accessToken: data.accessToken,
        }); // set the auth context
        localStorage.setItem("auth", JSON.stringify(data)); // set the local storage
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      message.error("FAILED TO LOGIN");
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
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mb-2 bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
            >
              Login
            </button>
          </form>
          <div className="flex gap-2 mt-2 text-sm text-gray-800 font-medium">
            <p>If You donnot have an accounnt?</p>
            <Link to="/register">
              <span className="text-green-600">Register</span>
            </Link>
            <p>please</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;
