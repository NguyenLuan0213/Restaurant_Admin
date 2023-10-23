import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faPercent, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { BiFoodMenu } from "react-icons/bi";
import { SiAirtable } from "react-icons/si";
import { MdOutlineFoodBank } from "react-icons/md";
import { PiCookingPotBold, PiUserCircleGear } from "react-icons/pi";
import { AiOutlineBarChart } from "react-icons/ai";
import "./sideMenu.css";


function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Trang Chủ",
            icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
            key: "/",
          },
          {
            label: "Nhà Hàng",
            key: "/restaurant",
            icon: <ShopOutlined style={{ fontSize: "20px" }} />,
          },
          {
            label: "Bàn Nhà Hàng",
            key: "/tables",
            icon: <SiAirtable style={{ fontSize: "20px" }} />,
          },
          {
            label: "Thực Đơn",
            key: "/menus",
            icon: <BiFoodMenu style={{ fontSize: "20px" }} />,
          },
          {
            label: "Món ăn",
            key: "/menuitem",
            icon: <MdOutlineFoodBank style={{ fontSize: "25px" }} />,
          },
          {
            label: "Nấu ăn",
            key: "/mean",
            icon: <PiCookingPotBold style={{ fontSize: "20px" }} />,
          },
          {
            label: "Nấu món ăn",
            key: "/meanitem",
            icon: <FontAwesomeIcon icon={faUtensils} style={{ fontSize: "25px" }} />,
          },
          {
            label: "Đơn đặt bàn",
            key: "/orders",
            icon: <ShoppingCartOutlined style={{ fontSize: "20px" }} />,
          },
          {
            label: "Hóa Đơn",
            key: "/bill",
            icon: (
              <FontAwesomeIcon icon={faWallet} style={{ width: "20px", height: "20px" }} />
              // Thay đổi kích thước ở đây
            ),
          },
          {
            label: "Bình Luận",
            key: "/comments",
            icon: (
              <FontAwesomeIcon icon={faComment} style={{ width: "20px", height: "20px" }} />
              // Thay đổi kích thước ở đây
            ),
          },
          {
            label: "Khuyến Mãi",
            key: "/promotion",
            icon: (
              <FontAwesomeIcon icon={faPercent} style={{ width: "20px", height: "20px" }} />
              // Thay đổi kích thước ở đây
            ),
          },
          {
            label: "Thống kê",
            key: "/chart",
            icon: (
              <AiOutlineBarChart style={{ width: "20px", height: "20px" }} />
              // Thay đổi kích thước ở đây
            ),
          },
          {
            label: "Người Dùng",
            key: "/user",
            icon: <UserOutlined style={{ fontSize: "20px" }} />,
          },
          {
            label: "Vai trò",
            key: "/roles",
            icon: <PiUserCircleGear style={{ fontSize: "20px" }} />,
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideMenu;
