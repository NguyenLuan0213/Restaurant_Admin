import "./App.css";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import PageContent from "./Components/PageContent";
import SideMenu from "./Components/SideMenu";
import { useState, useEffect } from "react";
import Login from "./Pages/Login";
import { remove } from "react-cookies";
import Loading from "./Components/Loading/Loading";
import cookie from "react-cookies";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi trang được tải lại
    const login = cookie.load("isLoggedIn");
    if (login === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa cookie
    remove("token");
    remove("userAdmin");
    // Xóa trạng thái đăng nhập khỏi localStorage
    remove("isLoggedIn");
    // Đặt trạng thái đăng nhập về `false`
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <Loading />
          <AppHeader handleLogout={handleLogout} />
          <div className="SideMenuAndPageContent">
            <SideMenu />
            <PageContent />
          </div>
          <AppFooter />
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;
