import React from "react";
import { useState, useEffect } from "react";
import { Image } from "antd";
import cookie from "react-cookies";
import Loading from "../../Components/Loading/Loading";
import "./userInfo.css";

const UserInfo = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = cookie.load("userAdmin");
        if (userData) {
            setUser(userData); // set user
            setLoading(true); // set loading
        }
    }, []);


    return (
        loading ? (
            <div className="user-profile">
                <div className="user-image">
                    <img src={user.image} alt={user.fullName} />
                </div>
                <div className="user-info">
                    <h1>{user.fullName}</h1>
                    <div className="user-details">
                        <div className="user-detail">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="user-detail">
                            <span className="detail-label">Số điện thoại:</span>
                            <span className="detail-value">{user.phoneNumber}</span>
                        </div>
                        <div className="user-detail">
                            <span className="detail-label">Địa chỉ:</span>
                            <span className="detail-value">{user.address}</span>
                        </div>
                        <div className="user-detail">
                            <span className="detail-label">Chức vụ:</span>
                            <span className="detail-value">{user.roles.join(', ')}</span>
                        </div>
                        <div className="user-detail">
                            <span className="detail-label">Giới tính:</span>
                            <span className="detail-value">{user.gender}</span>
                        </div>
                        <div className="user-detail">
                            <span className="detail-label">Ngày sinh:</span>
                            <span className="detail-value">{user.birthDay}</span>
                        </div>
                    </div>
                </div>
            </div>

        ) : (
            <Loading />
        )
    );
}

export default UserInfo;