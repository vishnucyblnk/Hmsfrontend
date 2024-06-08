import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './StylePages.css';
import backgroundImg from '../Assets/hospitalBackground.jpeg';
import { useSelector } from 'react-redux';

function HmsHome() {
    const [role,setRole] = useState('')

    const isLoggedIn = useSelector((state) => state.response.isLoggedIn)

    useEffect(()=>{
        const employee = JSON.parse(localStorage.getItem('existingEmployee'));
        if(employee){
            setRole(employee.role)
        }
    },[])

    return (
        <>
            {/* landing Section */}
            <div className='w-100 rounded d-flex justify-content-center align-items-center m-0 ' style={{ minHeight: '93vh', backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Row className='text-center'>
                    <Col sm={12} md={12}>
                        <div className='p-5' style={{ backgroundColor: 'rgba(255,255,255,80%)' }}>
                            <h2>Welcome to</h2>
                            <h1 className='fw-bold' style={{ color: '#005eff' }}><i className="fa-regular fa-hospital"></i> Cleveland Hospitals</h1>
                            <h2 className='fw-bold p-1'>Hospital Management System</h2>
                            {
                                isLoggedIn ? 
                                (
                                    <div>
                                        <Link to={'/myDashboard'} className='btn btn-primary w-100'>Go to Dashboard</Link>
                                    </div>
                                ):(
                                    <div>
                                        <Link to={'/login'} className='btn btn-primary w-100'>LOGIN</Link>
                                    </div>
                                )
                            }
                        </div>
                    </Col>
                </Row>

            </div>
        </>
    )
}

export default HmsHome