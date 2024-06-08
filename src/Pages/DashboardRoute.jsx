import React, { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard';
import MyDashboard from './MyDashBoard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DashboardRoute() {
    const [role,setRole] = useState('');
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.response.isLoggedIn);

    useEffect(()=>{
        const employee = JSON.parse(localStorage.getItem('existingEmployee'));
        if(employee){
            setRole(employee.role)
        }
    },[])

    useEffect(()=>{
        if(!isLoggedIn){
            navigate('/login');
        }
    },[isLoggedIn,navigate])

  return (
    <>
    {
        role === 'ADM' ? <AdminDashboard /> : <MyDashboard />
    }    
    </>
  )
}

export default DashboardRoute