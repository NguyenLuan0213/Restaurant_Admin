import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { TbBasketCancel } from "react-icons/tb";
import { Card, Space, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import { getSumUser, getCancelOrder, getBillDb } from "../../API";
import { Carousel } from 'antd';

import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import './Dashboard.css';

function Dashboard() {

  const [orders, setOrders] = useState(0);
  const [cancelorders, setCancelOrders] = useState(0);
  const [user, setUser] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    getBillDb().then((res) => {
      setOrders(res.sumOrder);
      setRevenue(res.totalPrice);
    });
    getCancelOrder().then((res) => {
      setCancelOrders(res.cancelOrderCount);
    });
    getSumUser().then((res) => {
      setUser(res);
      console.log(user);
    });
  }, []);

  return (
    <div>

      <Space size={20} direction="vertical">
        <Typography.Title style={{ fontSize: '24px', fontFamily: "Times" }} level={4}>TRANG CHỦ</Typography.Title>
        <Space direction="horizontal">
          <DashboardCard
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "blue",
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={
              <span style={{ color: "#000" }}>
                Tổng số đơn hàng
              </span>
            }
            value={orders}
          />
          <DashboardCard
            icon={
              <TbBasketCancel
                style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={
              <span style={{ color: "#000" }}>
                Số Đơn Hàng Bị Hủy
              </span>
            }
            value={cancelorders}
          />
          <DashboardCard
            icon={
              <UserOutlined
                style={{
                  color: "#0017f4",
                  background: "rgb(0 111 222 / 40%)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={
              <span style={{ color: "#000" }}>
                Số Người Dùng
              </span>
            }
            value={user}
          />
          <DashboardCard
            icon={
              <DollarCircleOutlined
                style={{
                  color: "green", // Thay đổi màu thành xanh lá
                  backgroundColor: "rgb(177, 248, 244)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={
              <span style={{ color: "#000" }}>
                Tổng Doanh Thu
              </span>
            }
            value={revenue.toLocaleString() + " VNĐ"}
          />

        </Space>
        <Space textAlign="center">
          <DashboardChart />
          {/* <Space>
            <DashboardLider />
          </Space> */}
        </Space>
      </Space>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}


function DashboardChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'https://localhost:7274/api/bill/getchartbymonthall';

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          let formattedData = data.map(item => ({
            name: `${item.date.year}-${item.date.month}`,
            value: item.totalDiscountAmount,
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };

    fetchData(); // Gọi fetchData khi component được hiển thị lần đầu
  }, []);

  return (
    <div >
      <p style={{ textAlign: "center", fontSize: "20px" }}>THỐNG KÊ NĂM DOANH THU NĂM 2023</p>
      <BarChart width={400} height={200} data={chartData} margin={{ left: 40 }}>
        <XAxis dataKey='name' />
        <YAxis />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip />
        <Legend />
        <Bar dataKey='value' fill='#8884d8' />
      </BarChart>
    </div>
  );
}

function DashboardLider() {

  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const carouselContainerStyle = {
    position: 'relative', // Đảm bảo vị trí tương đối để không bị xung đột với phần tử khác
    zIndex: 0, // Đặt độ ưu tiên hiển thị
  };

  return (
    <div className="container" style={carouselContainerStyle}>
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </div>
  )
}
export default Dashboard;
