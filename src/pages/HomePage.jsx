import Layout from "../components/Layout/Layout";
import { Leaf, Coins, Users, ArrowRight, MapPin, Recycle } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "../context/Auth";
import { Link } from "react-router-dom";

function AnimatedGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-green-600 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-green-500 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-green-400 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-green-300 opacity-80 animate-bounce"></div>
      <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-700 animate-pulse" />
    </div>
  );
}

function HomePage() {
  const [auth] = useAuth();

  return (
    <>
      <Layout title={"Home-Waste Management"}>
        <div className="container mx-auto px-4 py-16">
          <section className="text-center mb-20">
            <AnimatedGlobe />
            <h1 className="text-5xl font-bold mb-6 text-gray-800 tracking-tight">
              Our SDP Project{" "}
              <span className="text-green-700">Waste Management</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Join our community in making waste management more efficient and
              rewarding!
            </p>
            {!auth.accessToken ? (
              <>
                <Link
                  to={"/login"}
                  className="text-white bg-green-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-lg px-6 py-3 text-center inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={"/dashboard/reportWaste"}
                  className="text-white bg-green-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-lg px-6 py-3 text-center inline-flex items-center"
                >
                  Report Waste
                  <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </>
            )}
          </section>

          <section className="grid md:grid-cols-3 gap-10 mb-20">
            <FeatureCard
              icon={Leaf}
              title="Eco-Friendly"
              description="Contribute to a cleaner environment by reporting and collecting waste."
            />
            <FeatureCard
              icon={Coins}
              title="Earn Rewards"
              description="Get tokens for your contributions to waste management efforts."
            />
            <FeatureCard
              icon={Users}
              title="Community-Driven"
              description="Be part of a growing community committed to sustainable practices."
            />
          </section>

          <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-6 font-medium">
              <ImpactCard title="Waste Collected" icon={Recycle} />
              <ImpactCard title="Reports Submitted" value="" icon={MapPin} />
              <ImpactCard title="Tokens Earned" icon={Coins} />
              <ImpactCard title="CO2 Offset" icon={Leaf} />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <Icon className="h-8 w-8 text-green-700" />{" "}
        {/* This renders the passed icon component */}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ImpactCard({ title, value, icon: Icon }) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-US", { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-10 w-10 text-green-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

ImpactCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType.isRequired,
};

export default HomePage;
