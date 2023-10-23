import { Avatar, Space, Table, Typography, Button, Modal, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { getAllUser } from "../../API";
import { FormOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { format } from 'date-fns';
import Loading from "../../Components/Loading/Loading"
import "./user.css"

const { Option } = Select;

function User() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllUser().then((res) => {
      setDataSource(res); // Sử dụng toàn bộ danh sách người dùng từ phản hồi API
      setLoading(false);
    });
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    image: "",
    file: null,
    birthDay: new Date(),
    roles: "", // Vai trò người dùng
    gender: "",
  });

  // Hàm kiểm tra mật khẩu
  const isPasswordValid = (value) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;
    return passwordRegex.test(value);
  };

  // Hàm kiểm tra username chỉ chứa chữ và số
  const isUsernameValid = (value) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(value);
  };

  // Hàm kiểm tra số điện thoại bắt đầu bằng số 0 và có từ 10 đến 11 chữ số
  const isPhoneNumberValid = (value) => {
    const phoneNumber = value.replace(/\s/g, '');
    const phoneNumberRegex = /^0\d{9,10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const handleAddUsers = () => {
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

    if (file) {
      setNewUserData({ ...newUserData, image: URL.createObjectURL(file), file: file });
    }
  };

  const birthDayUser = format(new Date(newUserData.birthDay), 'yyyy-MM-dd');

  const handleOk = () => {
    setLoading(true);
    if (!isPasswordValid(newUserData.password)) {
      setErrorMessage("Mật khẩu không đáp ứng yêu cầu: phải có ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và một chữ số, và phải có ít nhất 6 ký tự.");
      return;
    }

    if (!isUsernameValid(newUserData.username)) {
      setErrorMessage("Tên người dùng chỉ được chứa chữ và số.");
      return;
    }

    if (!isPhoneNumberValid(newUserData.phoneNumber)) {
      setErrorMessage("Số điện thoại phải bắt đầu bằng số 0 và có từ 10 đến 11 chữ số");
      return;
    }

    const formData = new FormData();
    formData.append("username", newUserData.username);
    formData.append("password", newUserData.password);
    formData.append("fullName", newUserData.fullName);
    formData.append("email", newUserData.email);
    formData.append("phoneNumber", newUserData.phoneNumber);
    formData.append("birthDay", birthDayUser);
    formData.append("gender", newUserData.gender);
    formData.append("address", newUserData.address);
    formData.append("roles", newUserData.roles); // Thêm vai trò người dùng vào form data
    formData.append("file", newUserData.file);
    console.log(formData);

    fetch('https://localhost:7274/api/authentication/registry', {
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
      })
      .catch((error) => {
        console.error('Lỗi khi thêm dữ liệu:', error);
      });
  };

  const togglePasswordVisibility = () => {
    setNewUserData({ ...newUserData, showPassword: !newUserData.showPassword });
    setEditUserData({ ...editUserData, showPassword: !editUserData.showPassword })
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    image: "",
    file: null,
    birthDay: new Date(),
    roles: "", // Vai trò người dùng
    gender: "",
  });

  const editBirthDayUser = format(new Date(editUserData.birthDay), 'yyyy-MM-dd');

  const handleEdit = (id) => {
    setSelectedUserId(id);
    const userToEdit = dataSource.find((user) => user.id === id);
    if (userToEdit) {
      setEditUserData({ ...userToEdit });
    }
    setIsEditModalVisible(true);
  };

  const handleUpdateImageChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên từ danh sách tệp đã chọn

    if (file) {
      setEditUserData({ ...editUserData, image: URL.createObjectURL(file), file: file });
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleUpdate = () => {
    if (selectedUserId) {
      // Tạo một đối tượng FormData để chứa dữ liệu cần cập nhật
      const formData = new FormData();
      formData.append("id", selectedUserId)
      formData.append("fullName", editUserData.fullName);
      formData.append("email", editUserData.email);
      formData.append("phoneNumber", editUserData.phoneNumber);
      formData.append("birthDay", editBirthDayUser);
      formData.append("gender", editUserData.gender);
      formData.append("address", editUserData.address);
      if (editUserData.file) {
        formData.append("file", editUserData.file);
      } else {
        formData.append("image", editUserData.image);
      }

      fetch(`https://localhost:7274/api/authentication/update/${selectedUserId}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            alert(`Cập nhật bản ghi có ID ${selectedUserId} thành công.`);
            return getAllUser(); // Gọi hàm getRestaurant để cập nhật danh sách sau khi cập nhật thành công
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

  const showDeleteConfirm = (id) => {
    setSelectedUserId(id);
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
    fetch(`https://localhost:7274/api/authentication/delete/${id}`, {
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
    <div className="container" id="User">
      <div className="centered-content">
        <Space size={20} direction="vertical">
          <Typography.Title style={{ fontFamily: "Times" }} level={4}>DỮ LIỆU NGƯỜI DÙNG</Typography.Title>
          <Button
            type="primary"
            onClick={() => handleAddUsers()}
            style={{ width: "150px" }}
          >
            Thêm người dùng
          </Button>
          <Table
            loading={loading}
            columns={[
              {
                title: "Ảnh đại diện",
                dataIndex: "image",
                render: (image) => <Avatar src={image} style={{ width: '60px', height: '60px' }} />,
              },
              {
                title: "Id người dùng",
                dataIndex: "id",
              },
              {
                title: "Tên người dùng",
                dataIndex: "fullName",
              },
              {
                title: "Tài khoản",
                dataIndex: "username",
              },
              {
                title: "Email",
                dataIndex: "email",
              },
              {
                title: "Số điện thoại",
                dataIndex: "phoneNumber",
              },
              {
                title: "Nơi ở",
                dataIndex: "address",
              },
              {
                title: "Ngày sinh",
                dataIndex: "birthDay",
              },
              {
                title: "Giới tính",
                dataIndex: "gender",
              },
              {
                title: "Vai trò",
                dataIndex: "roles",
              },
              {
                title: "Chức năng",
                render: (text, record) => (
                  <span>
                    <FormOutlined
                      style={{ color: 'blue', cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => handleEdit(record.id)}
                      title="Sửa"
                      data-placement="top"
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
            className="custom-table"
          ></Table>
        </Space>
      </div>

      <Modal
        title="Thêm Người Dùng Mới"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
      </Modal>

      <Modal
        title="Chỉnh sửa nhà hàng"
        open={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={handleEditCancel}
      >
        <div>
          <label>Tên Người Dùng:</label>
          <Input
            type="text"
            value={editUserData.fullName}
            onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })}
          />
        </div>
        <div>
          <label>Email:</label>
          <Input
            type="email"
            value={editUserData.email}
            onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
          />
        </div>
        <div>
          <label>Số Điện Thoại:</label>
          <Input
            type="number"
            value={editUserData.phoneNumber}
            onChange={(e) => setEditUserData({ ...editUserData, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label>Địa Chỉ:</label>
          <Input
            type="text"
            value={editUserData.address}
            onChange={(e) => setEditUserData({ ...editUserData, address: e.target.value })}
          />
        </div>
        <div>
          <label>Ngày Sinh:</label>
          <input
            type="date"
            value={editBirthDayUser}
            onChange={(e) => setEditUserData({ ...editUserData, birthDay: e.target.value })}
            className="dateTime-custum"
          />
        </div>
        <div>
          <label>Giới Tính:</label>
          <Select
            value={editUserData.gender}
            onChange={(value) => setEditUserData({ ...editUserData, gender: value })}
            style={{ width: '100%' }}
          >
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Chọn ảnh đại diện:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpdateImageChange(e)}
          />
          {editUserData.image && (
            <img src={editUserData.image} alt="Xem trước hình ảnh" style={{ maxWidth: "100px" }} />
          )}
        </div>
        <p className="text-danger">{errorMessage}</p>
      </Modal>
    </div>
  );
}

export default User;
