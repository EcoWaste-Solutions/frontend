import Layout from "../Layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PiSpinnerFill } from "react-icons/pi";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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

function Spinner({ path = "login" }) {
  const [count, setCount] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => --prev);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <Modal
          open={true}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <section className="mx-auto">
              <div className="p-3">
                <h2 className="text-xl text-gray-800 mx-auto p-5 text-center">
                  Sorry You are not authorized to view this page. Redirecting...
                </h2>
                <PiSpinnerFill className="mx-auto h-20 w-40 text-green-600 animate-spin" />
                <h4 className="text-xl text-gray-800 mx-auto p-5 text-center">
                  You will be redirected to in {count} seconds
                </h4>
              </div>
            </section>
          </Box>
        </Modal>
      </div>
    </Layout>
  );
}

Spinner.propTypes = {
  path: PropTypes.string,
};

export default Spinner;
