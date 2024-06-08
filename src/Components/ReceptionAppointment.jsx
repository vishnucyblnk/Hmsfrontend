import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { PiListPlusFill } from "react-icons/pi";
import { FaList } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { appointmentListAPI, deleteAppointmentAPI, departmentListAPI, membersListAPI, patientListAPI, registerAppointmentAPI } from '../Services/allApi';
import ReceptionEditAppointment from './ReceptionEditAppointment';
import { useSelector } from 'react-redux';

function ReceptionAppointment() {
    const isEdited = useSelector((state) => state.response.isEdited)
    const [selectedSideComponent, setselectedSideComponent] = useState('Appointment List')
    const [patients, setPatients] = useState([])
    const [allDepartment, setallDepartment] = useState([])
    const [allAppointments, setAllAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [addAppointmentData, setaddAppointmentData] = useState({
        patientId: '', patId: '', patientName: '', department: '', doctorId: '', doctorName: '', appntDate: ''
    })

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    // limiting calender accessing previous days for appointment
    // Initialize state for minimum date
    const [minDate, setMinDate] = useState('');
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    // Update minimum date when component mounts
    useState(() => {
        setMinDate(today);
    }, []);

    useEffect(() => {
        getPatientList()
        getDepartmentList()
        handleAppointmentList()
    }, [isEdited])

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons: <FaList />,
            names: 'Appointment List'
        },
        {
            icons: <PiListPlusFill />,
            names: 'Add Appointment'
        }
    ]



    // get Patient list in the hospital
    const getPatientList = async () => {
        const res = await patientListAPI({})
        setPatients(
            res.data.map((item) => ({
                patId: item.patId,
                patName: item.username,
                patEmail: item.email,
                patientId: item._id
            }))
        )
    }


    // get Department list of the hospital
    const getDepartmentList = async () => {
        const res = await departmentListAPI()
        setallDepartment(res.data)
    }

    // accesing the doctors list function and adding department to data
    const handleDepartmentChange = (value) => {
        setaddAppointmentData({ ...addAppointmentData, department: value })
        getDoctorsList(value)
    }

    // get DoctorList in the Corresponding Department
    const getDoctorsList = async (value) => {
        const res = await membersListAPI({ role: '', department: value })
        alert(res.data);
        setDoctors(
            res.data.map((item) => ({
                docName: item.username,
                docEmail: item.email,
                doctorId: item._id
            }))
        )
    }

    // Handling the user selected Patient
    const handlePatientSelect = (value) => {
        patients.map(item => {
            if (item.patientId === value) {
                setaddAppointmentData(prev => ({ ...prev, patId: item.patId, patientName: item.patName, patientId: value }))
            }
        })
    }

    // Handling the user selected Doctor
    const handleDoctorSelect = (value) => {
        doctors.map(item => {
            if (item.doctorId === value) {
                setaddAppointmentData(prev => ({ ...prev, doctorName: item.docName, doctorId: value }))
            }
        })
    }

    // New Appointment are Adding
    const handleAddAppointment = async (e) => {
        e.preventDefault()
        const { patientId, patId, department, doctorId, appntDate } = addAppointmentData
        if (!patientId || !department || !doctorId || !appntDate) {
            alert("Please fill all details")
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await registerAppointmentAPI(addAppointmentData, reqHeader)
            if (res.status === 200) {
                alert(`Successfully Added the Appointment and your Token No ${res.data.tokenNumber}`)
                handleAppointmentList()
                // reset
                setaddAppointmentData({
                    patientId: '', patId: '', patientName: '', department: '', doctorId: '', doctorName: '', appntDate: ''
                })

            } else {
                alert(res.response.data)
            }
        }
    }

    // get all Appointment list
    const handleAppointmentList = async () => {
        const res = await appointmentListAPI()
        setAllAppointments(res.data)
    }

    // Delete a Doctor

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        const result = await deleteAppointmentAPI(id, reqHeader)
        if (result.status === 200) {
            alert(`has successfully Deleted....`)
            handleAppointmentList()
        } else {
            alert(result.response.data)
        }
    }

    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage Appointment</h2>
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
                    selectedSideComponent === 'Add Appointment' &&
                    <div className='AppointmentAdd d-flex justify-content-center' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className='container p-1 w-75'>

                            {/* Patient Id */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label for="patGender" className="w-50 form-label mt-3 fw-bolder">Patient ID: </label>
                                <select className="form-select mt-3 mb-1 border" id="patGender" fdprocessedid="85cko" onChange={(e) => handlePatientSelect(e.target.value)}>
                                    <option selected disabled>Select Patient Id</option>
                                    {
                                        patients.map((item) => (
                                            <option value={item.patientId}>{item.patId} - {item.patName}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Appointment Department */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label for="docDepartment" className="w-50 form-label mt-3 fw-bolder">Appointment Department: </label>
                                <select className="form-select mt-3 mb-1 border" id="docDepartment" fdprocessedid="85cko" onChange={(e) => handleDepartmentChange(e.target.value)}>
                                    <option selected disabled>Select Department</option>
                                    {
                                        allDepartment.map((item) => (
                                            <option value={item.doctorId}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Doctor Id */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label for="patGender" className="w-50 form-label mt-3 fw-bolder">Doctor : </label>
                                <select className="form-select mt-3 mb-1 border" id="patGender" fdprocessedid="85cko" onChange={(e) => handleDoctorSelect(e.target.value)}>
                                    <option selected disabled>Select Doctor</option>
                                    {
                                        doctors.map((item) => (
                                            <option value={item.doctorId}>Dr. {item.docName}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Appointment Date */}
                            <div className="form-group d-flex justify-content-center align-items-center">
                                <label for="patDob" className="w-50 form-label mt-3 fw-bolder">Appointment Date : </label>
                                <input type="date" className="form-control mt-3 mb-1 border" id="patDob" name="patDob" placeholder="Enter Appointment Date" fdprocessedid="47ab85" min={minDate} value={addAppointmentData.dob} onChange={(e) => setaddAppointmentData({ ...addAppointmentData, appntDate: e.target.value })} />
                            </div>

                            <div className='pt-4'>
                                <button onClick={handleAddAppointment} type='button' className='btn btn-primary p-3 w-100'>Add Appointment</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    selectedSideComponent === 'Appointment List' &&
                    <div className='Appointment Listtable-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0px', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Token</th>
                                    <th>Patient Name</th>
                                    <th>Department</th>
                                    <th>Doctor Name</th>
                                    <th>Appointment Date</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allAppointments?.length > 0 ? allAppointments.sort((a, b) => new Date(b.appntDate) - new Date(a.appntDate))?.map((item, index) => {
                                        return (
                                            <tr className="table-white">
                                                <td>{index + 1}</td>
                                                <td>{item.tokenNumber}</td>
                                                <td>{item.patientName}</td>
                                                <td>{item.department}</td>
                                                <td>{item.doctorName}</td>
                                                <td>{item.appntDate}</td>
                                                <td className='d-flex justify-content-center'>
                                                    <ReceptionEditAppointment displayData={item} patients={patients} allDepartment={allDepartment} />
                                                    <button className='btn btn-danger' onClick={(e) => handleDelete(e, item._id)}><MdDeleteOutline /></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="7" className='text-danger fw-bold fs-3'>No Appointments</td>
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

export default ReceptionAppointment