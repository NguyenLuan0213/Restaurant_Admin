import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getMenuItem } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./menuitem.css";

function Restaurant() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newMenuItemData, setMenuItemData] = useState({
        menuId: "",
        name: "",
        image: "",
        description: "",
        price: 0,
        file: null,
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
    const [editMenuItemData, setEditMenuItemData] = useState({
        menuId: "",
        name: "",
        image: "",
        description: "",
        price: 0,
        file: null,
    });

    const handleEdit = (id) => {
        setSelectedMenuItemId(id);
        const menuItemToEdit = dataSource.find((menuItem) => menuItem.id === id);
        if (menuItemToEdit) {
            setEditMenuItemData({ ...menuItemToEdit });
        }
        setIsEditModalVisible(true);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        setLoading(true);
        getMenuItem().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
        });
    }, []);

    const handleAddMenuItem = () => {
        showModal();
    };

    const handleOk = () => {
        const formData = new FormData();
        formData.append("name", newMenuItemData.name);
        formData.append("menuId", newMenuItemData.menuId);
        formData.append("description", newMenuItemData.description);
        formData.append("price", newMenuItemData.price);
        formData.append("file", newMenuItemData.file);

        console.log(newMenuItemData);
        fetch('https://localhost:7274/api/menuitem/add', {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    // Thành công
                    alert('Thêm dữ liệu thành công');
                    setIsModalVisible(false);
                    return response.json();
                } else {
                    // Lỗi
                    alert('Thêm dữ liệu thất bại');
                    throw new Error('Error: ' + response.status);
                }
            })
            .then((data) => {
                setDataSource([...dataSource, data]);
            })
            .catch((error) => {
                console.error('Lỗi khi thêm dữ liệu:', error);
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

        if (file) {
            setMenuItemData({ ...newMenuItemData, image: URL.createObjectURL(file), file: file });
        }
    };

    const handleUpdate = () => {
        if (selectedMenuItemId) {
            // Tạo một đối tượng FormData để chứa dữ liệu cần cập nhật
            const formData = new FormData();
            formData.append("id", selectedMenuItemId);
            formData.append("name", editMenuItemData.name);
            formData.append("menuId", editMenuItemData.menuId);
            formData.append("price", editMenuItemData.price);
            formData.append("description", editMenuItemData.description);
            if (editMenuItemData.file === null) {
                formData.append("image", editMenuItemData.image);
            }
            else {
                formData.append("file", editMenuItemData.file);
            }
            console.log(formData.open);
            fetch(`https://localhost:7274/api/menuitem/update/${selectedMenuItemId}`, {
                method: "PUT",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        alert(`Cập nhật bản ghi có ID ${selectedMenuItemId} thành công.`);
                        return getMenuItem(); // Gọi hàm getRestaurant để cập nhật danh sách sau khi cập nhật thành công
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
                    // Hiển thị thông báo lỗi trên giao diện người dùng
                    alert('Có lỗi xảy ra khi cập nhật bản ghi.');
                });
        } else {
            console.error('Vui lòng chọn một nhà hàng để cập nhật.');
        }
    };

    const handleUpdateImageChange = (e) => {
        const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

        if (file) {
            setEditMenuItemData({ ...editMenuItemData, image: URL.createObjectURL(file), file: file });
        }
    };
    const handleDelete = (id) => {
        fetch(`https://localhost:7274/api/menuitem/delete/${id}`, {
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

    const showDeleteConfirm = (id) => {
        setSelectedMenuItemId(id);
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
        <div className="container" id="User">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU CHI MÓN ĂN</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddMenuItem()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Nhà Hàng
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Ảnh Món Ăn",
                                dataIndex: "image",
                                render: (image) => <Image src={image} style={{ width: '100px', height: '100px' }} />,
                            },
                            {
                                title: "Id Món Ăn",
                                dataIndex: "id",
                            },
                            {
                                title: "Id Menu",
                                dataIndex: "menuId",
                            },
                            {
                                title: "Tên Món Ăn",
                                dataIndex: "name",
                            },
                            {
                                title: "Miêu Tả",
                                dataIndex: "description",
                            },
                            {
                                title: "Số Tiền",
                                dataIndex: "price",
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
                        className="custom-menuitem-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm Món Ăn Mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Tên Món Ăn:</label>
                    <Input
                        type="text"
                        value={newMenuItemData.name}
                        onChange={(e) => setMenuItemData({ ...newMenuItemData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Thực Đơn:</label>
                    <Input
                        type="number"
                        value={newMenuItemData.menuId}
                        onChange={(e) => setMenuItemData({ ...newMenuItemData, menuId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Miêu Tả:</label>
                    <Input
                        type="text"
                        value={newMenuItemData.description}
                        onChange={(e) => setMenuItemData({ ...newMenuItemData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số Tiền:</label>
                    <Input
                        type="number"
                        value={newMenuItemData.price}
                        onChange={(e) => setMenuItemData({ ...newMenuItemData, price: e.target.value })}
                    />
                </div>
                <div>
                    <label>Chọn ảnh món ăn:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                    />
                    {/* Hiển thị xem trước hình ảnh đã chọn */}
                    {newMenuItemData.image && (
                        <img src={newMenuItemData.image} alt="Xem trước hình ảnh" style={{ maxWidth: "100px" }} />
                    )}
                </div>
            </Modal>

            <Modal
                title="Chỉnh sửa nhà hàng"
                open={isEditModalVisible}
                onOk={handleUpdate}
                onCancel={handleEditCancel}
            >
                <div>
                    <label>Tên Món Ăn:</label>
                    <Input
                        type="text"
                        value={editMenuItemData.name}
                        onChange={(e) => setEditMenuItemData({ ...editMenuItemData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Thực Đơn:</label>
                    <Input
                        type="number"
                        value={editMenuItemData.menuId}
                        onChange={(e) => setEditMenuItemData({ ...editMenuItemData, menuId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Miêu Tả:</label>
                    <Input
                        type="text"
                        value={editMenuItemData.description}
                        onChange={(e) => setEditMenuItemData({ ...editMenuItemData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số Tiền:</label>
                    <Input
                        type="number"
                        value={editMenuItemData.price}
                        onChange={(e) => setEditMenuItemData({ ...editMenuItemData, price: e.target.value })}
                    />
                </div>
                <div>
                    <label>Chọn ảnh Món Ăn:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpdateImageChange(e)}
                    />
                    {/* Hiển thị xem trước hình ảnh đã chọn */}
                    {editMenuItemData.image && (
                        <img src={editMenuItemData.image} alt="Xem trước hình ảnh" style={{ maxWidth: "100px" }} />
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default Restaurant;
