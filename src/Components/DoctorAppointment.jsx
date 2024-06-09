import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { FaList } from "react-icons/fa";
import { appointmentListAPI } from '../Services/allApi';
import EachConsult from './EachConsult';
import ProfileDisp from './ProfileDisp';
import PatientDetailDisplay from './PatientDetailDisplay';
import DiagLabPatientReportDisplay from './DiagLabPatientReportDisplay';

function DoctorAppointment() {
    const [selectedSideComponent, setselectedSideComponent] = useState("Today's Appointment List")
    const [allAppointments, setAllAppointments] = useState([])

    useEffect(() => {
        handleAppointmentList()
    }, [])

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons: <FaList />,
            names: "Today's Appointment List"
        },
        {
            icons: <FaList />,
            names: 'All Appointment List'
        }
    ]

    function getTodaysDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Adding leading zeros if month/day is less than 10
        month = (month < 10) ? '0' + month : month;
        day = (day < 10) ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    // get all Appointment list
    const handleAppointmentList = async () => {
        const res = await appointmentListAPI({ doctorId: JSON.parse(localStorage.getItem("existingEmployee"))._id })
        setAllAppointments(res.data)
    }

    const handleMem = (item) => {
        localStorage.setItem('selectedAppointment', JSON.stringify(item));
    };

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
                <div className='AppointmentList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                    <table className='table table-hover text-center'>
                        <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                            <tr>
                                {
                                    (
                                        selectedSideComponent === 'All Appointment List') ?
                                        (<>
                                            <th>SL NO</th>
                                            <th>Token No</th>
                                        </>)
                                        :
                                        (<th>Token No</th>)
                                }
                                <th>Patient Id</th>
                                <th>Patient Name</th>
                                <th>Appointment Date</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localStorage.getItem("existingEmployee") && JSON.parse(localStorage.getItem("existingEmployee")).role === 'DOC' &&
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
                                                    <td>
                                                    <PatientDetailDisplay allAppointments={{ patId: item.patId ,patientId: item.patientId}} />
                                                    <DiagLabPatientReportDisplay patientDet={{modalfor:'LabReq',patientId: item.patientId}}/>
                                                    <DiagLabPatientReportDisplay patientDet={{modalfor:'DiagReq',patientId: item.patientId}}/>
                                                    </td>
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
                                                    <td className='d-flex justify-content-center'>
                                                        <EachConsult patient={item} />
                                                    </td>
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
    )
}

export default DoctorAppointment