import Layout from "../components/Layout/Layout";
import { Coins } from "lucide-react";
import useProfile from "../hooks/useProfile";

function Rewards() {

  const { data } = useProfile();
  return (
    <Layout title={"Rewards"}>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full border-l-4 border-green-500 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Reward Balance
          </h2>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <Coins className="w-10 h-10 mr-3 text-green-500" />
              <div>
                <span className="text-4xl font-bold text-green-500">
                  {data?.reward}
                </span>
                <p className="text-sm text-gray-500">Available Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Rewards;
