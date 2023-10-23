import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image, Tag, Select } from "antd";
import { useEffect, useState } from "react";
import { getOrders } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from 'date-fns';
import "./orders.css";
const { Option } = Select;

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    cashierId: null,
    customerId: null,
    tableId: "",
    orderTime: new Date(),
    status: "Chưa thanh toán",
  });

  const formattedOrderTime = format(new Date(newOrderData.orderTime), 'yyyy-MM-dd HH:mm:ss');

  useEffect(() => {
    setLoading(true);
    getOrders().then((res) => {
      setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
      setLoading(false);
    });
  }, []);

  const handleAddOrders = () => {
    // Viết mã xử lý sự kiện thêm bàn tại đây
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    const newOrder = {
      cashierId: newOrderData.cashierId,
      customerId: newOrderData.customerId,
      tableId: newOrderData.tableId,
      orderTime: formattedOrderTime,
      status: newOrderData.status,
    };
    fetch('https://localhost:7274/api/orders/addorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then((response) => response.json())
      .then((data) => {
        {
          console.log(data);
          setDataSource([...dataSource, data]); // Không thêm dữ liệu mới vào đây vì không có dữ liệu trả về
          setIsModalVisible(false);
          // Thông báo thành công
          alert('Thêm dữ liệu thành công');
        }
      })
      .catch((error) => {
        console.error('Lỗi khi thêm dữ liệu:', error);

        // Thông báo thất bại
        alert('Thêm dữ liệu thất bại');
      });

  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editOrderData, setEditOrderData] = useState({
    cashierId: null,
    customerId: null,
    tableId: "",
    orderTime: new Date(),
    status: "Chưa thanh toán",
  });

  const handleEdit = (id) => {
    setSelectedOrderId(id);
    const orderToEdit = dataSource.find((orders) => orders.id === id);
    if (orderToEdit) {
      setEditOrderData({ ...orderToEdit });
    }
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const OrderTime = format(new Date(editOrderData.orderTime), 'yyyy-MM-dd HH:mm:ss');

  const handleUpdate = () => {
    let editOrder = {
      id: selectedOrderId,
      cashierId: editOrderData.cashierId,
      customerId: editOrderData.customerId,
      tableId: editOrderData.tableId,
      orderTime: OrderTime,
      status: editOrderData.status,
    };
    fetch(`https://localhost:7274/api/orders/update/${selectedOrderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editOrder),
    })
      .then((response) => {
        if (response.status === 204) {
          alert(`Cập nhật bản ghi có ID ${selectedOrderId} thành công.`);
          return getOrders();
        } else {
          throw new Error('Cập nhật không thành công');
        }
      })
      .then((newDataSource) => {
        setDataSource(newDataSource);
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        console.error(`Lỗi khi cập nhật bản ghi: ${error}`);
      });
  };

  const showDeleteConfirm = (id) => {
    setSelectedOrderId(id);
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa không?",
      onOk() {
        // Gọi hàm xóa khi xác nhận xóa
        handleDelete(id);
      },
      onCancel() {
        // Không làm gì khi hủy
      },
    });
  };

  // Hàm xử lý sự kiện khi người dùng click vào biểu tượng xóa
  const handleDelete = (id) => {
    fetch(`https://localhost:7274/api/orders/delete/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          alert(`Bản ghi có ID ${id} đã được xóa thành công.`);
          // Loại bỏ dữ liệu món ăn khỏi trạng thái
          const updatedDataSource = dataSource.filter((item) => item.id !== id);
          setDataSource(updatedDataSource);
        } else if (response.status === 404) {
          alert(`Không tìm thấy bản ghi có ID ${id} để xóa.`);
        } else {
          return response.json(); // Đọc thông báo lỗi từ phản hồi
        }
      })
      .then((data) => {
        if (data) {
          alert(`Xóa bản ghi không thành công: ${data}`);
        }
      })
      .catch((error) => {
        alert(`Lỗi khi thực hiện xóa bản ghi: ${error}`);
      });
  };

  return (
    <div className="container" id="MeanItem">
      <div className="centered-content">
        <Space size={20} direction="vertical">
          <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU ĐẶT BÀN</Typography.Title>
          <Button
            type="primary"
            onClick={() => handleAddOrders()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
            style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
          >
            Thêm Đơn Đặt Bàn
          </Button>
          <Table
            loading={loading}
            columns={[
              {
                title: "Id Đơn Đặt Bàn",
                dataIndex: "id",
              },
              {
                title: "Id Thu Ngân",
                dataIndex: "cashierId",
              },
              {
                title: "Id Khách Hàng",
                dataIndex: "customerId",
              },
              {
                title: "Id Bàn Đặt",
                dataIndex: "tableId",
              },
              {
                title: "Ngày Đặt Bàn",
                dataIndex: "orderTime",
                render: (text) => format(new Date(text), 'yyyy-MM-dd HH:mm:ss'),
              },
              {
                title: "Trạng Thái",
                dataIndex: "status",
                render: (value) => (
                  <Tag
                    color={
                      value === "Chưa thanh toán"
                        ? "yellow"
                        : value === "Đã thanh toán"
                          ? "green"
                          : "red"
                    }
                  >
                    {value}
                  </Tag>
                ),
              },
              {
                title: "Tổng Tiền",
                dataIndex: "totalPrice",
              },
              {
                title: "Chức năng",
                render: (text, record) => (
                  <span>
                    <FormOutlined
                      style={{ color: 'blue', cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => handleEdit(record.id)}
                      title="Sửa"
                      data-placement="top" // Hiển thị tooltip ở phía trên nút
                      className="custom-tooltip"
                    />

                    <DeleteOutlined
                      style={{ color: 'red', cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => showDeleteConfirm(record.id)}
                      title="Xóa"
                      data-placement="top" // Hiển thị tooltip ở phía trên nút
                      className="custom-tooltip"
                    />
                  </span>
                ),
              },
            ]}
            dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
            pagination={{
              pageSize: 10,
            }}
            className="custom-orders-table"
          ></Table>
        </Space>
      </div>

      <Modal
        title="Thêm đơn đặt bàn mới"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <label>Mã Thu Ngân:</label>
          <Input
            type="text"
            value={newOrderData.cashierId}
            onChange={(e) => setNewOrderData({ ...newOrderData, cashierId: e.target.value })}
          />
        </div>
        <div>
          <label>Mã Khách Hàng:</label>
          <Input
            type="text"
            value={newOrderData.customerId}
            onChange={(e) => setNewOrderData({ ...newOrderData, customerId: e.target.value })}
          />
        </div>
        <div>
          <label>Mã Bàn Được Đặt:</label>
          <Input
            type="number"
            value={newOrderData.tableId}
            onChange={(e) => setNewOrderData({ ...newOrderData, tableId: e.target.value })}
          />
        </div>
        <div className="status-input">
          <label>Trạng Thái:</label>
          <select
            value={newOrderData.status}
            onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
            className="status-input"
          >
            <option value="Chưa thanh toán">Chưa thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div>
          <label>Ngày Đặt:</label>
          <input
            type="datetime-local"
            value={newOrderData.orderTime}
            onChange={(e) => setNewOrderData({ ...newOrderData, orderTime: e.target.value })}
            className="dateTime-custum"
          />
        </div>
      </Modal>

      <Modal
        title="Chỉnh sửa nấu món ăn"
        open={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={handleEditCancel}
      >
        <div>
          <label>Mã Thu Ngân:</label>
          <Input
            type="text"
            value={editOrderData.cashierId}
            onChange={(e) => setEditOrderData({ ...editOrderData, cashierId: e.target.value })}
          />
        </div>
        <div>
          <label>Mã Khách Hàng:</label>
          <Input
            type="text"
            value={editOrderData.customerId}
            onChange={(e) => setEditOrderData({ ...editOrderData, customerId: e.target.value })}
          />
        </div>
        <div>
          <label>Mã Bàn Được Đặt:</label>
          <Input
            type="number"
            value={editOrderData.tableId}
            onChange={(e) => setEditOrderData({ ...editOrderData, tableId: e.target.value })}
          />
        </div>
        <div className="status-input">
          <label>Trạng Thái:</label>
          <Select
            value={editOrderData.status}
            onChange={(value) => setEditOrderData({ ...editOrderData, status: value })}
            style={{ width: '100%' }}
          >
            <Option value="Chưa thanh toán">Chưa thanh toán</Option>
            <Option value="Đã thanh toán">Đã thanh toán</Option>
            <Option value="Đã hủy">Đã hủy</Option>
          </Select>
        </div>
        <div>
          <label>Ngày Đặt:</label>
          <input
            type="datetime-local"
            value={editOrderData.orderTime}
            onChange={(e) => setEditOrderData({ ...editOrderData, orderTime: e.target.value })}
            className="dateTime-custum"
          />
        </div>
      </Modal>
    </div>
  );
}

export default Orders;
