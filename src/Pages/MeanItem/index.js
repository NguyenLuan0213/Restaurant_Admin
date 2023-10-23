import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getMeanItem } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tag } from 'antd';
import Loading from "../../Components/Loading/Loading";
import "./meanitem.css";

function Mean() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newMeanItemData, setNewMeanItemData] = useState({
        meanId: "",
        menuItemId: "",
        quantity: 0,
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedMeanItemId, setSelectedMeanItemId] = useState(null);
    const [editMeanItemData, setEditMeanItemData] = useState({
        meanId: "",
        menuItemId: "",
        quantity: 0,
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddMeanItem = () => {
        showModal();
    };

    const handleEdit = (id) => {
        setSelectedMeanItemId(id);
        const meanItemToEdit = dataSource.find((meanitem) => meanitem.id === id);
        if (meanItemToEdit) {
            setEditMeanItemData({ ...meanItemToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const showDeleteConfirm = (id) => {
        setSelectedMeanItemId(id);
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
        fetch(`https://localhost:7274/api/meanitem/delete/${id}`, {
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

    const handleOk = () => {
        const newMeanItem = {
            meanId: newMeanItemData.meanId,
            menuItemId: newMeanItemData.meanId,
            quantity: newMeanItemData.quantity,
        };

        fetch('https://localhost:7274/api/meanitem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMeanItem),
        })
            .then((response) => response.json())
            .then((data) => {

                setDataSource([...dataSource, data]);
                setIsModalVisible(false);
                // Thông báo thành công
                alert('Thêm dữ liệu thành công');

                // Làm mới trang
                // window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi thêm dữ liệu:', error);

                // Thông báo thất bại
                alert('Thêm dữ liệu thất bại');
            });
    };

    const handleUpdate = () => {
        fetch(`https://localhost:7274/api/meanitem/update/${selectedMeanItemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editMeanItemData),
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Cập nhật bản ghi có ID ${selectedMeanItemId} thành công.`);
                    return getMeanItem();
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

    useEffect(() => {
        setLoading(true);
        getMeanItem().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
            console.log(res);
        });
    }, []);

    return (
        <div className="container" id="MeanItem">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU NẤU MÓN ĂN</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddMeanItem()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Nấu Món Ăn
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id Nấu Món Ăn",
                                dataIndex: "id",
                            },
                            {
                                title: "Id Nấu Ăn",
                                dataIndex: "meanId",
                            },
                            {
                                title: "Id Món Ăn",
                                dataIndex: "menuItemId",
                            },
                            {
                                title: "Số Lượng",
                                dataIndex: "quantity",
                            },
                            {
                                title: "Tổng Tiền",
                                dataIndex: "totalPrice",
                                render: (value) => <span>{parseFloat(value).toLocaleString('vi-VN')} VNĐ</span>
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
                        className="custom-meanitem-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm món nấu ăn mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Mã Nấu Ăn:</label>
                    <Input
                        type="number"
                        value={newMeanItemData.meanId}
                        onChange={(e) => setNewMeanItemData({ ...newMeanItemData, meanId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Món Ăn:</label>
                    <Input
                        type="number"
                        value={newMeanItemData.menuItemId}
                        onChange={(e) => setNewMeanItemData({ ...newMeanItemData, menuItemId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số Lương: </label>
                    <Input
                        type="number"
                        value={newMeanItemData.quantity}
                        onChange={(e) => setNewMeanItemData({ ...newMeanItemData, quantity: e.target.value })}
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
                    <label>Mã Nấu Ăn:</label>
                    <Input
                        type="text"
                        value={editMeanItemData.meanId}
                        onChange={(e) => setEditMeanItemData({ ...editMeanItemData, meanId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Món Ăn:</label>
                    <Input
                        type="number"
                        value={editMeanItemData.menuItemId}
                        onChange={(e) => setEditMeanItemData({ ...editMeanItemData, menuItemId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số Lượng</label>
                    <Input
                        type="text"
                        value={editMeanItemData.quantity}
                        onChange={(e) => setEditMeanItemData({ ...editMeanItemData, quantity: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Mean;
