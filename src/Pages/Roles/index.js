import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import './roles.css'
import { getRoles } from "../../API";

function Roles() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getRoles().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
            console.log(res);
        });
    }, []);

    const handleAddRoles = () => {
        showModal();
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRolesData, setNewRolesData] = useState({
        name: "",
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [editRoleData, setEditRoleData] = useState({
        name: "",
    });

    const handleEdit = (id) => {
        setSelectedRoleId(id);
        const roleToEdit = dataSource.find((role) => role.id === id);
        if (roleToEdit) {
            setEditRoleData({ ...roleToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleUpdate = () => {
        let editRole = {
            name: editRoleData.name,
        };
        fetch(`https://localhost:7274/api/authentication/updaterole/${selectedRoleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editRole),
        })
            .then((response) => {
                if (response.status === 200) {
                    alert(`Cập nhật bản ghi có ID ${selectedRoleId} thành công.`);
                    return getRoles();
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

    const handleOk = () => {
        const newRole = {
            name: newRolesData.name,
        };

        fetch('https://localhost:7274/api/authentication/roles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRole),
        })
            .then((response) => response.json())
            .then((data) => {

                setDataSource([...dataSource, data]);
                setIsModalVisible(false);
                // Thông báo thành công
                alert('Thêm dữ liệu thành công');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi thêm dữ liệu:', error);

                // Thông báo thất bại
                alert('Thêm dữ liệu thất bại');
            });
    };

    const showDeleteConfirm = (id) => {
        setSelectedRoleId(id);
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

    const handleDelete = (id) => {
        fetch(`https://localhost:7274/api/authentication/deleterole/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
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
        <div className="container" id="Roles">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU VAI TRÒ NGƯỜI DÙNG</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddRoles()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Vai Trò
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id ",
                                dataIndex: "id",
                            },
                            {
                                title: "Tên vai trò",
                                dataIndex: "name",
                            },
                            {
                                title: "Tên chuẩn hóa",
                                dataIndex: "normalizedName",
                            },
                            {
                                title: "Mã chuẩn hóa",
                                dataIndex: "concurrencyStamp",
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
                        className="custom-role-table"
                    ></Table>
                </Space>
            </div>
            <Modal
                title="Thêm Vai Trò Mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Tên Roles:</label>
                    <Input
                        type="Text"
                        value={newRolesData.name}
                        onChange={(e) => setNewRolesData({ ...newRolesData, name: e.target.value })}
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
                    <label>Tên Roles:</label>
                    <Input
                        type="Text"
                        value={editRoleData.name}
                        onChange={(e) => setEditRoleData({ ...editRoleData, name: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Roles;
