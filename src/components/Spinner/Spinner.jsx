import { Alert } from "antd";
import Layout from "../Layout/Layout";
import { LoaderCircle } from "lucide-react";
import { useNavigate , useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Spinner({path = 'login'}) {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
    const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => --prev);
    }, 1000);
    count === 0 && navigate(`/${path}`,{
      state:location.pathname,
    });
    return () => clearInterval(interval);
  }, [count, navigate , location , path]);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <section className="text-center">
          <h1 className="text-center text-gray-600 text-2xl">
            Redirecting to you in {count} seconds
          </h1>
          <div className="relative w-32 h-32 mx-auto mb-8">
            <LoaderCircle className="text-gray-600 animate-spin" size="64" />
          </div>
          <div>
            <Alert
              message="Protected Route"
              description="You need to be logged in to access this page"
              type="warning"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}

Spinner.propTypes = {
  path: PropTypes.string,
};

export default Spinner;
