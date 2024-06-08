import React, { useEffect, useState } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { FaRegHospital } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { checkLog } from '../Redux/responseSlice';

function Header() {
    const navigate = useNavigate();
    const [existingEmployee, setExistingEmployee] = useState({});

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.response.isLoggedIn)

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(checkLog(false));
        localStorage.removeItem("existingEmployee");
        setExistingEmployee({});
        navigate('/');
    }

    useEffect(() => {
        const existingEmployeeData = JSON.parse(localStorage.getItem('existingEmployee'));
        if (existingEmployeeData) {
            setExistingEmployee(existingEmployeeData);
            dispatch(checkLog(true));
        } else {
            dispatch(checkLog(false)); 
        }
    }, [dispatch]);

    return (
        <>
            <Navbar className='bg-dark w-100 p-0 border-bottom border-primary'>
                <Container>
                    <Navbar.Brand className='w-100 d-flex justify-content-between align-items-center'>
                        <Link to={'/'} className='text-decoration-none'>
                            <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: '#005eff' }}><FaRegHospital className='me-1' /> Cleveland Hospitals
                            </h1>
                        </Link>
                        {isLoggedIn && (
                            <Button onClick={handleLogout} variant='dark' style={{ backgroundColor: '#005eff' }} className=' text-decoration-none p-1'>
                                <h5 className='d-flex align-items-center fw-bold text-light mb-0'><FiLogOut className='me-1 fw-bold text-light' /> Log out</h5>
                            </Button>
                        )}
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;
