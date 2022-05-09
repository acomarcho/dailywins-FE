import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Main from "./pages/main/Main"

const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="app" element={<Main />} />
    </Routes>
  </BrowserRouter>
}

export default App;