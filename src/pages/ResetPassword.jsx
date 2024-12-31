import { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API}/resetPassword/${otp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: resetPassword }),
      });
      const data = await res.json();
      console.log(data);
      if (data.detail === "NOTFOUND") {
        message.error("INVALID OTP");
      } else {
        message.success("PASSWORD RESET SUCCESSFUL");
        navigate('/login')
      }
    } catch (error) {
      console.log(error);
      alert("FAILED TO RESET PASSWORD");
    }
  };
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <section className="text-center max-w-2xl mx-auto">
          <h1 className="font-bold text-3xl  text-green-600 text-center my-7 tracking-tight">
            RESET PASSWORD
          </h1>
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Enter your OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mb-2 bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
            >
              Submit
            </button>
          </form>
          <div className="flex flex-col">
            <div className="flex gap-2 mt-2 text-sm text-gray-800 font-medium">
              <p>If You know then go to?</p>
              <Link to="/login">
                <span className="text-green-600">Login</span>
              </Link>
              <p>please</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ResetPassword;
