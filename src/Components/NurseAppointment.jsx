import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { FaList } from "react-icons/fa";
import { appointmentListAPI, departmentListAPI, membersListAPI } from '../Services/allApi';

function DoctorAppointment() {
    const [selectedSideComponent, setselectedSideComponent] = useState("Today's Appointment List");
    const [allAppointments, setAllAppointments] = useState([]);
    const [allDepartment, setallDepartment] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor,setSelectedDoctor] = useState('');

    useEffect(() => {
        getDepartmentList();
    }, []);


    const handleLinkClick = (names) => {
        setselectedSideComponent(names);
    };

    const mainLinks = [
        {
            icons: <FaList />,
            names: "Today's Appointment List"
        },
        {
            icons: <FaList />,
            names: 'All Appointment List'
        }
    ];

    function getTodaysDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        month = (month < 10) ? '0' + month : month;
        day = (day < 10) ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    const handleAppointmentList = async (doctorId) => {
        const res = await appointmentListAPI({ doctorId });
        setAllAppointments(res.data);
    };

    const getDepartmentList = async () => {
        const res = await departmentListAPI();
        setallDepartment(res.data);
    };

    const getDoctorsList = async (value) => {
        setSelectedDoctor('');
        const res = await membersListAPI({ role: '', department: value });
        setDoctors(
            res.data.map((item) => ({
                docName: item.username,
                docEmail: item.email,
                doctorId: item._id
            }))
        );
    };

    const handleDoctorChange = (value)=>{
        setSelectedDoctor(value)
        handleAppointmentList(value)
    }

    console.log("selected",allAppointments);
    return (
        <>
            <div className='d-flex flex-column'>
                {/* Doctor Search */}
                <div className="form-group d-flex justify-content-around align-items-center p-2 " style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <select className="form-select rounded ps-1 m-1" style={{ backgroundColor: 'rgb(255, 255, 255)' }} defaultValue="" onChange={(e)=> getDoctorsList(e.target.value)}>
                        <option  value="" disabled>Select Department</option>
                        {allDepartment.map((item, index) => (
                            <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                    <select className="form-select rounded ps-1 m-1" style={{ backgroundColor: 'rgb(255, 255, 255)' }} value={selectedDoctor} onChange={(e)=>handleDoctorChange(e.target.value)}>
                        <option value="" disabled>Select Doctor</option>
                        {doctors.map((item, index) => (
                            <option key={item.doctorId} value={item.doctorId}>Dr. {item.docName}</option>
                        ))}
                    </select>
                </div>

                <div className='headPanel d-flex text-dark'>
                    {mainLinks.map(({ icons, names }) => (
                        <button key={names} style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className='headButton btn btn-primary fw-bold p-3 d-flex align-items-center flex-wrap'>
                            {icons} <span className='ps-1'>{names}</span>
                        </button>
                    ))}
                </div>

                <div className='AppointmentList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                    <table className='table table-hover text-center'>
                        <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                            <tr>
                                {selectedSideComponent === 'All Appointment List' && <th>SL NO</th>}
                                <th>Token No</th>
                                <th>Patient Id</th>
                                <th>Patient Name</th>
                                <th>Appointment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localStorage.getItem("existingEmployee") && JSON.parse(localStorage.getItem("existingEmployee")).role === 'NUR' &&
                                ((selectedSideComponent === 'All Appointment List')
                                    ?
                                    (
                                        // Render all appointments
                                        allAppointments.length > 0 ? (
                                            allAppointments.sort((a, b) => new Date(b.appntDate) - new Date(a.appntDate)).map((item, index) => (
                                                <tr className="table-white" key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.tokenNumber}</td>
                                                    <td>{item.patId}</td>
                                                    <td>{item.patientName}</td>
                                                    <td>{item.appntDate}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="table-white">
                                                <td colSpan="6" className='text-danger fw-bold fs-3'>No Appointments Yet</td>
                                            </tr>
                                        )
                                    )
                                    :
                                    (
                                        // Render today's appointments
                                        allAppointments.filter(({ appntDate }) => appntDate === getTodaysDate()).length > 0
                                            ?
                                            (allAppointments.filter(({ appntDate }) => appntDate === getTodaysDate()).sort((a, b) => new Date(b.appntDate) - new Date(a.appntDate)).map((item, index) => (
                                                <tr className="table-white" key={index}>
                                                    <td>{item.tokenNumber}</td>
                                                    <td>{item.patId}</td>
                                                    <td>{item.patientName}</td>
                                                    <td>{item.appntDate}</td>
                                                </tr>
                                            ))
                                            )
                                            :
                                            (
                                                <tr className="table-white">
                                                    <td colSpan="6" className='text-danger fw-bold fs-3'>No Appointments Pending today</td>
                                                </tr>
                                            )
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default DoctorAppointment;
