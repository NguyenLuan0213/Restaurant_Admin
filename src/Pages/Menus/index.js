import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getMenus } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./menus.css";

function Menu() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newMenuData, setNewMenuData] = useState({
        restaurantId: "",
        name: "",
        description: "",
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [editMenuData, setEditMenuData] = useState({
        restaurantId: "",
        name: "",
        description: "",
    });


    const handleEdit = (id) => {
        setSelectedMenuId(id);
        const menuToEdit = dataSource.find((menu) => menu.id === id);
        if (menuToEdit) {
            setEditMenuData({ ...menuToEdit });
        }
        setIsEditModalVisible(true);
    };

    useEffect(() => {
        setLoading(true);
        getMenus().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
        });
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddMenu = () => {
        showModal();
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };


    const handleOk = () => {
        const newMenu = {
            restaurantId: newMenuData.restaurantId,
            name: newMenuData.name,
            description: newMenuData.description,
        };

        fetch('https://localhost:7274/api/menus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMenu),
        })
            .then((response) => response.json())
            .then((data) => {

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

    const handleDelete = (id) => {
        fetch(`https://localhost:7274/api/menus/${id}`, {
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

    const handleUpdate = () => {
        fetch(`https://localhost:7274/api/menus/upadate/${selectedMenuId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editMenuData),

        })
            .then((response) => {
                if (response.status === 204) {
                    console.log(editMenuData)
                    alert(`Cập nhật bản ghi có ID ${selectedMenuId} thành công.`);
                    return getMenus();
                } else {
                    throw new Error('Cập nhật không thành công');
                }
            })
            .then((newDataSource) => {
                setDataSource(newDataSource);
                setIsEditModalVisible(false);
            })
            .catch((error) => {
                console.log(editMenuData)
                console.error(`Lỗi khi cập nhật bản ghi: ${error}`);
            });
    };

    const showDeleteConfirm = (id) => {
        setSelectedMenuId(id);
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
        <div className="container" id="Menu">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU THỰC ĐƠN</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddMenu()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Nhà Hàng
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id Thưc Đơn",
                                dataIndex: "id",
                            },
                            {
                                title: "Mã Nhà Hàng",
                                dataIndex: "restaurantId",
                            },
                            {
                                title: "Tên Menu",
                                dataIndex: "name",
                            },
                            {
                                title: "Miêu tả",
                                dataIndex: "description",
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
                            pageSize: 5,
                        }}
                        className="custom-menu-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm thực đơn mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Mã nhà hàng:</label>
                    <Input
                        type="number"
                        value={newMenuData.restaurantId}
                        onChange={(e) => setNewMenuData({ ...newMenuData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Tên thực đơn:</label>
                    <Input
                        type="text"
                        value={newMenuData.name}
                        onChange={(e) => setNewMenuData({ ...newMenuData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Miêu tả:</label>
                    <Input
                        type="text"
                        value={newMenuData.description}
                        onChange={(e) => setNewMenuData({ ...newMenuData, description: e.target.value })}
                    />
                </div>
            </Modal>

            <Modal
                title="Chỉnh sửa thực đơn"
                open={isEditModalVisible}
                onOk={handleUpdate}
                onCancel={handleEditCancel}
            >
                <div>
                    <label>Mã nhà hàng:</label>
                    <Input
                        type="number"
                        value={editMenuData.restaurantId}
                        onChange={(e) => setEditMenuData({ ...editMenuData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Tên thực đơn:</label>
                    <Input
                        type="text"
                        value={editMenuData.name}
                        onChange={(e) => setEditMenuData({ ...editMenuData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Miêu tả:</label>
                    <Input
                        type="text"
                        value={editMenuData.description}
                        onChange={(e) => setEditMenuData({ ...editMenuData, description: e.target.value })}
                    />
                </div>
            </Modal>

        </div>
    );
}

export default Menu;
