import Layout from "../components/Layout/Layout";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";

function Overview() {
  return (
    <Layout title={"Overview"}>
      <div className="p-3 max-w-5xl mx-auto">
        <div className="flex flex-col gap-3">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Charts
              </h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["group A", "group B", "group C"],
                    },
                  ]}
                  series={[
                    { data: [4, 3, 5] },
                    { data: [1, 6, 3] },
                    { data: [2, 5, 6] },
                  ]}
                  width={500}
                  height={300}
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Charts
              </h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <LineChart
                  xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                  series={[
                    {
                      data: [2, 5.5, 2, 8.5, 1.5, 5],
                      area: true,
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Overview;
