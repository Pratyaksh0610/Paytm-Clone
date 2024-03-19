import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function Signup() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-left">
            <div className="text-center">
              <h1 className="font-bold text-2xl">Sign Up</h1>
              <p className="text-gray-400">
                Enter your information to create an account
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 ">
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus-visible:ring"
                id="First Name"
                type="text"
                placeholder="John"
                onChange={(e) => {
                  setFname(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus-visible:ring"
                id="Last Name"
                type="text"
                placeholder="Doe"
                onChange={(e) => {
                  setLname(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus-visible:ring"
                id="email"
                type="text"
                placeholder="johndoe@company.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus-visible:ring"
                id="password"
                type="password"
                placeholder="**********"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                className=" bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="button"
                onClick={() => {
                  axios
                    .post("http://localhost:3000/api/v1/user/signup/", {
                      username: email,
                      password: password,
                      firstName: fname,
                      lastName: lname,
                    })
                    .then((res) => {
                      if (res.status == 200) {
                        Cookies.set("jwtoken", res.data.token);
                        navigate("/dashboard");
                      } else {
                        console.log(res);
                        alert("Error in credentials");
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      alert("Error");
                    });
                }}
              >
                Sign In
              </button>
            </div>
            <div className="text-center pt-3 font-bold">
              <span>Already have an account?</span>
              <a
                className="inline-block align-baseline font-bold text-sm text-black hover:text-blue-800 underline pl-2"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
