import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MdOutlineEditNote } from "react-icons/md";
import { editEmployeeAPI } from '../Services/allApi';
import { BASEURL } from '../Services/baseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { editResponse } from '../Redux/responseSlice';
import { ToastContainer, toast } from 'react-toastify';

function AdminEditEmployee({ displayData, allDepartment, employeeDet }) {
    const [preview, setPreview] = useState("")
    const [addEmployeeData, setaddEmployeeData] = useState({
        id: displayData._id, username: displayData.username, role: displayData.role, email: displayData.email, password: displayData.password, department: displayData.department, bloodgroup: displayData.bloodgroup, gender: displayData.gender, dob: displayData.dob, phone: displayData.phone, address: displayData.address, profImg: ''
    })

    const dispatch = useDispatch();
    const isEdited = useSelector((state) => state.response.isEdited)

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(()=>{
        setaddEmployeeData({
            id: displayData._id, username: displayData.username, role: displayData.role, email: displayData.email, password: displayData.password, department: displayData.department, bloodgroup: displayData.bloodgroup, gender: displayData.gender, dob: displayData.dob, phone: displayData.phone, address: displayData.address, profImg: ''
        })
    },[displayData])
    
    useEffect(() => {
        if (addEmployeeData.profImg) {
            setPreview(URL.createObjectURL(addEmployeeData.profImg));
        } else if (displayData.profImg) {
            setPreview(`${BASEURL}/uploads/images/${displayData.profImg}`);
        } else {
            setPreview("");
        }
    }, [addEmployeeData.profImg, displayData.profImg])

    const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
        setaddEmployeeData({
            id: displayData._id, username: displayData.username, role: displayData.role, email: displayData.email, password: displayData.password, department: displayData.department, bloodgroup: displayData.bloodgroup, gender: displayData.gender, dob: displayData.dob, phone: displayData.phone, address: displayData.address, profImg: ""
        })
    }

    const handleEditEmployee = async (e) => {
        e.preventDefault()
        const { id, username, role, email, password, department, bloodgroup, gender, dob, phone, address, profImg } = addEmployeeData;
        if (!username || !role || !email || !password || !bloodgroup || !gender || !dob || !phone || !address || ((employeeDet.role === 'DOC') && !department)) {
            toast.warning("Please edit any details for Updating", { containerId: 'AdminEditEmp' })
        } else {
            const reqBody = new FormData()
            reqBody.append("username", username)
            reqBody.append("role", role)
            reqBody.append("email", email)
            reqBody.append("password", password)
            reqBody.append("department", department)
            reqBody.append("bloodgroup", bloodgroup)
            reqBody.append("gender", gender)
            reqBody.append("dob", dob)
            reqBody.append("phone", phone)
            reqBody.append("address", address)
            profImg ? reqBody.append("profImg", profImg) : reqBody.append("profImg", displayData.profImg)
            if (profImg) {
                const reqHeader = {
                    "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`
                }
                const result = await editEmployeeAPI(id, reqBody, reqHeader)
                if (result.status === 200) {
                    dispatch(editResponse(!isEdited));
                    // modal closed
                    handleClose()
                    toast.success(`${result.data.username} has successfully Updated....`, { containerId: 'AdminEmp' })
                    
                } else {
                    toast.error(result.response.data, { containerId: 'AdminEmp' })
                }
            } else {
                const reqHeader = {
                    "Content-Type": "application/json", "Authorization": `Bearer ${token}`
                }
                const result = await editEmployeeAPI(id, reqBody, reqHeader)
                if (result.status === 200) {
                    dispatch(editResponse(!isEdited));
                    // modal closed
                    handleClose()
                    toast.success(`${result.data.username} has successfully Updated....`, { containerId: 'AdminEmp' })
                    
                } else {
                    toast.error(result.response.data, { containerId: 'AdminEmp' })
                }
            }
        }
    }


    return (
        <>
            <button onClick={handleShow} className='btn btn-primary me-3'><MdOutlineEditNote /></button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered>
                <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton >
                    <Modal.Title className='fw-bold text-primary'>Edit {employeeDet.name} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='EmployeeAdd d-flex justify-content-center'>
                        <div className='container p-1 w-75'>
                            <div className='row'>
                                <div className='col-lg-8'>
                                    {/* Employee name */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label htmlFor="empName" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Name: </label>
                                        <input type="text" className="form-control" id="empName" placeholder="Enter Name" fdprocessedid="47ab85" value={addEmployeeData.username} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, username: e.target.value })} />
                                    </div>

                                    {/* Employee Email */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label htmlFor="empEmail" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Email: </label>
                                        <input type="email" className="form-control" id="empEmail" placeholder="Enter Email" fdprocessedid="47ab85" value={addEmployeeData.email} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, email: e.target.value })} />
                                    </div>

                                    {/* Employee Password */}
                                    <div className="form-group d-flex justify-content-around align-items-center pb-2">
                                        <label htmlFor="empPass" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Password: </label>
                                        <input type="password" className="form-control" id="empPass" placeholder="Enter Password" fdprocessedid="47ab85" value={addEmployeeData.password} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, password: e.target.value })} />
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <label className='border border-2 text-center d-flex justify-content-center align-items-center' htmlFor="projectpic">
                                        <input id='projectpic' accept="image/jpeg, image/jpg, image/png" type="file" style={{ display: 'none' }} onChange={e => setaddEmployeeData({ ...addEmployeeData, profImg: e.target.files[0] })} />
                                        <img width={'180px'} height={'180px'} src={preview ? preview : `${BASEURL}/uploads/images/${displayData.profImg}`} alt="profile-pic" />
                                    </label>
                                </div>
                            </div>

                            {/* Employee Department */}
                            {(employeeDet.role === 'DOC') &&
                                (<div className="form-group d-flex justify-content-center align-items-center">
                                    <label htmlFor="empDepartment" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Department: </label>
                                    <select className="form-select mt-3" id="empDepartment" fdprocessedid="85cko" value={addEmployeeData.department} onChange={(e) => { setaddEmployeeData({ ...addEmployeeData, department: e.target.value }); setPreview(URL.createObjectURL(e.target.files[0])); }}>
                                        <option selected disabled>Select Department</option>
                                        {
                                            allDepartment.map((item) => (
                                                <option value={item.name}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>)
                            }

                            {/* Employee Blood Group */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label htmlFor="empBloodGroup" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Blood Group: </label>
                                <select className="form-select mt-3 mb-1 border" id="empBloodGroup" name="empBloodGroup" fdprocessedid="85cko" value={addEmployeeData.bloodgroup} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, bloodgroup: e.target.value })}>
                                    <option selected disabled>Select Blood Group</option>
                                    {
                                        blood.map((item) => (
                                            <option value={item}>{item}ve</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Employee Gender */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label htmlFor="empGender" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Gender: </label>
                                <select className="form-select mt-3 mb-1 border" id="empGender" fdprocessedid="85cko" value={addEmployeeData.gender} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, gender: e.target.value })}>
                                    <option selected disabled>Select Gender</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                </select>
                            </div>
                            {/* Employee DateOfBirth */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label htmlFor="empDob" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Date Of Birth: </label>
                                <input type="date" className="form-control mt-3 mb-1 border" id="empDob" placeholder="Enter Patient Date Of Birth" fdprocessedid="47ab85" value={addEmployeeData.dob} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, dob: e.target.value })} />
                            </div>

                            {/* Employee Phone */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label htmlFor="empPhone" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} PhoneNo: </label>
                                <input type="text" className="form-control" id="empPhone" placeholder="Enter PhoneNo" fdprocessedid="47ab85" value={addEmployeeData.phone} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, phone: e.target.value })} />
                            </div>

                            {/* Employee Address */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label htmlFor="empAddr" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Address: </label>
                                <input type="text" className="form-control" id="empAddr" placeholder="Enter Address" fdprocessedid="47ab85" value={addEmployeeData.address} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className='bg-success fw-bold' variant="primary" onClick={handleEditEmployee}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer containerId= 'AdminEditEmp' position="bottom-left" autoClose={4000} theme="dark" />
        </>
    )
}

export default AdminEditEmployee