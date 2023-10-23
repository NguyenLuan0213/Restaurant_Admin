// AppHeader.js
import { BellFilled, MailOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { getComments } from "../../API";
import cookie from "react-cookies";
import { getOrders } from "../../API";
import { Link } from "react-router-dom";
import "./header.css";

function AppHeader({ handleLogout }) {
  const [comments, setComments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState("");


  useEffect(() => {
    getComments().then((res) => {
      setComments(res.comments);
    });
    getOrders().then((res) => {
      setOrders(res.products);
    });

    const userData = cookie.load("userAdmin");
    if (userData) {
      setUserName(userData.fullName); // Cập nhật tên người dùng
    }
  }, []);

  return (
    <div className="AppHeader">
      <Image
        width={40}
        src="https://res.cloudinary.com/dendeb697/image/upload/v1697865234/ogf6r0iju7qfo99aokia.jpg"
      ></Image>
      <Typography.Title style={{ color: '#0077b6', fontSize: '24px', fontFamily: "Times" }}>Xin Chào: {userName}</Typography.Title>
      <Space>
        <Link to="/userInfo">
          <UserOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
        </Link>
        <LogoutOutlined
          style={{ fontSize: 24 }}
          onClick={handleLogout} // Gọi hàm xử lý đăng xuất khi nút được nhấn
        />
      </Space>
    </div>
  );
}

export default AppHeader;
