import Layout from "../components/Layout/Layout";
import { Coins, ArrowUpRight, MapPin, Gift, Loader } from "lucide-react";
import useProfile from "../hooks/useProfile";
import useReports from "../hooks/useReports";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useAuth } from "../context/Auth";
import { message } from "antd";
import GiftAnimation from "../animation/GiftAnimation";

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

const availableRewards = [
  {
    id: 1,
    title: "Need Points",
    cost: 10,
    description: "Redeem your points for rewards",
    description2: "Minimum 10 points required to redeem",
  },
  {
    id: 2,
    title: "Need Points",
    cost: 20,
    description: "Redeem your points for rewards",
    description2: "Minimum 20 points required to redeem",
  },
  {
    id: 3,
    title: "Need Points",
    cost: 10,
    description: "Redeem your points for rewards",
    description2: "Minimum 10 points required to redeem",
  },
];

function Rewards() {
  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const handleOpen = (reward) => {
    setSelectedReward(reward);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedReward(null);
  };

  const { data } = useProfile();
  const { wasteReports } = useReports(setLoading);

  const [auth] = useAuth();
  const accessToken = auth?.accessToken;

  // for gift animation
  const [showAnimation, setShowAnimation] = useState(false);

  const claimReward = async (cost) => {
    if (data.reward >= cost) {
      try {
        setIsClaiming(true);
        const response = await fetch(
          `${import.meta.env.VITE_APP_API}/resident/reedemReward`,
          {
            method: "PUT",
            headers: {
              "ngrok-skip-browser-warning": "69420",
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify({
              reward: cost,
            }),
          }
        );
        const responseData = await response.json();
        if (responseData.message === "SUCCESS") {
          message.success("Reward claimed successfully");
          handleClose();
          setShowAnimation(true);
          setTimeout(() => {
            setShowAnimation(false);
          }, 10000);
        } else {
          message.error(responseData.error || "Failed to claim the reward");
        }
      } catch (error) {
        console.error("Error claiming reward:", error);
        message.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsClaiming(false);
      }
    } else {
      message.error("You don't have enough points to claim this reward");
    }
  };

  return (
    <Layout title={"Rewards"}>
      <div className="p-8 max-w-5xl mx-auto">
        {showAnimation && <GiftAnimation />}
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

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Recent Transactions
            </h2>
            {loading ? (
              <>
                <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin h-8 w-8 text-gray-500" />
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {wasteReports.length > 0 ? (
                    wasteReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <ArrowUpRight className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">
                              Points earned for reporting waste
                            </p>
                            <p className="font-medium text-gray-800">
                              <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                              {report.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(report.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-500">
                          {report.reward}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No recent transactions
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Available Rewards
            </h2>
            <div className="space-y-4">
              {availableRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white p-4 rounded-xl shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {reward.title}
                    </h3>
                    <span className="text-green-500 font-semibold">
                      {reward.cost} points
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{reward.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {reward.description2}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <button
                        className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2"
                        onClick={() => handleOpen(reward)}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Get Reward
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedReward ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedReward.title}
                </h3>
                <span className="text-green-500 font-semibold">
                  {selectedReward.cost} points
                </span>
              </div>
              <p className="text-gray-600 mb-2">{selectedReward.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                {selectedReward.description2}
              </p>
              <div className="flex justify-center items-center mb-4">
                <Gift className="mr-2 w-[100px] h-[100px] text-green-700" />
              </div>
              <div className="space-y-2 text-center">
                <div className="mt-4">
                  <button
                    className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2 justify-center"
                    onClick={() => claimReward(selectedReward.cost)}
                  >
                    {isClaiming ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" />
                        Claiming ...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Reward
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </Modal>
    </Layout>
  );
}

export default Rewards;
