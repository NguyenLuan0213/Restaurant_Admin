import { Avatar, Rate, Space, Table, Typography, Button, Modal, Input, Image } from "antd";
import { useEffect, useState } from "react";
import { getComments } from "../../API";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import "./comment.css";
import { format } from "date-fns";

function Orders() {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getComments().then((res) => {
            setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
            setLoading(false);
        });
    }, []);

    const handleAddComments = () => {
        showModal();
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newCommentData, setNewCommentData] = useState({
        customerId: null,
        restaurantId: "",
        commentDate: new Date(),
        rating: 1,
        reviewText: "",
    });

    const formattedCommentTime = format(new Date(newCommentData.commentDate), 'yyyy-MM-dd');

    const handleOk = () => {
        const newComment = {
            customerId: newCommentData.customerId,
            restaurantId: newCommentData.restaurantId,
            commentDate: formattedCommentTime,
            rating: newCommentData.rating,
            reviewText: newCommentData.reviewText,
        };
        console.log(newComment);
        fetch('https://localhost:7274/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
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
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [editCommentData, setEditCommentData] = useState({
        customerId: null,
        restaurantId: "",
        commentDate: new Date(),
        rating: 1,
        reviewText: "",
    });


    const commentDate = format(new Date(editCommentData.commentDate), 'yyyy-MM-dd');

    const handleEdit = (id) => {
        setSelectedCommentId(id);
        const commentToEdit = dataSource.find((comment) => comment.id === id);
        if (commentToEdit) {
            setEditCommentData({ ...commentToEdit });
        }
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleUpdate = () => {
        let editComment = {
            id: selectedCommentId,
            customerId: editCommentData.customerId,
            restaurantId: editCommentData.restaurantId,
            commentDate: commentDate,
            rating: editCommentData.rating,
            reviewText: editCommentData.reviewText,
        };
        fetch(`https://localhost:7274/api/comments/update/${selectedCommentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editComment),
        })
            .then((response) => {
                if (response.status === 204) {
                    alert(`Cập nhật bản ghi có ID ${selectedCommentId} thành công.`);
                    return getComments();
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
        setSelectedCommentId(id);
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
        fetch(`https://localhost:7274/api/comments/delete/${id}`, {
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
                    <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU BÌNH LUẬN</Typography.Title>
                    <Button
                        type="primary"
                        onClick={() => handleAddComments()} // Thêm hàm xử lý khi người dùng nhấn nút "Thêm bàn"
                        style={{ width: "auto" }} // Điều chỉnh độ rộng của nút
                    >
                        Thêm Bình Luận
                    </Button>
                    <Table
                        loading={loading}
                        columns={[
                            {
                                title: "Id Bình Luận",
                                dataIndex: "id",
                            },
                            {
                                title: "MÃ Khách Hàng",
                                dataIndex: "customerId",
                            },
                            {
                                title: "Mã Nhà Hàng",
                                dataIndex: "restaurantId",
                            },
                            {
                                title: "Đánh Giá",
                                dataIndex: "rating",
                            },
                            {
                                title: "Ngày Bình Luận",
                                dataIndex: "commentDate",
                            },
                            {
                                title: "Bình Luận",
                                dataIndex: "reviewText",
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
                        className="custom-comments-table"
                    ></Table>
                </Space>
            </div>

            <Modal
                title="Thêm comment mới"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    <label>Mã Khách Hàng:</label>
                    <Input
                        type="text"
                        value={newCommentData.customerId}
                        onChange={(e) => setNewCommentData({ ...newCommentData, customerId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Nhà Hàng:</label>
                    <Input
                        type="number"
                        value={newCommentData.restaurantId}
                        onChange={(e) => setNewCommentData({ ...newCommentData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Ngày Bình Luận:</label>
                    <input
                        type="date"
                        value={newCommentData.commentDate}
                        onChange={(e) => setNewCommentData({ ...newCommentData, commentDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
                <div>
                    <label>Đánh Giá (từ 1 đến 5):</label>
                    <Input
                        type="number"
                        value={newCommentData.rating}
                        onChange={(e) => {
                            // Giới hạn giá trị đánh giá từ 1 đến 5
                            const rating = parseInt(e.target.value, 10);
                            if (!isNaN(rating) && rating >= 1 && rating <= 5) {
                                setNewCommentData({ ...newCommentData, rating });
                            }
                        }}
                    />
                </div>
                <div>
                    <label>Bình Luận:</label>
                    <textarea
                        rows={4} // Số dòng xuất hiện ban đầu, bạn có thể thay đổi số lượng dòng tùy ý
                        value={newCommentData.reviewText}
                        onChange={(e) => setNewCommentData({ ...newCommentData, reviewText: e.target.value })}
                        className="textarea-custom"
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
                    <label>Mã Khách Hàng:</label>
                    <Input
                        type="text"
                        value={editCommentData.customerId}
                        onChange={(e) => setEditCommentData({ ...editCommentData, customerId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Mã Nhà Hàng:</label>
                    <Input
                        type="number"
                        value={editCommentData.restaurantId}
                        onChange={(e) => setEditCommentData({ ...editCommentData, restaurantId: e.target.value })}
                    />
                </div>
                <div>
                    <label>Ngày Bình Luận:</label>
                    <input
                        type="date"
                        value={editCommentData.commentDate}
                        onChange={(e) => setEditCommentData({ ...editCommentData, commentDate: e.target.value })}
                        className="dateTime-custum"
                    />
                </div>
                <div>
                    <label>Đánh Giá (từ 1 đến 5):</label>
                    <Input
                        type="number"
                        value={editCommentData.rating}
                        onChange={(e) => {
                            // Giới hạn giá trị đánh giá từ 1 đến 5
                            const rating = parseInt(e.target.value, 10);
                            if (!isNaN(rating) && rating >= 1 && rating <= 5) {
                                setEditCommentData({ ...editCommentData, rating });
                            }
                        }}
                    />
                </div>
                <div>
                    <label>Bình Luận:</label>
                    <textarea
                        rows={4} // Số dòng xuất hiện ban đầu, bạn có thể thay đổi số lượng dòng tùy ý
                        value={editCommentData.reviewText}
                        onChange={(e) => setEditCommentData({ ...editCommentData, reviewText: e.target.value })}
                        className="textarea-custom"
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Orders;
