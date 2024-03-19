import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Send } from "./pages/Send";
import { Dashboard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
// import { Signup } from "./pages/Signup";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* <h1 className="text-emerald-400">Hello</h1> */}
      <BrowserRouter>
        <Routes>
          <Route path="/send" element={<Send />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
