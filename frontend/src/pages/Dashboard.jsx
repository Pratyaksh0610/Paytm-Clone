import Cookies from "js-cookie";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import randomColor from "randomcolor";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  const [amount, setAmount] = useState(0);
  const post = () => {
    const headers = {
      Authorization: "Bearer " + Cookies.get("jwtoken"),
    };
    try {
      console.log(receriverId);
      console.log(amount);
      axios
        .post(
          "http://localhost:3000/api/v1/account/transfer",
          { to: receriverId, amount: amount },
          { headers }
        )
        .then((res) => {
          if (res.status == 200) {
            alert("Transfer successful");
          } else {
            alert("Transfer unsuccessful, Low balance");
          }
        })
        .catch(() => {
          alert("Transfer unsuccessful");
        });
    } catch {
      alert("Transaction failed");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg w-96 p-6 text-center justify-evenly">
        <h1 className="font-bold text-xl pb-4">Send Money</h1>
        <input
          className="my-4 mb-8 w-full text-center h-8"
          type="number"
          placeholder="Enter Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 w-8/12"
          onClick={post}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full">
            Transfer
          </span>
        </button>
        <span
          className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};
let megaUserId = null;
export function Dashboard() {
  // const [loading, setLoading] = useState(true);
  // const [userBalance, setuserBalance] = useState(null);
  // const [userData, setuserData] = useState(null);
  // const [userId,setuserId]=useState(0);
  //diff
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const cookieValue = Cookies.get("jwtoken");
      try {
        const resolveTokenResponse = await axios.post(
          "http://localhost:3000/api/v1/user/resolveToken/",
          {
            token: cookieValue,
          }
        );
        if (resolveTokenResponse.status === 200) {
          setUserData(resolveTokenResponse.data);
          const headers = { Authorization: "Bearer " + cookieValue };
          const balanceResponse = await axios.get(
            "http://localhost:3000/api/v1/account/balance",
            { headers }
          );
          setUserBalance(balanceResponse.data.balance);
          setLoading(false);
        } else {
          navigate("/signin");
        }
      } catch (error) {
        navigate("/signin");
      }
    };

    fetchData();
  }, [navigate]);
  // useEffect(() => {
  //   const cookieValue = Cookies.get("jwtoken");
  //   console.log("WORKING ONCE");
  //   try {
  //     axios
  //       .post("http://localhost:3000/api/v1/user/resolveToken/", {
  //         token: cookieValue,
  //       })
  //       .then((res) => {
  //         if (res.status == 200) {
  //           console.log("RECEVIED");
  //           console.log(res.data);
  //           setuserData(res.data);
  //           megaUserId = res.data.userId;
  //         } else {
  //           console.log("FAILED");
  //           navigate("/signin");
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         navigate("/signin");
  //       });
  //     const headers = {
  //       Authorization: "Bearer " + cookieValue,
  //     };
  //     axios
  //       .get("http://localhost:3000/api/v1/account/balance", { headers })
  //       .then((res) => {
  //         setuserBalance(res.data.balance);
  //         console.log(res.data.balance);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         navigate("/sigin");
  //       });
  //   } catch (error) {
  //     navigate("/signin");
  //   }
  // }, []);
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
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold mr-2 middle ">
              Hello, {userData.firstName}
            </span>
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold text-lg"
              style={{ backgroundColor: randomColor() }}
            >
              {userData.firstName.charAt(0)}
            </div>
          </div>
        </div>
        <hr className="border-b-2 border-gray-400" />
        <div className="flex justify-between">
          <div className="font-bold text-md flex justify-start my-4">
            <span className="pr-2">Your Balance</span>
            <span>${userBalance}</span>
          </div>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-4 my-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={() => {
              Cookies.set("jwtoken", "fhadsfksjf");
              setLoading(true);
              navigate("/signin");
            }}
          >
            Logout
          </button>
        </div>
        <Userlist />
      </div>
    </>
  );
}
let receriverId = null;
function Userlist() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [arr, setArr] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (sendtoId) => {
    receriverId = sendtoId;
    console.log("receiver id is");
    console.log(sendtoId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
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

          {arr.map((user, index) => (
            <div className="flex justify-between" key={index}>
              <div className="flex justify-start">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold text-lg"
                  style={{ backgroundColor: randomColor() }}
                >
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className="pl-4 h-10 flex items-center justify-center  text-black font-semibold text-lg">
                  <p className="font-bold">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
              <button
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 "
                onClick={() => handleOpenModal(user._id)}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Send Money
                </span>
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </>
  );
}
