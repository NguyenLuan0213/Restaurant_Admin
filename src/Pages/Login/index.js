import React, { useState } from 'react';
import cookie from 'react-cookies';
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

import './login.css'; // Import file CSS

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const handleLogin = async () => {
        try {
            // Gửi yêu cầu đăng nhập
            const response = await fetch('https://localhost:7274/api/authentication/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                const data = await response.json();

                // Lưu token vào cookies
                cookie.save('token', data.token);

                // Gửi yêu cầu để lấy thông tin người dùng dựa trên token
                const userResponse = await fetch(`https://localhost:7274/api/authentication/user?username=${username}`, {
                    headers: {
                        Authorization: `Bearer ${data.token}`,
                    },
                });

                if (userResponse.status === 200) {
                    const userData = await userResponse.json();

                    // Lưu thông tin người dùng vào cookies
                    cookie.save('userAdmin', userData);

                    // Kiểm tra vai trò "ADMIN" trước khi đăng nhập
                    if (userData.roles.includes("ADMIN")) {
                        setIsLoggedIn(true); // Đăng nhập thành công
                        cookie.save("isLoggedIn", "true");
                    } else {
                        alert("Không có quyền đăng nhập vào ADMIN.");
                    }
                } else {
                    throw new Error('Lỗi khi lấy thông tin người dùng');
                }
            } else {
                throw new Error('Lỗi khi đăng nhập');
            }
        } catch (ex) {
            console.error(ex);
            alert('Thông tin đăng nhập không hợp lệ');
            setLoginError(true); // Đánh dấu đăng nhập thất bại
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Khi phím "Enter" được nhấn, gọi hàm handleLogin
            handleLogin();
        }
    };
    return (
        <div className='container' style={{ marginTop: '100px' }}>
            <div className='back-group'>
                <div className="login-container">
                    <h2>Đăng nhập</h2>
                    <div className="input-container">
                        <UserOutlined className="input-icon" style={{ marginRight: "10px" }} />
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div className="input-container">
                        <KeyOutlined className="input-icon" style={{ marginRight: "10px" }} />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <button className="login-button" onClick={handleLogin}>Đăng nhập</button>
                    {loginError && (
                        <p className="text-danger" style={{ color: 'red' }}>
                            Đăng nhập thất bại, sai tài khoản hoặc mật khẩu
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
