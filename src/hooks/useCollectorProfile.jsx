import { useEffect , useState} from 'react'
import { useAuth } from '../context/Auth'

function useCollectorProfile() {
    const [auth] = useAuth();
    const [data, setData] = useState({});
  
    const accessToken = auth?.accessToken;
  
    // const datai = localStorage.getItem("auth");
    // console.log(datai);
  
    useEffect(() => {
      fetch(`${import.meta.env.VITE_APP_API}/collector/getProfile`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.detail == "empty") {
            setData(null);
          } else {
            setData(data);
            console.log(data);
          }
        });
    }, [accessToken]);

    return { data };
}

export default useCollectorProfile
