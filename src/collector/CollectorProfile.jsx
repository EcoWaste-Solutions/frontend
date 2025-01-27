import Layout from "../components/Layout/Layout";
import useCollectorProfile from "../hooks/useCollectorProfile";
import { User, Mail, MapPin, Phone, Coins } from "lucide-react";

function CollectorProfile() {
  const { data } = useCollectorProfile();
  return (
    <Layout title={"Collector Profile"}>
      <div className="max-w-5xl mx-auto">
        <div>
          <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
            <div className="mt-1 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
              <div className="p-2 flex flex-col gap-3 rounded-md">
                <div className="">
                  <div className="flex gap-2 items-center p-3">
                    <img
                      src={data?.image}
                      alt=""
                      className="w-[100px] h-[100px] object-cover rounded-md left-0"
                    />
                    <div className="flex flex-col">
                      <span className="px-5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-200 text-indigo-800">
                        COLLECTOR
                      </span>
                      <h1 className="font-medium tex-xl">{data?.name}</h1>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
              <div className="border-dashed border-2 p-2 flex flex-col gap-3 rounded-md">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={data?.name}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={data?.email}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={data?.address}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={data?.phone}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="points"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Points
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="points"
                      name="points"
                      value={data?.reward}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <Coins
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <button className="mb-2 bg-blue-600 hover:bg-blue-700 text-white p-2 text-xl rounded-xl transition-colors duration-300 w-full">
                    Update Info
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default CollectorProfile;
