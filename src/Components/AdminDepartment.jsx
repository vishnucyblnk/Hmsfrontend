import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { FaList } from "react-icons/fa";
import { PiListPlusFill } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { deleteDepartmentAPI, departmentListAPI, registerDepartmentAPI } from '../Services/allApi';
import AdminEditDepartment from './AdminEditDepartment';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

function AdminDepartment() {

    const isEdited = useSelector((state) => state.response.isEdited)

    const [selectedSideComponent, setselectedSideComponent] = useState('Department List')
    const [allDepartment, setallDepartment] = useState([])
    const [addDepartmentData, setaddDepartmentData] = useState({
        name: '', description: ''
    })

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        handleDepartmentList()
    }, [addDepartmentData, isEdited]) 

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons: <FaList />,
            names: 'Department List'
        },
        {
            icons: <PiListPlusFill />,
            names: 'Add Department'
        }
    ]

    // Add New Departments
    const handleAddDepartment = async (e) => {
        e.preventDefault()
        const { name, description } = addDepartmentData
        if (!name || !description) {
            toast.warning("Please fill all details", { containerId: 'AdminDeprtmnt' })
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await registerDepartmentAPI(addDepartmentData, reqHeader)
            if (res.status === 200) {
                toast.success(`${res.data.name} has successfully registered....`, { containerId: 'AdminDeprtmnt' });
                // reset state
                setaddDepartmentData({
                    name: "", description: ""
                })
                handleDepartmentList()
            } else {
                toast.error(res.response.data, { containerId: 'AdminDeprtmnt' })
            }
        }
    }

    // Show List of All Departments 
    const handleDepartmentList = async () => {
        // api call
        const res = await departmentListAPI(addDepartmentData)
        setallDepartment(res.data)
    }

    // Delete a Department

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        const result = await deleteDepartmentAPI(id, reqHeader)
        if (result.status === 200) {
            toast.success(`${result.data.name} has successfully Deleted....`, { containerId: 'AdminDeprtmnt' })
            handleDepartmentList()
        } else {
            toast.error(result.response.data, { containerId: 'AdminDeprtmnt' })
        }
    }

    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage Department</h2>
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
                    selectedSideComponent === 'Add Department' &&
                    <div className='departmentAdd d-flex justify-content-center' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className='container p-1 w-75'>
                            <div className="form-group d-flex justify-content-around">
                                <label htmlFor="depName" className="w-50 form-label mt-3 fw-bolder">Department Name: </label>
                                <input type="text" className="form-control" id="depName" placeholder="Enter Department Name" fdprocessedid="47ab85" value={addDepartmentData.name} onChange={(e) => setaddDepartmentData({ ...addDepartmentData, name: e.target.value })} />
                            </div>
                            <div className="form-group d-flex justify-content-center">
                                <label htmlFor="depDesc" className="w-50 form-label mt-3 fw-bolder">Department Description: </label>
                                <input type="text" className="form-control" id="depDesc" placeholder="Enter Department Description" fdprocessedid="47ab85" value={addDepartmentData.description} onChange={(e) => setaddDepartmentData({ ...addDepartmentData, description: e.target.value })} />
                            </div>
                            <div className='pt-4'>
                                <button onClick={handleAddDepartment} type='button' className='btn btn-primary p-3 w-100'>Add Department</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    selectedSideComponent === 'Department List' &&
                    <div className='departmentList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Department Name</th>
                                    <th>Description</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allDepartment?.length > 0 ? allDepartment?.map((item, index) => {
                                        return (
                                            <tr className="table-white">
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td className='d-flex justify-content-center'>
                                                    <AdminEditDepartment displayData={item} />
                                                    <button className='btn btn-danger' onClick={(e) => handleDelete(e, item._id)}><MdDeleteOutline /></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="6" className='text-danger fw-bold fs-3'>No Department Uploaded</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <ToastContainer containerId= 'AdminDeprtmnt' position="bottom-right" autoClose={4000} closeOnClick="true" theme="dark" />
        </>
    )
}

export default AdminDepartment