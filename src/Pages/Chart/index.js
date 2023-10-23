import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getChartByAll } from '../../API';
import './chart.css';
import Item from 'antd/es/list/Item';

const Chart = () => {
    const [selectedOption, setSelectedOption] = useState('day');
    const [chartData, setChartData] = useState([]);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [quarter, setQuarter] = useState('');
    const [showInputs, setShowInputs] = useState('day');
    const [searchButtonClicked, setSearchButtonClicked] = useState(false);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setYear('');
        setMonth('');
        setDay('');
        setQuarter('');
        setShowInputs(true);
    };

    const fetchData = async (selectedOption, year, month, day, quarter) => {
        try {
            let url = '';

            if (selectedOption === 'day') {
                url = `https://localhost:7274/api/bill/getchartbyday/${year}/${month}/${day}`;
            } else if (selectedOption === 'month') {
                url = `https://localhost:7274/api/bill/getchartbymonth/${year}/${month}`;
            } else if (selectedOption === 'quarter') {
                // Tính toán khoảng thời gian tương ứng cho quý
                const quarterStartDate = new Date(year, (quarter - 1) * 3);
                url = `https://localhost:7274/api/bill/getchartbyquarter/${year}`;
            } else if (selectedOption === 'year') {
                url = `https://localhost:7274/api/bill/getchartbyyear/${year}`;
            }

            const response = await fetch(url);
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                let formattedData = [];

                if (selectedOption === 'day') {
                    formattedData = data.map(item => ({
                        name: `${item.date.year}-${item.date.month}-${item.date.day}`,
                        value: item.totalDiscountAmount,
                    }));
                } else if (selectedOption === 'month') {
                    formattedData = data.map(item => ({
                        name: `${item.date.year}-${item.date.month}`,
                        value: item.totalDiscountAmount,
                    }));
                } else if (selectedOption === 'quarter') {
                    formattedData = data.map(item => ({
                        name: `Quarter ${item.date.quarter} - ${item.date.year}`,
                        value: item.totalDiscountAmount,
                    }));
                } else if (selectedOption === 'year') {
                    formattedData = data.map(item => ({
                        name: `${item.date.year}`,
                        value: item.totalDiscountAmount,
                    }));
                }

                setChartData(formattedData);

            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        }
    };




    useEffect(() => {
        if (showInputs && searchButtonClicked) {
            fetchData(selectedOption, year, month, day, quarter);
            setSearchButtonClicked(false);
        }
    }, [showInputs, year, month, day, quarter, searchButtonClicked]);

    // Hàm xử lý khi ấn nút tìm kiếm
    const handleSearch = () => {
        setSearchButtonClicked(true);
    };

    return (
        <div className='container'>
            <div className='Chart'>
                <h2 style={{ textAlign: "center" }}>Thống kê doanh số</h2>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <label style={{ fontSize: "20px" }}>Chọn Thống Kê:</label>
                        <select
                            value={selectedOption}
                            onChange={handleOptionChange}
                            style={{
                                fontSize: '16px',  // Điều chỉnh kích thước theo ý muốn
                                width: '150px',  // Điều chỉnh kích thước theo ý muốn
                                padding: '8px',   // Điều chỉnh padding để làm cho nó dễ nhìn hơn
                            }}
                        >
                            <option value="day">Theo ngày</option>
                            <option value="month">Theo tháng</option>
                            <option value="quarter">Theo quý</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>
                </div>

                {showInputs && (
                    <div>
                        <div className='style-select'>
                            {selectedOption === 'day' && (
                                <div style={{ fontSize: '20px', padding: '8px' }}>
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(Math.min(Math.max(0, e.target.value), 9999))}
                                        min="1"
                                        max="9999"
                                    />
                                    <label>Month</label>
                                    <input
                                        type="number"
                                        value={month}
                                        onChange={(e) => setMonth(Math.min(Math.max(1, e.target.value), 12))}
                                        min="1"
                                        max="12"
                                    />
                                    <label>Day</label>
                                    <input
                                        type="number"
                                        value={day}
                                        onChange={(e) => setDay(Math.min(Math.max(1, e.target.value), 31))}
                                        min="1"
                                        max="31"
                                    />
                                </div>
                            )}
                            {selectedOption === 'quarter' && (
                                <div style={{ fontSize: '20px', padding: '8px' }}>
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(Math.min(Math.max(0, e.target.value), 9999))}
                                        min="1"
                                        max="9999"
                                    />
                                </div>
                            )}
                            {selectedOption === 'month' && (
                                <div style={{ fontSize: '20px', padding: '8px' }}>
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(Math.min(Math.max(0, e.target.value), 9999))}
                                        min="1"
                                        max="9999"
                                    />
                                    <label>Month</label>
                                    <input
                                        type="number"
                                        value={month}
                                        onChange={(e) => setMonth(Math.min(Math.max(1, e.target.value), 12))}
                                        min="1"
                                        max="12"
                                    />
                                </div>
                            )}
                            {selectedOption === 'year' && (
                                <div style={{ fontSize: '20px', padding: '8px' }}>
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(Math.min(Math.max(1, e.target.value), 9999))}
                                        min="1"
                                        max="9999"
                                    />
                                </div>
                            )}
                        </div>
                        <div className='custum-btn'>
                            <button onClick={handleSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                )}

                <div className='style-chart'>
                    <BarChart width={600} height={300} x={-10} data={chartData} margin={{ left: 40 }} style={{ marginTop: "20px" }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default Chart;
