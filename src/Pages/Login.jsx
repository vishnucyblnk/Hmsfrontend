import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../Services/allApi';
import './StylePages.css';
import { useDispatch } from 'react-redux';
import { checkLog } from '../Redux/responseSlice';
import backgroundImg from '../Assets/hospitalBackground.jpeg';
import { Col, Row } from 'react-bootstrap';

function Login() {
    const [loginData, setloginData] = useState({
        role: "", email: "", password: ""
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        const { role, email, password } = loginData
        if (!role || !email || !password) {
            alert("Please fill the form completely")
        } else {
            // api call
            const res = await loginAPI(loginData)
            if (res.status === 200) {
                const { username, _id, department, empId } = res.data.existingEmployee;
                const user = { username, _id, department, role, empId };
                // save res 
                localStorage.setItem("existingEmployee", JSON.stringify(user))
                sessionStorage.setItem("token", res.data.token)
                // reset state
                setloginData({
                    role: "", email: "", password: ""
                })
                dispatch(checkLog(true))
                // navigate based on role
                switch (role) {
                    case 'ADM':
                        navigate('/myDashboard');
                        break;
                    default:
                        navigate('/myDashboard');
                }
            } else {
                alert(res.response.data)
            }
        }

    }
    return (
        <>
            <div className='w-100 d-flex justify-content-center align-items-center pt-5' style={{ minHeight: '93vh', backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Row className='text-center w-75'>
                    <Col sm={12} md={12}>
                        <div className='container p-3 shadow' style={{ backgroundColor: 'rgba(255,255,255,80%)' }}>
                            <div className='container p-3'>
                                <div className=' text-center'>
                                    <h2 className='fw-bold'>Login Panel</h2>
                                </div>

                                <div className="form-group">
                                    <select className="form-select mt-3" id="exampleSelect1" fdprocessedid="85cko" onChange={(e) => setloginData({ ...loginData, role: e.target.value })}>
                                        <option selected disabled>Select Account type</option>
                                        <option value='ADM'>Admin</option>
                                        <option value='DOC'>Doctor</option>
                                        <option value='NUR'>Nurse</option>
                                        <option value='PHM'>Pharmacist</option>
                                        <option value='REC'>Receptionist</option>
                                        <option value='LAB'>Laboratorist</option>
                                        <option value='RAD'>Radiologist</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <input type="email" className="form-control mt-3" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" fdprocessedid="47ab85" value={loginData.email} onChange={(e) => setloginData({ ...loginData, email: e.target.value })} />
                                </div>

                                <div className="form-group">
                                    <input type="password" className="form-control mt-3" id="exampleInputPassword1" placeholder="Enter Password" autocomplete="off" fdprocessedid="axn0s" value={loginData.password} onChange={(e) => setloginData({ ...loginData, password: e.target.value })} />
                                </div>
                                <div className='pt-4'>
                                    <button onClick={handleLogin} type='button' className='btn btn-primary p-3 w-100'>LOGIN</button>
                                </div>

                            </div>
                        </div>
                    </Col>
                </Row>

            </div>

        </>
    )
}

export default Login