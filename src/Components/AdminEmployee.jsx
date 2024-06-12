import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { FaList } from "react-icons/fa";
import { PiListPlusFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { deleteEmployeeAPI, departmentListAPI, membersListAPI, registerAPI } from '../Services/allApi';
import AdminEditEmployee from './AdminEditEmployee';
import ProfileDisp from './ProfileDisp';
import { useSelector } from 'react-redux';
import dummyprofImg from '../Assets/dummyProfilePicture.png';
import { ToastContainer, toast } from 'react-toastify';

function AdminEmployee({ employeeDet }) {
    const isEdited = useSelector((state) => state.response.isEdited)
    const [selectedSideComponent, setselectedSideComponent] = useState(`${employeeDet.name} List`)
    const [allEmployees, setallEmployees] = useState([])
    const [allDepartment, setallDepartment] = useState([])
    const [addEmployeeData, setaddEmployeeData] = useState({
        name: '', role: employeeDet.role, email: '', password: '', department: '', bloodgroup: '', gender: '', dob: '', phone: '', address: '', profImg: ''
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
        if (addEmployeeData.profImg) {
            setPreview(URL.createObjectURL(addEmployeeData.profImg))
        }
    }, [addEmployeeData.profImg])

    const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        handleEmployeeList()
        getDepartmentList()
    }, [addEmployeeData, isEdited])

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons: <FaList />,
            names: `${employeeDet.name} List`
        },
        {
            icons: <PiListPlusFill />,
            names: `Add ${employeeDet.name}`
        }
    ]

    // get Department list in the hospital
    const getDepartmentList = async () => {
        const res = await departmentListAPI()
        setallDepartment(res.data)
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

    // Add New Employees
    const handleAddEmployee = async (e) => {
        e.preventDefault()
        const { username, role, email, password, department, bloodgroup, gender, dob, phone, address, profImg } = addEmployeeData
        if (!username || !role || !email || !password || !bloodgroup || !gender || !dob || !phone || !address || !profImg || ((employeeDet.role === 'DOC') && !department)) {
            toast.warning("Please fill all details", { containerId: 'AdminEmp' })
        } else {
            const reqBody = new FormData()
            reqBody.append('username', username)
            reqBody.append('role', role)
            reqBody.append('email', email)
            reqBody.append('password', password)
            reqBody.append('department', department)
            reqBody.append('bloodgroup', bloodgroup)
            reqBody.append('gender', gender)
            reqBody.append('dob', dob)
            reqBody.append('phone', phone)
            reqBody.append('address', address)
            reqBody.append('profImg', profImg)
            const reqHeader = {
                "content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await registerAPI(reqBody, reqHeader)
            if (res.status === 200) {
                toast.success(`New Employee ${res.data.username} has successfully registered....`, { containerId: 'AdminEmp' })
                // reset state
                setaddEmployeeData({
                    username: '', role: employeeDet.role, email: '', password: '', department: '', bloodgroup: '', gender: '', dob: '', phone: '', address: '', profImg: ''
                })
                setPreview("")
                handleEmployeeList()
            } else {
                toast.error(res.response.data, { containerId: 'AdminEmp' })
            }
        }
    }

    // Show List of All Employees 
    const handleEmployeeList = async () => {
        // api call
        const res = await membersListAPI(addEmployeeData)
        setallEmployees(res.data)
    }

    // Delete a Employee

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        const result = await deleteEmployeeAPI(id, reqHeader)
        if (result.status === 200) {
            toast.success(`${result.data.username} has successfully Deleted....`, { containerId: 'AdminEmp' })
            handleEmployeeList()
        } else {
            toast.error(result.response.data, { containerId: 'AdminEmp' })
        }
    }


    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage {employeeDet.name}</h2>
                </div>
                <div className='headPanel d-flex text-dark'>
                    {mainLinks.map(({ icons, names }) => {
                        return (
                            <button style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className='headButton btn btn-primary fw-bold p-3 d-flex align-items-center'>{icons} <span className='ps-1'>{names}</span></button>
                        );
                    }
                    )}
                </div>
                {
                    selectedSideComponent === `Add ${employeeDet.name}` &&
                    <div className='EmployeeAdd d-flex justify-content-center' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className='container p-1 w-75'>
                            <div className='row pt-3'>
                                <div className='col-md-8'>
                                    {/* Employee name */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label htmlFor="docName" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Name: </label>
                                        <input type="text" className="form-control" id="docName" placeholder="Enter Name" fdprocessedid="47ab85" value={addEmployeeData.username} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, username: e.target.value })} />
                                    </div>

                                    {/* Employee Email */}
                                    <div className="form-group d-flex justify-content-around align-items-center">
                                        <label htmlFor="docEmail" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Email: </label>
                                        <input type="email" className="form-control" id="docEmail" placeholder="Enter Email" fdprocessedid="47ab85" value={addEmployeeData.email} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, email: e.target.value })} />
                                    </div>

                                    {/* Employee Password */}
                                    <div className="form-group d-flex justify-content-around align-items-center mb-3">
                                        <label htmlFor="docPass" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Password: </label>
                                        <input type="password" className="form-control" id="docPass" placeholder="Enter Password" fdprocessedid="47ab85" value={addEmployeeData.password} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, password: e.target.value })} />
                                    </div>
                                </div>
                                {/* profile Image */}
                                <div className='col-md-4'>
                                    <label className='text-center d-flex justify-content-center align-items-center border border-2' htmlFor="projectpic">
                                        <input id='projectpic' accept="image/jpeg, image/jpg, image/png" onChange={e => setaddEmployeeData({ ...addEmployeeData, profImg: e.target.files[0] })} type="file" style={{ display: 'none' }} />
                                        {/* accept="image/*"  for all format of images*/}
                                        <img width={'180px'} height={'180px'} src={preview ? preview : dummyprofImg} alt="dummy-profile-pic" />
                                    </label>
                                </div>
                            </div>
                            {/* Employee Department */}
                            {(employeeDet.role === 'DOC') &&
                                (<div className="form-group d-flex justify-content-center align-items-center">
                                    <label htmlFor="docDepartment" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Department: </label>
                                    <select className="form-select mt-3" id="docDepartment" fdprocessedid="85cko" onChange={(e) => setaddEmployeeData({ ...addEmployeeData, department: e.target.value })}>
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
                                <label htmlFor="docBloodGroup" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Blood Group: </label>
                                <select className="form-select mt-3 mb-1 border" id="docBloodGroup" name="docBloodGroup" fdprocessedid="85cko" onChange={(e) => setaddEmployeeData({ ...addEmployeeData, bloodgroup: e.target.value })}>
                                    <option selected disabled>Select Blood Group</option>
                                    {
                                        blood.map((item) => (
                                            <option value={item}>{item}ve</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Employee Sex */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label htmlFor="docGender" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Gender: </label>
                                <select className="form-select mt-3 mb-1 border" id="docGender" fdprocessedid="85cko" onChange={(e) => setaddEmployeeData({ ...addEmployeeData, gender: e.target.value })}>
                                    <option selected disabled>Select Gender</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                </select>
                            </div>
                            {/* Employee DateOfBirth */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label htmlFor="docDob" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Date Of Birth: </label>
                                <input type="date" className="form-control mt-3 mb-1 border" id="docDob" placeholder="Enter Patient Date Of Birth" fdprocessedid="47ab85" max={maxDate} value={addEmployeeData.dob} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, dob: e.target.value })} />
                            </div>

                            {/* Employee Phone */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label htmlFor="docPhone" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} PhoneNo: </label>
                                <input type="text" className="form-control" id="docPhone" placeholder="Enter PhoneNo" fdprocessedid="47ab85" value={addEmployeeData.phone} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, phone: e.target.value })} />
                            </div>

                            {/* Employee Address */}
                            <div className="form-group d-flex justify-content-around align-items-center">
                                <label htmlFor="docAddr" className="w-50 form-label mt-3 fw-bolder">{employeeDet.name} Address: </label>
                                <input type="text" className="form-control" id="docAddr" placeholder="Enter Address" fdprocessedid="47ab85" value={addEmployeeData.address} onChange={(e) => setaddEmployeeData({ ...addEmployeeData, address: e.target.value })} />
                            </div>
                            <div className='pt-4'>
                                <button onClick={handleAddEmployee} type='button' className='btn btn-primary p-3 w-100'>Add {employeeDet.name}</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    selectedSideComponent === `${employeeDet.name} List` &&
                    <div className="EmployeeList table-container table-responsive" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center '>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0px', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>{employeeDet.name} Id</th>
                                    <th>{employeeDet.name} Name</th>
                                    {(employeeDet.role === 'DOC') && <th>Department</th>}
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allEmployees?.length > 0 ? allEmployees?.map((item, index) => {
                                        return (
                                            <tr className="table-white">
                                                <td>{index + 1}</td>
                                                <td>{item.empId}</td>
                                                <td>{(employeeDet.role === 'DOC') ? `Dr. ${item.username}` : `${item.username}`}</td>
                                                {(employeeDet.role === 'DOC') && <td>{item.department}</td>}
                                                <td className='d-flex justify-content-center'>
                                                    <ProfileDisp memberData={{ role: item.role, empId: item.empId }} />
                                                    <AdminEditEmployee displayData={item} allDepartment={allDepartment} employeeDet={employeeDet} />
                                                    <button className='btn btn-danger' onClick={(e) => handleDelete(e, item._id)}><MdDeleteOutline /></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        (
                                            <tr>
                                                <td colSpan="5" className="text-danger fw-bold fs-3">No {employeeDet.name}s</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <ToastContainer containerId= 'AdminEmp' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default AdminEmployee