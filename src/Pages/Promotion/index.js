import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getPromotion } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from 'date-fns';
import "./promotion.css";

function Orders() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getPromotion().then((res) => {
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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newPromotionData, setNewPromotionData] = useState({
        restaurantId: "",
        promotionName: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        discount: "",
    });

    const formattedStartDay = format(new Date(newPromotionData.startDate), 'yyyy-MM-dd HH:mm:ss');
    const formattedEndDay = format(new Date(newPromotionData.endDate), 'yyyy-MM-dd HH:mm:ss');

    const handleAddBill = () => {
        showModal();
    };

    const handleOk = () => {
        const newPromotion = {
            restaurantId: newPromotionData.restaurantId,
            promotionName: newPromotionData.promotionName,
            description: newPromotionData.description,
            startDate: formattedStartDay,
            endDate: formattedEndDay,
            discount: newPromotionData.discount,
        };
        console.log(newPromotion);
        fetch('https://localhost:7274/api/promotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPromotion),
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
    const [selectedPromotionId, setSelectedPromotionId] = useState(null);
    const [editPromotionData, setEditPromotionData] = useState({
        restaurantId: "",
        promotionName: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        discount: "",
    });

    const editStartDay = format(new Date(editPromotionData.startDate), 'yyyy-MM-dd HH:mm:ss');
    const editEndDay = format(new Date(editPromotionData.endDate), 'yyyy-MM-dd HH:mm:ss');

    const handleEdit = (id) => {
        setSelectedPromotionId(id);
        const promotionToEdit = dataSource.find((promotion) => promotion.id === id);
        if (promotionToEdit) {
            setEditPromotionData({ ...promotionToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleUpdate = () => {
        let editPromotion = {
            id: selectedPromotionId,
            restaurantId: editPromotionData.restaurantId,
            promotionName: editPromotionData.promotionName,
            description: editPromotionData.description,
            startDate: editStartDay,
            endDate: editEndDay,
            discount: editPromotionData.discount,
        };
        console.log(editPromotion);
        fetch(`https://localhost:7274/api/promotion/update/${selectedPromotionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editPromotion),
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Cập nhật bản ghi có ID ${selectedPromotionId} thành công.`);
                    return getPromotion();
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
        setSelectedPromotionId(id);
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
        fetch(`https://localhost:7274/api/promotion/${id}`, {
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
        <div className="container" id="Promotion">
            <div className="centered-content">
                <Space size={20} direction="vertical">
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU KHUYẾN MÃI</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddBill()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Khuyến Mãi
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id Khuyến Mãi",
                                dataIndex: "id",
                            },
                            {
                                title: "Id Nhà Hàng",
                                dataIndex: "restaurantId",
                            },
                            {
                                title: "Tên Khuyến Mãi",
                                dataIndex: "promotionName",
                            },
                            {
                                title: "Miêu Tả",
                                dataIndex: "description",
                            },
                            {
                                title: "Ngày Bắt Đầu",
                                dataIndex: "startDate",
                            },
                            {
                                title: "Ngày Kết Thúc",
                                dataIndex: "endDate",
                            },
                            {
                                title: "Phần Trăm Giảm Giá",
                                dataIndex: "discount",
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
                        className="custom-promotion-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm khuyến mãi mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Mã Nhà Hàng:</label>
                    <Input
                        type="number"
                        value={newPromotionData.restaurantId}
                        onChange={(e) => setNewPromotionData({ ...newPromotionData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Tên Khuyến Mãi:</label>
                    <Input
                        type="text"
                        value={newPromotionData.promotionName}
                        onChange={(e) => setNewPromotionData({ ...newPromotionData, promotionName: e.target.value })}
                    />
                </div>
                <div>
                    <label>Miêu Tả:</label>
                    <Input
                        type="text"
                        value={newPromotionData.description}
                        onChange={(e) => setNewPromotionData({ ...newPromotionData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Ngày Bắt Đầu:</label>
                    <input
                        type="datetime-local"
                        value={newPromotionData.startDate}
                        onChange={(e) => setNewPromotionData({ ...newPromotionData, startDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
                <div>
                    <label>Ngày Kết Thúc:</label>
                    <input
                        type="datetime-local"
                        value={newPromotionData.endDate}
                        onChange={(e) => setNewPromotionData({ ...newPromotionData, endDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
                <div>
                    <label>Phần Trăm Giảm Giá:</label>
                    <Input
                        type="number"
                        value={newPromotionData.discount}
                        onChange={(e) => setNewPromotionData({ ...newPromotionData, discount: e.target.value })}
                    />
                </div>
            </Modal>

            <Modal
                title="Chỉnh Khuyến Mãi"
                open={isEditModalVisible}
                onOk={handleUpdate}
                onCancel={handleEditCancel}
            >
                <div>
                    <label>Mã Nhà Hàng:</label>
                    <Input
                        type="number"
                        value={editPromotionData.restaurantId}
                        onChange={(e) => setEditPromotionData({ ...editPromotionData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Tên Khuyến Mãi:</label>
                    <Input
                        type="text"
                        value={editPromotionData.promotionName}
                        onChange={(e) => setEditPromotionData({ ...editPromotionData, promotionName: e.target.value })}
                    />
                </div>
                <div>
                    <label>Miêu Tả:</label>
                    <Input
                        type="text"
                        value={editPromotionData.description}
                        onChange={(e) => setEditPromotionData({ ...editPromotionData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Ngày Bắt Đầu:</label>
                    <input
                        type="datetime-local"
                        value={editPromotionData.startDate}
                        onChange={(e) => setEditPromotionData({ ...editPromotionData, startDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
                <div>
                    <label>Ngày Kết Thúc:</label>
                    <input
                        type="datetime-local"
                        value={editPromotionData.endDate}
                        onChange={(e) => setEditPromotionData({ ...editPromotionData, endDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
                <div>
                    <label>Phần Trăm Giảm Giá:</label>
                    <Input
                        type="number"
                        value={editPromotionData.discount}
                        onChange={(e) => setEditPromotionData({ ...editPromotionData, discount: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Orders;
