import Cookies from "js-cookie";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import randomColor from "randomcolor";
import { Button } from "@material-tailwind/react";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userBalance, setuserBalance] = useState(null);
  const [userData, setuserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cookieValue = Cookies.get("jwtoken");
    console.log("WORKING ONCE");
    try {
      axios
        .post("http://localhost:3000/api/v1/user/resolveToken/", {
          token: cookieValue,
        })
        .then((res) => {
          if (res.status == 200) {
            console.log("RECEVIED");
            console.log(res.data.firstName);
            setuserData(res.data.firstName);
          } else {
            console.log("FAILED");
            navigate("/signin");
          }
        });
      const headers = {
        Authorization: "Bearer " + cookieValue,
      };
      axios
        .get("http://localhost:3000/api/v1/account/balance", { headers })
        .then((res) => {
          setuserBalance(res.data.balance);
          console.log(res.data.balance);
          setLoading(false);
        });
    } catch (error) {
      navigate("/signin");
    }
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <div className="flex justify-between pb-1">
          <div>
            <h1 className="text-2xl font-bold text-black">Payments App</h1>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Hello, {userData}</h2>
          </div>
        </div>
        <hr className="border-b-2 border-gray-400" />
        <div className="font-bold text-md flex justify-start my-4">
          <span className="pr-2">Your Balance</span>
          <span>${userBalance}</span>
        </div>
        <Userlist />
      </div>
    </>
  );
}
function Userlist() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [arr, setArr] = useState([]);
  // let arr = [];

  const handleSearch = (value) => {
    // Perform search action here
    try {
      const queryParams = {
        filter: value,
      };
      console.log("query is " + value);
      axios
        .get("http://localhost:3000/api/v1/user/bulk", { params: queryParams })
        .then((res) => {
          setArr(res.data.user);
          console.log("This is res");
          console.log(res);
        });
    } catch {}
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        handleSearch(value);
      }, 500)
    );
  };

  return (
    <>
      <div className="text-left">
        <div className="text-left">
          <h1 className="font-bold text-lg py-2">Users</h1>
          <input
            placeholder="Search users..."
            className="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            mb-3
            leading-tight
            focus:outline-none
            focus:shadow-outline
            focus-visible:ring"
            type="text"
            onChange={handleChange}
          />

          {/* <MatchingUsers props={arr} /> */}
          {arr.map((user, index) => (
            <div className="flex justify-between" key={index}>
              <div className="flex justify-start">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold text-lg"
                  style={{ backgroundColor: randomColor() }}
                >
                  {user.firstName.charAt(0)}
                </div>
                <div className="pl-4 h-10 flex items-center justify-center  text-black font-semibold text-lg">
                  <p className="font-bold">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 ">
                <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Send Money
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
