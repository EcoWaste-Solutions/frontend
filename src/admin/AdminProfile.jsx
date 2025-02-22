import Layout from "../components/Layout/Layout";
import useAdminProfile from "../hooks/useAdminProfile";

function AdminProfile() {
  const { data } = useAdminProfile();
  return (
    <Layout title={"Admin-Profile"}>
      <div className="p-3 max-w-5xl mx-auto">
        <div className="">
          <form className="bg-white p-8 rounded-2xl shadow-lg mb-2">
            <div>
              <img
                className="rounded-full w-[156px] h-[156px] object-cover text-center mx-auto"
                src={data?.image}
                alt=""
              />
            </div>
            <div className="grid gap-3 mb-6 md:grid-cols-2 mt-5">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  value={data?.name}
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="reward"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Reward
                </label>
                <input
                  type="text"
                  id="reward"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  value={data?.reward}
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  value={data?.email}
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  value={data?.address}
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  value={data?.phone}
                  required=""
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mb-8 bg-green-600 hover:bg-green-700 text-white py-2 text-lg rounded-xl transition-colors duration-300"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AdminProfile;
