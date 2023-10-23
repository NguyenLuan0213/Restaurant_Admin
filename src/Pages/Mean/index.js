import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getMean } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./mean.css";

function Mean() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getMean().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
        });
    }, []);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedMeanId, setSelectedMeanId] = useState(null);
    const [editMeanData, setEditMeanData] = useState({
        description: "",
        totalPrice: "",
    });

    const handleEdit = (id) => {
        setSelectedMeanId(id);
        const meanToEdit = dataSource.find((mean) => mean.id === id);
        if (meanToEdit) {
            setEditMeanData({ ...meanToEdit });
        }
        setIsEditModalVisible(true);
    };


    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleUpdate = () => {
        fetch(`https://localhost:7274/api/mean/update/${selectedMeanId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editMeanData),
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Cập nhật bản ghi có ID ${selectedMeanId} thành công.`);
                    return getMean();
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
        setSelectedMeanId(id);
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
        fetch(`https://localhost:7274/api/mean/delete/${id}`, {
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
        <div className="container" id="Mean">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU NẤU ĂN</Typography.Title>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id Nấu Ăn",
                                dataIndex: "id",
                            },
                            {
                                title: "Miêu Tả",
                                dataIndex: "description",
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
                        className="custom-mean-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Chỉnh sửa nấu ăn"
                open={isEditModalVisible}
                onOk={handleUpdate}
                onCancel={handleEditCancel}
            >
                <div>
                    <label>Miêu Tả:</label>
                    <Input
                        type="text"
                        value={editMeanData.description}
                        onChange={(e) => setEditMeanData({ ...editMeanData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Số Tiền:</label>
                    <Input
                        type="number"
                        value={editMeanData.totalPrice}
                        onChange={(e) => setEditMeanData({ ...editMeanData, totalPrice: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Mean;
