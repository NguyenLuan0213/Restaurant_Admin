import { BrowserRouter, Route, Routes } from "react-router-dom";
import User from "../../Pages/User";
import Dashboard from "../../Pages/Dashboard";
import Orders from "../../Pages/Orders";
import Tables from "../../Pages/Tables";
import Restaurant from "../../Pages/Restaurant";
import Menu from "../../Pages/Menus";
import Roles from "../../Pages/Roles";
import MenuItem from "../../Pages/MenuItem";
import Mean from "../../Pages/Mean";
import MeanItem from "../../Pages/MeanItem";
import Bill from "../../Pages/Bill";
import Comment from "../../Pages/Comment";
import Promotion from "../../Pages/Promotion";
import Chart from "../../Pages/Chart";
import UserInfo from "../../Pages/UserInfo";

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/orders" element={<Orders />}></Route>
      <Route path="/user" element={<User />}></Route>
      <Route path="/tables" element={<Tables />}></Route>
      <Route path="/restaurant" element={<Restaurant />}></Route>
      <Route path="/menus" element={<Menu />}></Route>
      <Route path="/roles" element={<Roles />}></Route>
      <Route path="/menuitem" element={<MenuItem />}></Route>
      <Route path="/mean" element={<Mean />}></Route>
      <Route path="meanitem" element={<MeanItem />}></Route>
      <Route path="/bill" element={<Bill />}></Route>
      <Route path="/comments" element={<Comment />}></Route>
      <Route path="/promotion" element={<Promotion />}></Route>
      <Route path="/chart" element={<Chart />}></Route>
      <Route path="/userInfo" element={<UserInfo />}></Route>
    </Routes>
  );
}
export default AppRoutes;
