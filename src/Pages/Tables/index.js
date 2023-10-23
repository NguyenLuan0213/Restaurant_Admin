import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input } from "antd";
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getTables } from "../../API";
import { Tag } from 'antd';
import { Select } from 'antd';
import './table.css';
const { Option } = Select;

const Tables = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTableData, setNewTableData] = useState({
        restaurantId: "",
        tableNumber: "",
        seats: 0,
        status: "Chưa đặt",
        idWaiter: "",
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [editTableData, setEditTableData] = useState({
        restaurantId: "",
        tableNumber: "",
        seats: 0,
        status: "Chưa đặt",
        idWaiter: "",
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddTable = () => {
        showModal();
    };

    const handleEdit = (id) => {
        setSelectedTableId(id);
        const tableToEdit = dataSource.find((table) => table.id === id);
        if (tableToEdit) {
            setEditTableData({ ...tableToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleDelete = (id) => {
        fetch(`https://localhost:7274/api/tables/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Bản ghi có ID ${id} đã được xóa thành công.`);
                    // Reload trang sau khi xóa thành công
                    window.location.reload();
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

    const handleUpdate = () => {
        fetch(`https://localhost:7274/api/tables/update/${selectedTableId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editTableData),
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Bản ghi có ID ${selectedTableId} đã được cập nhật thành công.`);
                    // Reload trang sau khi cập nhật thành công
                    return getTables();
                }
                else {
                    throw new Error('Cập nhật không thành công');
                }
            })
            .then((newDataSource) => {
                setDataSource(newDataSource);
                setIsEditModalVisible(false);
            })
            .catch((error) => {
                alert(`Lỗi khi thực hiện cập nhật bản ghi: ${error}`);
            });

        setIsEditModalVisible(false);
    };

    const handleOk = () => {
        const idWaiterValue = newTableData.idWaiter ? newTableData.idWaiter : null;
        const newTable = {
            restaurantId: newTableData.restaurantId,
            tableNumber: newTableData.tableNumber,
            seats: newTableData.seats,
            status: newTableData.status,
            idWaiter: idWaiterValue,
        };

        fetch('https://localhost:7274/api/tables', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTable),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Dữ liệu mới đã được thêm:', data);
                setDataSource([...dataSource, data]);
                setIsModalVisible(false);

                // Thông báo thành công
                alert('Thêm dữ liệu thành công');
            })
            .catch((error) => {
                console.error('Lỗi khi thêm dữ liệu:', error);

                // Thông báo thất bại
                alert('Thêm dữ liệu thất bại');
            });
    };

    useEffect(() => {
        setLoading(true);
        getTables().then((res) => {
            console.log(res);
            setDataSource(res);
            setLoading(false);
        });
    }, []);

    const showDeleteConfirm = (id) => {
        setSelectedTableId(id);
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

    return (
        <div className="container" id="Tables">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU BÀN ĂN</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddTable()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: '100px' }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm bàn
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "ID",
                                dataIndex: "id",
                                render: (value) => <span>{value}</span>,
                                key: "id",
                            },
                            {
                                title: "Tên phục vụ",
                                dataIndex: "idWaiter",
                                render: (value) => <span>{value}</span>,
                                key: "idWaiter",
                            },
                            {
                                title: "Thuộc Nhà Hàng",
                                dataIndex: "restaurantId",
                                render: (value) => <span>{value}</span>,
                                key: "restaurantId",
                            },
                            {
                                title: "Số ghế",
                                dataIndex: "seats",
                                render: (value) => <span>{value}</span>,
                                key: "seats",
                            },
                            {
                                title: "Trạng thái",
                                dataIndex: "status",
                                render: (value) => (
                                    <Tag color={value === "Đang đặt" ? "red" : "green"}>
                                        {value}
                                    </Tag>
                                ),
                                key: "status",
                            },
                            {
                                title: "Số bàn",
                                dataIndex: "tableNumber",
                                render: (value) => <span>{value}</span>,
                                key: "tableNumber",
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
                        className="custom-table-class"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm bàn mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Số bàn:</label>
                    <Input
                        type="text"
                        value={newTableData.tableNumber}
                        onChange={(e) => setNewTableData({ ...newTableData, tableNumber: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số ghế:</label>
                    <Input
                        type="number"
                        value={newTableData.seats}
                        onChange={(e) => setNewTableData({ ...newTableData, seats: e.target.value })}
                    />
                </div>
                <div>
                    <label>Thuộc nhà hàng:</label>
                    <Input
                        type="text"
                        value={newTableData.restaurantId}
                        onChange={(e) => setNewTableData({ ...newTableData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>ID phục vụ:</label>
                    <Input
                        type="text"
                        value={newTableData.idWaiter}
                        onChange={(e) => setNewTableData({ ...newTableData, idWaiter: e.target.value })}
                    />
                </div>
            </Modal>

            <Modal
                title="Chỉnh sửa bàn"
                open={isEditModalVisible}
                onOk={handleUpdate}
                onCancel={handleEditCancel}
            >
                <div>
                    <label>Số bàn:</label>
                    <Input
                        type="text"
                        value={editTableData.tableNumber}
                        onChange={(e) => setEditTableData({ ...editTableData, tableNumber: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số ghế:</label>
                    <Input
                        type="number"
                        value={editTableData.seats}
                        onChange={(e) => setEditTableData({ ...editTableData, seats: e.target.value })}
                    />
                </div>
                <div>
                    <label>Thuộc nhà hàng:</label>
                    <Input
                        type="text"
                        value={editTableData.restaurantId}
                        onChange={(e) => setEditTableData({ ...editTableData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Trạng thái:</label>
                    <Select
                        value={editTableData.status}
                        onChange={(value) => setEditTableData({ ...editTableData, status: value })}
                        style={{ width: '100%' }}
                    >
                        <Option value="Chưa đặt">Chưa đặt</Option>
                        <Option value="Đang đặt">Đang đặt</Option>
                    </Select>
                </div>
                <div>
                    <label>ID phục vụ:</label>
                    <Input
                        type="text"
                        value={editTableData.idWaiter}
                        onChange={(e) => setEditTableData({ ...editTableData, idWaiter: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    )
};

export default Tables;
