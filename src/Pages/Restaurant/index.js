import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getRestaurant } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./restaurant.css";

function Restaurant() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRestaurantData, setRestaurantData] = useState({
        name: "",
        address: "",
        image: "",
        description: "",
        file: null,
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [editRestaurantData, setEditRestaurantData] = useState({
        name: "",
        address: "",
        image: "",
        description: "",
        file: null,
    });

    useEffect(() => {
        setLoading(true);
        getRestaurant().then((res) => {
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

    const handleAddRestaurant = () => {
        // Viết mã xử lý sự kiện thêm bàn tại đây
        showModal();
    };

    const handleEdit = (id) => {
        setSelectedRestaurantId(id);
        const restaurantToEdit = dataSource.find((restaurant) => restaurant.id === id);
        if (restaurantToEdit) {
            setEditRestaurantData({ ...restaurantToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleOk = () => {
        const formData = new FormData();
        formData.append("name", newRestaurantData.name);
        formData.append("address", newRestaurantData.address);
        formData.append("description", newRestaurantData.description);
        formData.append("file", newRestaurantData.file);

        fetch('https://localhost:7274/api/restaurantsbr', {
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

    const handleUpdate = () => {
        if (selectedRestaurantId) {
            // Tạo một đối tượng FormData để chứa dữ liệu cần cập nhật
            const formData = new FormData();
            formData.append("id", selectedRestaurantId);
            formData.append("name", editRestaurantData.name);
            formData.append("address", editRestaurantData.address);
            formData.append("description", editRestaurantData.description);
            if (editRestaurantData.file === null) {
                formData.append("image", editRestaurantData.image);
            }
            else {
                formData.append("file", editRestaurantData.file);
            }
            fetch(`https://localhost:7274/api/restaurantsbr/update/${selectedRestaurantId}`, {
                method: "PUT",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        alert(`Cập nhật bản ghi có ID ${selectedRestaurantId} thành công.`);
                        return getRestaurant(); // Gọi hàm getRestaurant để cập nhật danh sách sau khi cập nhật thành công
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

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

        if (file) {
            setRestaurantData({ ...newRestaurantData, image: URL.createObjectURL(file), file: file });
        }
    };

    const handleUpdateImageChange = (e) => {
        const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

        if (file) {
            setEditRestaurantData({ ...editRestaurantData, image: URL.createObjectURL(file), file: file });
        }
    };

    const handleDelete = (id) => {
        fetch(`https://localhost:7274/api/restaurantsbr/${id}`, {
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
        setSelectedRestaurantId(id);
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
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU CHI NHÁNH NHÀ HÀNG</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddRestaurant()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Nhà Hàng
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Ảnh đại diện",
                                dataIndex: "image",
                                render: (image) => <Image src={image} style={{ width: '100px', height: '100px' }} />,
                            },
                            {
                                title: "Id nhà hàng",
                                dataIndex: "id",
                            },
                            {
                                title: "Tên nhà hàng",
                                dataIndex: "name",
                            },
                            {
                                title: "Nơi ở",
                                dataIndex: "address",
                            },
                            {
                                title: "Thông tin nhà hàng",
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
                        className="custom-restaurant"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm Nhà Hàng Mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Tên nhà hàng:</label>
                    <Input
                        type="text"
                        value={newRestaurantData.name}
                        onChange={(e) => setRestaurantData({ ...newRestaurantData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Địa chỉ nhà hàng:</label>
                    <Input
                        type="text"
                        value={newRestaurantData.address}
                        onChange={(e) => setRestaurantData({ ...newRestaurantData, address: e.target.value })}
                    />
                </div>
                <div>
                    <label>Thông tin nhà hàng:</label>
                    <Input
                        type="text"
                        value={newRestaurantData.description}
                        onChange={(e) => setRestaurantData({ ...newRestaurantData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Chọn ảnh đại diện nhà hàng:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                    />
                    {/* Hiển thị xem trước hình ảnh đã chọn */}
                    {newRestaurantData.image && (
                        <img src={newRestaurantData.image} alt="Xem trước hình ảnh" style={{ maxWidth: "100px" }} />
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
                    <label>Tên nhà hàng:</label>
                    <Input
                        type="text"
                        value={editRestaurantData.name}
                        onChange={(e) => setEditRestaurantData({ ...editRestaurantData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Địa chỉ nhà hàng:</label>
                    <Input
                        type="text"
                        value={editRestaurantData.address}
                        onChange={(e) => setEditRestaurantData({ ...editRestaurantData, address: e.target.value })}
                    />
                </div>
                <div>
                    <label>Thông tin nhà hàng:</label>
                    <Input
                        type="text"
                        value={editRestaurantData.description}
                        onChange={(e) => setEditRestaurantData({ ...editRestaurantData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Chọn ảnh đại diện nhà hàng:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpdateImageChange(e)}
                    />
                    {/* Hiển thị xem trước hình ảnh đã chọn */}
                    {editRestaurantData.image && (
                        <img src={editRestaurantData.image} alt="Xem trước hình ảnh" style={{ maxWidth: "100px" }} />
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default Restaurant;
