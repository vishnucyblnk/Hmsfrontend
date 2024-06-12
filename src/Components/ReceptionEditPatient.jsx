import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MdOutlineEditNote } from "react-icons/md";
import { editPatientAPI } from '../Services/allApi';
import { BASEURL } from '../Services/baseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { editResponse } from '../Redux/responseSlice';
import { ToastContainer, toast } from 'react-toastify';

function ReceptionEditPatient({ displayData }) {

    const dispatch = useDispatch();
    const isEdited = useSelector((state) => state.response.isEdited)

    const [preview, setPreview] = useState("")
    const [addPatientData, setaddPatientData] = useState({
        id: displayData._id, username: displayData.username, role: displayData.role, email: displayData.email, gender: displayData.gender, dob: displayData.dob, age: displayData.age, bloodgroup: displayData.bloodgroup, phone: displayData.phone, address: displayData.address, profImg: ''
    })
    const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(()=>{
        setaddPatientData({
            id: displayData._id, username: displayData.username, role: displayData.role, email: displayData.email, gender: displayData.gender, dob: displayData.dob, age: displayData.age, bloodgroup: displayData.bloodgroup, phone: displayData.phone, address: displayData.address, profImg: ''
        })
    },[displayData])

    useEffect(() => {
        if (addPatientData.profImg) {
            setPreview(URL.createObjectURL(addPatientData.profImg));
        } else if (displayData.profImg) {
            setPreview(`${BASEURL}/uploads/images/${displayData.profImg}`);
        } else {
            setPreview("");
        }
    }, [addPatientData.profImg, displayData.profImg])

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
        setaddPatientData({
            id: displayData._id, username: displayData.username, role: displayData.role, email: displayData.email, gender: displayData.gender, dob: displayData.dob, age: displayData.age, bloodgroup: displayData.bloodgroup, phone: displayData.phone, address: displayData.address, profImg: ''
        })
    }

    // limiting calender accessing previous days for appointment
    // Initialize state for minimum date
    const [maxDate, setMaxDate] = useState('');
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    // Update minimum date when component mounts
    useState(() => {
        setMaxDate(today);
    }, []);

    const handleEditPatient = async (e) => {
        e.preventDefault()
        const { id, username, role, email, gender, dob, age, bloodgroup, phone, address, profImg } = addPatientData;
        if (!username || !role || !email || !gender || !dob || !age || !bloodgroup || !phone || !address) {
            toast.warning("Please edit any details for Updating", { containerId: 'RecEdtPat' })
        } else {
            const reqBody = new FormData()
            reqBody.append("username", username)
            reqBody.append("role", role)
            reqBody.append("email", email)
            reqBody.append("gender", gender)
            reqBody.append("dob", dob)
            reqBody.append("age", age)
            reqBody.append("bloodgroup", bloodgroup)
            reqBody.append("phone", phone)
            reqBody.append("address", address)
            profImg ? reqBody.append("profImg", profImg) : reqBody.append("profImg", displayData.profImg)
            if (profImg) {
                const reqHeader = {
                    "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`
                }
                const result = await editPatientAPI(id, reqBody, reqHeader)
                if (result.status === 200) {
                    dispatch(editResponse(!isEdited));
                    // modal closed
                    handleClose()
                    toast.success(`${result.data.username} has successfully Updated....`, { containerId: 'RecPat' })
                } else {
                    toast.error(result.response.data, { containerId: 'RecPat' })
                }
            } else {
                const reqHeader = {
                    "Content-Type": "application/json", "Authorization": `Bearer ${token}`
                }
                const result = await editPatientAPI(id, reqBody, reqHeader)
                if (result.status === 200) {
                    dispatch(editResponse(!isEdited));
                    // modal closed
                    handleClose()
                    toast.success(`${result.data.username} has successfully Updated....`, { containerId: 'RecPat' })
                } else {
                    toast.error(result.response.data, { containerId: 'RecPat' })
                }
            }
        }
    }


    return (
        <>
            <button onClick={handleShow} className='btn btn-primary me-3'><MdOutlineEditNote /></button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered>
                <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton>
                    <Modal.Title className='fw-bold text-primary'>Edit Patient Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='departmentAdd d-flex justify-content-center'>
                        <div className='container p-1 w-75'>
                            <div className="row">
                                <div className="col-lg-8">
                                    {/* Patient Name */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label htmlFor="patName" className="w-50 form-label mt-1 fw-bolder">Patient Name: </label>
                                        <input type="text" className="form-control mb-1 border" id="patName" placeholder="Enter Patient Name" fdprocessedid="47ab85" value={addPatientData.username} onChange={(e) => setaddPatientData({ ...addPatientData, username: e.target.value })} />
                                    </div>

                                    {/* Patient Email */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label htmlFor="patEmail" className="w-50 form-label mt-1 fw-bolder">Patient Email: </label>
                                        <input type="email" className="form-control mb-1 border" id="patEmail" placeholder="Enter Patient Email" fdprocessedid="47ab85" value={addPatientData.email} onChange={(e) => setaddPatientData({ ...addPatientData, email: e.target.value })} />
                                    </div>

                                    {/* Patient Sex */}
                                    <div className="form-group d-flex justify-content-center align-items-center">
                                        <label htmlFor="patGender" className="w-50 form-label mt-1 fw-bolder">Patient Gender: </label>
                                        <select className="form-select mt-1 mb-1 border" id="patGender" fdprocessedid="85cko" value={addPatientData.gender} onChange={(e) => setaddPatientData({ ...addPatientData, gender: e.target.value })} >
                                            <option selected disabled>Select Gender</option>
                                            <option value='Male'>Male</option>
                                            <option value='Female'>Female</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* profile Image */}
                                <div className="col-lg-4">
                                    <label className='border border-2 text-center d-flex justify-content-center align-items-center' htmlFor="profpic">
                                        <input id='profpic' accept="image/jpeg, image/jpg, image/png" type="file" style={{ display: 'none' }} onChange={e => setaddPatientData({ ...addPatientData, profImg: e.target.files[0] })} />
                                        <img width={'180px'} height={'180px'} src={preview ? preview : `${BASEURL}/uploads/images/${displayData.profImg}`} alt="profile-pic" />
                                    </label>
                                </div>
                            </div>

                            {/* Patient DateOfBirth */}
                            <div className="form-group d-flex justify-content-center align-items-center mt-3">
                                <label htmlFor="patDob" className="w-50 form-label fw-bolder">Patient Date Of Birth: </label>
                                <input type="date" className="form-control mb-1 border" id="patDob" placeholder="Enter Patient Date Of Birth" fdprocessedid="47ab85" value={addPatientData.dob} max={maxDate} onChange={(e) => setaddPatientData({ ...addPatientData, dob: e.target.value })} />
                            </div>

                            {/* Patient Blood Group */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label htmlFor="patBloodGroup" className="w-50 form-label mt-1 fw-bolder">Patient Blood Group: </label>
                                <select className="form-select mt-1 mb-1 border" id="patBloodGroup" fdprocessedid="85cko" value={addPatientData.bloodgroup} onChange={(e) => setaddPatientData({ ...addPatientData, bloodgroup: e.target.value })}>
                                    <option selected disabled>Select Blood Group</option>
                                    {
                                        blood.map((item) => (
                                            <option value={item}>{item}ve</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Patient Phone */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label htmlFor="patPhone" className="w-50 form-label mt-1 fw-bolder">Patient PhoneNo: </label>
                                <input type="text" className="form-control mb-1 border" id="patPhone" placeholder="Enter Patient PhoneNo" fdprocessedid="47ab85" value={addPatientData.phone} onChange={(e) => setaddPatientData({ ...addPatientData, phone: e.target.value })} />
                            </div>

                            {/* Patient Address */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label htmlFor="patAddr" className="w-50 form-label mt-1 fw-bolder">Patient Address: </label>
                                <input type="text" className="form-control mb-1 border" id="patAddr" placeholder="Enter Patient Address" fdprocessedid="47ab85" value={addPatientData.address} onChange={(e) => setaddPatientData({ ...addPatientData, address: e.target.value })} />
                            </div>
                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className='bg-success fw-bold' variant="primary" onClick={handleEditPatient}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer containerId= 'RecEdtPat' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default ReceptionEditPatient