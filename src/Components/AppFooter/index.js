import { Typography } from "antd";

function AppFooter() {
  return (
    <div className="AppFooter" style={{ backgroundColor: 'rgb(8 88 164)', padding: '16px', textAlign: 'center', color: 'white' }}>
      <Typography.Text strong style={{ color: 'white' }}>Liên hệ:</Typography.Text>
      <Typography.Link href="tel:+123456789" style={{ color: 'white', marginLeft: '8px' }}>0868 196 036</Typography.Link>
      <Typography.Link href="mailto:your-email@example.com" style={{ color: 'white', marginLeft: '8px' }}>2051052077luan@ou.edu.vn</Typography.Link>
      <Typography.Text style={{ color: 'white' }}>Địa chỉ: 371 Đường Nguyễn Kiệm, Quận Gò Vấp, TP Hồ Chí Minh</Typography.Text>
    </div>
  );
}
export default AppFooter;
