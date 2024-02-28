// AppRouter.js
import React from 'react';
import { Router,Routes ,Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login'; // Import các component bạn muốn hiển thị
import { useSelector, useDispatch } from 'react-redux';
import Barcode1 from './barcode';
import Err from './dangnhap.err';
const AppRouter = () => {
    const isLogin = useSelector(state => state.auth.isLogin);
    //console.log(isLogin)
  return (
    
   
      <Routes>
        <Route exact path="/" element={<Login/>}/>
        <Route
        path="/barcode"
        element={<Barcode1 />}
      />
      </Routes>
  
  
  );
};

export default AppRouter;
