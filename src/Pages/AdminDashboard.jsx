import React, { useEffect, useState } from 'react'
import './StylePages.css';
import { MdAdminPanelSettings, MdMonitor } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { ImLab, ImTree } from "react-icons/im";
import { FaUserNurse } from "react-icons/fa6";
import { MdBloodtype } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";
import AdminDepartment from '../Components/AdminDepartment';
import BloodBank from '../Components/BloodBank';
import AdminEmployee from '../Components/AdminEmployee';
import { RiBodyScanFill, RiMedicineBottleFill, RiUserSettingsFill } from "react-icons/ri";
import { MdEditNotifications } from "react-icons/md";
import AdminAddNotification from '../Components/AdminAddNotification';
import MainDashboard from '../Components/MainDashboard';


function AdminDashboard() {
    const [employeename, setEmployeename] = useState("")
    const [selectedSideComponent, setselectedSideComponent] = useState('DashBoard');
    const [showEmployeesDropdown, setShowEmployeesDropdown] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("existingEmployee")) {
            setEmployeename(JSON.parse(localStorage.getItem("existingEmployee")).username)
        }
    }, [])
    const handleLinkClick = (names) => {
        if (names === 'Employees') {
            setShowEmployeesDropdown(!showEmployeesDropdown);
        } else {
            setselectedSideComponent(names);
        }
    }
    const sideLinks = [
        {
            icons: <MdMonitor />,
            names: 'DashBoard',
            comp: <MainDashboard />
        },
        {
            icons: <MdAdminPanelSettings />,
            names: 'My Profile',
            comp: <AdminEmployee employeeDet={{ role: 'ADM', name: 'Admin' }} />
        },
        {
            icons: <ImTree />,
            names: 'Department',
            comp: <AdminDepartment />
        },
        {
            icons: <MdBloodtype />,
            names: 'Blood Bank',
            comp: <BloodBank />
        },
        {
            icons: <MdEditNotifications />,
            names: 'Notifications',
            comp: <AdminAddNotification />
        },
        {
            icons: <RiUserSettingsFill />,
            names: 'Employees'
        }
    ]

    const subSideLinks = [
        {
            icons: <FaUserDoctor />,
            names: 'Doctor',
            comp: <AdminEmployee employeeDet={{ role: 'DOC', name: 'Doctor' }} />
        },
        {
            icons: <FaUserNurse />,
            names: 'Nurse',
            comp: <AdminEmployee employeeDet={{ role: 'NUR', name: 'Nurse' }} />
        },
        {
            icons: <MdSupportAgent />,
            names: 'Receptionist',
            comp: <AdminEmployee employeeDet={{ role: 'REC', name: 'Receptionist' }} />
        },
        {
            icons: <ImLab />,
            names: 'Laboratorist',
            comp: <AdminEmployee employeeDet={{ role: 'LAB', name: 'Laboratorist' }} />
        },
        {
            icons: <RiBodyScanFill />,
            names: 'Radiologist',
            comp: <AdminEmployee employeeDet={{ role: 'RAD', name: 'Radiologist' }} />
        },
        {
            icons: <RiMedicineBottleFill />,
            names: 'Pharmacist',
            comp: <AdminEmployee employeeDet={{ role: 'PHM', name: 'Pharmacist' }} />
        }
    ]
    return (
        <>
            <div className='row m-0' >
                <div className='col-12 col-lg-2 p-0 sidebar' >
                    <div className='d-flex flex-column'>
                        {sideLinks.map(({ icons, names }) => {
                            return (
                                <>
                                    <button style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className={`sidelink btn btn-primary border-bottom border-black p-3 w-100 d-flex align-items-center justify-content-between flex-wrap ${names === 'Employees' ? ' dropdown-toggle' : ''}`}> {icons} {names} </button>
                                </>
                            );
                        }
                        )}
                        {showEmployeesDropdown &&
                            (subSideLinks.map(({ icons, names }) => {
                                return (
                                    <button key={names}
                                        style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}}
                                        onClick={() => handleLinkClick(names)}
                                        type='button'
                                        className='sidelink dropdown-item btn btn-primary border-bottom border-black p-3 w-100 d-flex align-items-center justify-content-between flex-wrap'>
                                        {icons} {names}
                                    </button>
                                );
                            }))
                        }
                    </div>
                </div>
                <div className='col-lg-10 offset-lg-2 p-0 mainbar' >
                    <p className='text-center fw-bold bg-dark text-success m-0'>Welcome <span style={{ color: '#fff380' }}>{employeename}</span> to Your Dashboard</p>
                    <div className='comp bg-light' >
                        {
                            sideLinks.map(({ comp, names }) => {
                                return (
                                    (selectedSideComponent === names) && comp
                                )
                            })
                        }
                        {
                            subSideLinks.map(({ comp, names }) => {
                                return (
                                    (selectedSideComponent === names) && comp
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard