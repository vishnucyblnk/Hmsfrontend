import React, { useEffect, useState } from 'react';
import { ImLab, ImUserPlus } from "react-icons/im";
import { MdMonitor, MdBloodtype } from "react-icons/md";
import { FaCapsules, FaHospitalUser } from 'react-icons/fa';
import { SiGooglesheets } from "react-icons/si";
import DoctorAppointment from '../Components/DoctorAppointment';
import BloodBank from '../Components/BloodBank';
import MainDashboard from '../Components/MainDashboard';
import DiagLabTest from '../Components/DiagLabTest';
import ReceptionPatient from '../Components/ReceptionPatient';
import ReceptionAppointment from '../Components/ReceptionAppointment';
import PharmacyStock from '../Components/PharmacyStock';
import PharmacyPendingRequest from '../Components/PharmacyPendingRequest';
import NursePatient from '../Components/NursePatient';


function MyDashboard() {
    const [employeeData, setEmployeeData] = useState({})
    const [selectedSideComponent, setselectedSideComponent] = useState('DashBoard')

    useEffect(() => {
        if (localStorage.getItem("existingEmployee")) {
            setEmployeeData({ username: JSON.parse(localStorage.getItem("existingEmployee")).username, role: JSON.parse(localStorage.getItem("existingEmployee")).role })
        }
    }, [])

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }

    const sideLinks = {
        DOC: [
            { icons: <MdMonitor />, names: 'DashBoard', comp: <MainDashboard /> },
            { icons: <FaHospitalUser />, names: 'Patients', comp: <NursePatient /> },
            { icons: <ImUserPlus />, names: 'Appointment', comp: <DoctorAppointment /> },
            { icons: <MdBloodtype />, names: 'Blood Bank', comp: <BloodBank /> }
        ],
        NUR: [
            { icons: <MdMonitor />, names: 'DashBoard', comp: <MainDashboard /> },
            { icons: <FaHospitalUser />, names: 'Patients', comp: <NursePatient /> },
            { icons: <MdBloodtype />, names: 'Blood Bank', comp: <BloodBank /> }
        ],
        LAB: [
            { icons: <MdMonitor />, names: 'DashBoard', comp: <MainDashboard /> },
            { icons: <ImLab />, names: 'Lab Test', comp: <DiagLabTest empDet={{ testType: "Laboratory", modalfor: 'labReq' }} /> },
            { icons: <MdBloodtype />, names: 'Blood Bank', comp: <BloodBank /> }
        ],
        RAD: [
            { icons: <MdMonitor />, names: 'DashBoard', comp: <MainDashboard /> },
            { icons: <ImLab />, names: 'Diag Test', comp: <DiagLabTest empDet={{ testType: "Diagnostics", modalfor: 'diagReq' }} /> },
            { icons: <MdBloodtype />, names: 'Blood Bank', comp: <BloodBank /> }
        ],
        REC: [
            { icons: <MdMonitor />, names: 'DashBoard', comp: <MainDashboard /> },
            { icons: <FaHospitalUser />, names: 'Patient', comp: <ReceptionPatient /> },
            { icons: <ImUserPlus />, names: 'Appointment', comp: <ReceptionAppointment /> },
            { icons: <MdBloodtype />, names: 'Blood Bank', comp: <BloodBank /> }
        ],
        PHM: [
            { icons: <MdMonitor />, names: 'DashBoard', comp: <MainDashboard /> },
            { icons: <SiGooglesheets />, names: 'Billing', comp: <PharmacyPendingRequest /> },
            { icons: <FaCapsules />, names: 'Stock Handling', comp: <PharmacyStock /> }
        ]
    }

    const roleLinks = sideLinks[employeeData.role] || [];
    return (
        <>
            <div className='row m-0' style={{ width: '100%', height: '100vh' }}>
                <div className='col-12 col-lg-2 p-0 sidebar'>
                    <div className='d-flex flex-column'>
                        {roleLinks.map(({ icons, names, comp }) => {
                            return (
                                <button style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className='sidelink btn btn-primary border-bottom border-black p-3 w-100 d-flex align-items-center justify-content-between flex-wrap'>{icons} {names}</button>
                            );
                        }
                        )}
                    </div>
                </div>
                <div className='col-lg-10 offset-lg-2 p-0 mainbar'>
                    <p className='text-center fw-bold bg-dark text-success m-0 '>Welcome <span style={{ color: '#fff380' }}>{employeeData.username}</span> to Your Dashboard</p>
                    <div className='comp bg-light' >
                        {
                            roleLinks.map(({ comp, names }) => {
                                return (
                                    selectedSideComponent === names && comp
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        </>
    )
}

export default MyDashboard