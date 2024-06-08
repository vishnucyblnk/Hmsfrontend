import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { FaList } from "react-icons/fa";
import { PiListPlusFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { deletePatientAPI, patientListAPI, patientRegisterAPI } from '../Services/allApi';
import ReceptionEditPatient from './ReceptionEditPatient';
import ProfileDisp from './ProfileDisp';
import { useSelector } from 'react-redux';
import dummyprofImg from '../Assets/dummyProfilePicture.png';

function ReceptionPatient() {

    const isEdited = useSelector((state) => state.response.isEdited)

    const [selectedSideComponent, setselectedSideComponent] = useState('Patients List')
    const [allPatients, setallPatients] = useState([])
    const [addPatientData, setaddPatientData] = useState({
        username: '', role: 'PAT', email: '', gender: '', dob: '', bloodgroup: '', phone: '', address: '', profImg: ''
    })
    const [preview, setPreview] = useState("")

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (addPatientData.profImg) {
            setPreview(URL.createObjectURL(addPatientData.profImg))
        }
    }, [addPatientData.profImg])



    const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        handlePatientList()
    }, [isEdited])

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons: <FaList />,
            names: 'Patients List'
        },
        {
            icons: <PiListPlusFill />,
            names: 'Add Patient'
        }
    ]

    const handleAddPatient = async (e) => {
        e.preventDefault()
        const { username, role, email, gender, dob, bloodgroup, phone, address, profImg } = addPatientData
        if (!username || !role || !email || !gender || !dob || !bloodgroup || !phone || !address || !profImg) {
            alert("Please fill all details")
        } else {
            const reqBody = new FormData()
            reqBody.append("username", username)
            reqBody.append("role", role)
            reqBody.append("email", email)
            reqBody.append("gender", gender)
            reqBody.append("dob", dob)
            reqBody.append("bloodgroup", bloodgroup)
            reqBody.append("phone", phone)
            reqBody.append("address", address)
            reqBody.append("profImg", profImg)
            const reqHeader = {
                "content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await patientRegisterAPI(reqBody, reqHeader)
            if (res.status === 200) {
                alert(`${res.data.username} has successfully registered....`)
                // reset state
                setaddPatientData({
                    username: '', role: 'PAT', email: '', gender: '', dob: '', bloodgroup: '', phone: '', address: '', profImg: ''
                })
                setPreview("")
                handlePatientList()
            } else {
                alert(res.response.data)
            }
        }
    }

    const handlePatientList = async () => {
        // api call
        const res = await patientListAPI(addPatientData)
        setallPatients(res.data)
    }

    // Delete a Patient

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        const result = await deletePatientAPI(id, reqHeader);
        if (result.status === 200) {
            alert(`${result.data.username} has successfully Deleted....`)
            handlePatientList()
        } else {
            alert(result.response.data)
        }
    }

    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage Patient</h2>
                </div>
                <div className='headPanel d-flex text-dark'>
                    {mainLinks.map(({ icons, names }) => {
                        return (
                            <button style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className='headButton btn btn-primary fw-bold p-3 d-flex align-items-center flex-wrap'>{icons} <span className='ps-1'>{names}</span></button>
                        );
                    }
                    )}
                </div>
                {
                    selectedSideComponent === 'Add Patient' &&
                    <div className='PatientAdd d-flex justify-content-center' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className='container p-1 w-75'>
                            <div className='row pt-3'>
                                <div className="col-md-8">
                                    {/* Patient Name */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label for="patName" className="w-50 form-label mt-1 fw-bolder">Patient Name: </label>
                                        <input type="text" className="form-control mb-1 border" id="patName" placeholder="Enter Patient Name" fdprocessedid="47ab85" value={addPatientData.username} onChange={(e) => setaddPatientData({ ...addPatientData, username: e.target.value })} />
                                    </div>

                                    {/* Patient Email */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label for="patEmail" className="w-50 form-label mt-1 fw-bolder">Patient Email: </label>
                                        <input type="email" className="form-control mb-1 border" id="patEmail" placeholder="Enter Patient Email" fdprocessedid="47ab85" value={addPatientData.email} onChange={(e) => setaddPatientData({ ...addPatientData, email: e.target.value })} />
                                    </div>

                                    {/* Patient Sex */}
                                    <div className="form-group d-flex justify-content-center align-items-center">
                                        <label for="patGender" className="w-50 form-label mt-1 fw-bolder">Patient Gender: </label>
                                        <select className="form-select mt-1 mb-1 border" id="patGender" fdprocessedid="85cko" onChange={(e) => setaddPatientData({ ...addPatientData, gender: e.target.value })}>
                                            <option selected disabled>Select Gender</option>
                                            <option value='Male'>Male</option>
                                            <option value='Female'>Female</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <label className='text-center d-flex justify-content-center align-items-center border border-2' htmlFor="profilepic">
                                        <input id='profilepic' accept="image/jpeg, image/jpg, image/png" onChange={e => setaddPatientData({ ...addPatientData, profImg: e.target.files[0] })} type="file" style={{ display: 'none' }} />
                                        {/* accept="image/*"  for all format of images*/}
                                        <img width={'180px'} height={'180px'} src={preview ? preview : dummyprofImg} alt="dummy-profile-pic" />
                                    </label>
                                </div>
                            </div>

                            {/* Patient DateOfBirth */}
                            <div className="form-group d-flex justify-content-center align-items-center mt-3">
                                <label for="patDob" className="w-50 form-label fw-bolder">Patient Date Of Birth: </label>
                                <input type="date" className="form-control mb-1 border" id="patDob" placeholder="Enter Patient Date Of Birth" fdprocessedid="47ab85" value={addPatientData.dob} onChange={(e) => setaddPatientData({ ...addPatientData, dob: e.target.value })} />
                            </div>

                            {/* Patient Blood Group */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label for="patBloodGroup" className="w-50 form-label mt-1 fw-bolder">Patient Blood Group: </label>
                                <select className="form-select mt-1 mb-1 border" id="patBloodGroup" fdprocessedid="85cko" onChange={(e) => setaddPatientData({ ...addPatientData, bloodgroup: e.target.value })}>
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
                                <label for="patPhone" className="w-50 form-label mt-1 fw-bolder">Patient PhoneNo: </label>
                                <input type="text" className="form-control mb-1 border" id="patPhone" placeholder="Enter Patient PhoneNo" fdprocessedid="47ab85" value={addPatientData.phone} onChange={(e) => setaddPatientData({ ...addPatientData, phone: e.target.value })} />
                            </div>

                            {/* Patient Address */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label for="patAddr" className="w-50 form-label mt-1 fw-bolder">Patient Address: </label>
                                <input type="text" className="form-control mb-1 border" id="patAddr" placeholder="Enter Patient Address" fdprocessedid="47ab85" value={addPatientData.address} onChange={(e) => setaddPatientData({ ...addPatientData, address: e.target.value })} />
                            </div>
                            <div className='pt-4'>
                                <button onClick={handleAddPatient} type='button' className='btn btn-primary p-3 w-100'>Add Patient</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    selectedSideComponent === 'Patients List' &&
                    <div className='PatientList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0px', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Patient Id</th>
                                    <th>Patient Name</th>
                                    <th>Age</th>
                                    <th>Sex</th>
                                    <th>Blood Group</th>
                                    <th>Birth Date</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allPatients?.length > 0 ? allPatients?.map((item, index) => {
                                        return (
                                            <tr className="table-white">
                                                <td>{index + 1}</td>
                                                <td>{item.patId}</td>
                                                <td>{item.username}</td>
                                                <td>{item.age}</td>
                                                <td>{item.gender}</td>
                                                <td>{item.bloodgroup}ve</td>
                                                <td>{item.dob}</td>
                                                <td className='d-flex justify-content-center'>
                                                    <ProfileDisp memberData={{ role: item.role, patId: item.patId }} />
                                                    <ReceptionEditPatient displayData={item} />
                                                    <button className='btn btn-danger' onClick={(e) => handleDelete(e, item._id)}><MdDeleteOutline /></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="8" className='text-danger fw-bold fs-3'>No Patients</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>

        </>
    )
}

export default ReceptionPatient