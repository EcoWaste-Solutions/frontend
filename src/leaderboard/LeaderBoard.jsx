import Layout from "../components/Layout/Layout";
import { Trophy, Award, Crown, User, Loader } from "lucide-react";
import { useEffect, useState } from "react";

function LeaderBoard() {
  const [rewards, setReward] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Start loading when the effect runs
    fetch(`${import.meta.env.VITE_APP_API}/leaderBoard/leaderBoard`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === "empty") {
          setReward(null);
        } else {
          setReward(data);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetching is complete (success or error)
      });
  }, []);
  return (
    <Layout title={"LeaderBoard"}>
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <>
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex justify-between items-center text-white">
                  <Trophy className="h-10 w-10" />
                  <span className="text-2xl font-bold">Top Performers</span>
                  <Award className="h-10 w-10" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rewards.length > 0 ? (
                      rewards.map((rewardInfo, index) => (
                        <tr
                          key={rewardInfo.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <Crown
                                  className={`h-6 w-6 ${
                                    index === 0
                                      ? "text-yellow-400"
                                      : index === 1
                                      ? "text-gray-400"
                                      : "text-yellow-600"
                                  }`}
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-900">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <User className="h-full w-full rounded-full bg-gray-200 text-gray-500 p-2" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {rewardInfo.name}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Award className="h-5 w-5 text-indigo-500 mr-2" />
                              <div className="text-sm font-semibold text-gray-900">
                                {rewardInfo.reward.toLocaleString()}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              Level 1
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          LeaderBoard is Empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default LeaderBoard;
