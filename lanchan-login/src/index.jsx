import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Firstpage from './manager/firstpage.jsx'
import Expage from './dashborad/Dashboard.js'
import Basket from './store/menupage.jsx'
import FoodDetail from './store/fooddetail.jsx'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import FirstPageEm from './uc;employee/firstpageEm.js'
import Ownerpage from './owner/ownerpage.js'
import Addmenu from './store/addfood.jsx'
import Employee from './employee/employee.jsx'
import Employeedetail from './employee/employeedetail.jsx'
import Addex from './store/addex.jsx'
import Addnoodlemeu from './store/addnoodlemenu.jsx'
import Noodlemenudetail from './store/noodledetail.jsx'
import Addem from './employee/addem.jsx'
import Checkbin from './checkbin/checkbin.jsx'
import Noodletype from './store/noodletype.jsx'
import Souptype from './store/souptype.jsx'
import Orderpage from './order/order.jsx'
import Size from './store/sizetype.jsx'
import MeatType from './store/meattype.jsx'
import Orderdetail from './order/orderdetail.jsx'
import History from './order/orderhistory.jsx'
import SERVE from './order/orderserve.jsx'
import SERVEDETAIL from './order/servedetail.jsx'
import HISTORYDETAIL from './order/historydetail.jsx'
import TABLE from './table/table.jsx'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      {/* ProtectedRoutes */}
      <Route path="/firstpage" element={
        <ProtectedRoute allowedRoles={['moderator']}>
          <Firstpage />
        </ProtectedRoute>
      } />
      <Route path="/firstpageem" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <FirstPageEm />
        </ProtectedRoute>
      } />
      <Route path="/ownerpage" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Ownerpage />
        </ProtectedRoute>
      } />
      <Route path="/dashborad/Dashboard" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Expage />
        </ProtectedRoute>
      } />
      <Route path="/menupage" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Basket />
        </ProtectedRoute>
      } />
      <Route path="/fooddetail/:id" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <FoodDetail />
        </ProtectedRoute>
      } />
      <Route path="/addmenu" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Addmenu />
        </ProtectedRoute>
      } />
      <Route path="/employee" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Employee />
        </ProtectedRoute>
      } />
      <Route path="/employeedetail/:id" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Employeedetail />
        </ProtectedRoute>
      } />
      <Route path="/addex" element={
        <ProtectedRoute allowedRoles={['owner', 'manager']}>
          <Addex />
        </ProtectedRoute>
      } />
      <Route path="/Addnoodle" element={
        <ProtectedRoute allowedRoles={['owner', 'manager']}>
          <Addnoodlemeu />
        </ProtectedRoute>
      } />
      <Route path="/noodledetail/:id" element={
        <ProtectedRoute allowedRoles={['owner', 'manager']}>
          <Noodlemenudetail />
        </ProtectedRoute>
      } />
      <Route path="/addem" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Addem />
        </ProtectedRoute>
      } />
      <Route path="/checkbin" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Checkbin />
        </ProtectedRoute>
      } />

      <Route path="/noodle" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Noodletype />
        </ProtectedRoute>
      } />
      <Route path="/soup" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Souptype />
        </ProtectedRoute>
      } />
      <Route path="/size" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Size />
        </ProtectedRoute>
      } />
      <Route path="/meat" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <MeatType />
        </ProtectedRoute>
      } />
      <Route path="/order" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Orderpage />
        </ProtectedRoute>
      } />

      <Route path="/history" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <History />
        </ProtectedRoute>
      } />

      <Route path="/orderdetail/:id" element={
        <ProtectedRoute allowedRoles={['owner', 'manager', 'employee']}>
          <Orderdetail />
        </ProtectedRoute>
      } />
      <Route path="/serve" element={
        <ProtectedRoute allowedRoles={['owner', 'manager', 'employee']}>
          <SERVE />
        </ProtectedRoute>
      } />

      <Route path="/servedetail/:id" element={
        <ProtectedRoute allowedRoles={['owner', 'manager', 'employee']}>
          <SERVEDETAIL />
        </ProtectedRoute>
      } />
      <Route path="/historydetail/:id" element={
        <ProtectedRoute allowedRoles={['owner', 'manager', 'employee']}>
          <HISTORYDETAIL />
        </ProtectedRoute>
      } />
      <Route path="/table" element={
        <ProtectedRoute allowedRoles={['owner', 'manager', 'employee']}>
          <TABLE />
        </ProtectedRoute>
      } />

    </Routes>




  </BrowserRouter>
);


