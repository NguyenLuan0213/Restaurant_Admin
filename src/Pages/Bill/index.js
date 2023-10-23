import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getBill } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from 'date-fns';
import "./bill.css";

function Orders() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getBill().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
        });
    }, []);

    const handleAddBill = () => {
        showModal();
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newBillData, setNewBillData] = useState({
        orderId: "",
        billDate: new Date(),
        promotionId: null,
    });

    const formattedBillTime = format(new Date(newBillData.billDate), 'yyyy-MM-dd HH:mm:ss');
    const handleOk = () => {
        const newBill = {
            orderId: newBillData.orderId,
            billDate: formattedBillTime,
            promotionId: newBillData.promotionId,
        };
        fetch('https://localhost:7274/api/bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBill),
        })
            .then((response) => response.json())
            .then((data) => {
                {
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
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [editBillData, setEditBillData] = useState({
        orderId: "",
        billDate: new Date(),
        promotionId: null,
    });


    const billDate = format(new Date(editBillData.billDate), 'yyyy-MM-dd HH:mm:ss');

    const handleEdit = (id) => {
        setSelectedBillId(id);
        const billToEdit = dataSource.find((bill) => bill.id === id);
        if (billToEdit) {
            setEditBillData({ ...billToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleUpdate = () => {
        let editBill = {
            id: selectedBillId,
            orderId: editBillData.orderId,
            billDate: billDate,
            promotionId: editBillData.promotionId,
        };
        fetch(`https://localhost:7274/api/bill/update/${selectedBillId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editBill),
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Cập nhật bản ghi có ID ${selectedBillId} thành công.`);
                    return getBill();
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
        setSelectedBillId(id);
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
        fetch(`https://localhost:7274/api/bill/delete/${id}`, {
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
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU HÓA ĐƠN</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddBill()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Đơn Hóa Đơn
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id Hóa Đơn",
                                dataIndex: "id",
                            },
                            {
                                title: "Mã Đăt Bàn",
                                dataIndex: "orderId",
                            },
                            {
                                title: "Mã Khách Hàng",
                                dataIndex: "customerId",
                            },
                            {
                                title: "Ngày Tạo Hóa Đơn",
                                dataIndex: "billDate",
                            },
                            {
                                title: "Tổng Tiền Hóa Đơn",
                                dataIndex: "totalAmount",
                            },
                            {
                                title: "Tổng Tiền Giảm Giá",
                                dataIndex: "discountAmount",
                            },
                            {
                                title: "Mã Giảm Giá",
                                dataIndex: "promotionId",
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
                        className="custom-bill-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm hóa đơn mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Mã Đơn Đặt Bàn:</label>
                    <Input
                        type="text"
                        value={newBillData.orderId}
                        onChange={(e) => setNewBillData({ ...newBillData, orderId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Khuyến Mãi:</label>
                    <Input
                        type="number"
                        value={newBillData.promotionId}
                        onChange={(e) => setNewBillData({ ...newBillData, promotionId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Ngày Thanh Toán:</label>
                    <input
                        type="datetime-local"
                        value={newBillData.billDate}
                        onChange={(e) => setNewBillData({ ...newBillData, billDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
            </Modal>

            <Modal
                title="Chỉnh sửa hóa đơn"
                open={isEditModalVisible}
                onOk={handleUpdate}
                onCancel={handleEditCancel}
            >
                <div>
                    <label>Mã Đơn Đặt Bàn:</label>
                    <Input
                        type="text"
                        value={editBillData.orderId}
                        onChange={(e) => setEditBillData({ ...editBillData, orderId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Khuyến Mãi:</label>
                    <Input
                        type="number"
                        value={editBillData.promotionId}
                        onChange={(e) => setEditBillData({ ...editBillData, promotionId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Ngày Thanh Toán:</label>
                    <input
                        type="datetime-local"
                        value={editBillData.billDate}
                        onChange={(e) => setEditBillData({ ...editBillData, billDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Orders;
