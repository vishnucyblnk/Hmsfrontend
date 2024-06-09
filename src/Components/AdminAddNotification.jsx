import React, { useEffect, useState } from 'react'
import { FaList } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { PiListPlusFill } from 'react-icons/pi';
import { addNotificationAPI, deleteNotificationAPI, showNotifcationAPI, showNotificationAPI } from '../Services/allApi';
import { MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';

function AdminAddNotification() {
    const [selectedSideComponent, setselectedSideComponent] = useState('All Notifications');
    const [allNotification, setAllNotification] = useState([]);
    const [addNotificationData, setaddNotificationData] = useState('')

    const [token, setToken] = useState("");
    useEffect(() => {
        if (localStorage.getItem("existingEmployee") && sessionStorage.getItem("token")) {
            setToken(sessionStorage.getItem("token"))
        }
    }, [])

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }

    const handleAllNotification = async () => {
        // api call
        const res = await showNotificationAPI()
        setAllNotification(res.data)
    }

    // Add New Departments
    const handleAddNotification = async (e) => {
        e.preventDefault()
        const currentDate = getTodaysDate();
        if (!addNotificationData) {
            toast.warning("Please fill all details", { containerId: 'AdminAddNotif' })
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await addNotificationAPI({ descriptions: addNotificationData, date: currentDate }, reqHeader)
            if (res.status === 200) {
                toast.success(`New Notification has successfully Added....`, { containerId: 'AdminAddNotif' })
                // reset state
                setaddNotificationData("")
                // handleDepartmentList()
            } else {
                toast.error(res.response.data, { containerId: 'AdminAddNotif' })
            }
        }
    }

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

    const handleDelete = async (eachId, eachNotif) => {
        try {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            const res = await deleteNotificationAPI({ "id": eachId, "eachNotif": eachNotif }, reqHeader)
            if (res.status === 200) {
                toast.success("Notification Deleted Successfully...", { containerId: 'AdminAddNotif' })
                handleAllNotification();
            }
        } catch (err) {
            console.error("Error Deleting Sticky Note :", err)
        }
    }

    const mainLinks = [
        {
            icons: <FaList />,
            names: 'All Notifications'
        },
        {
            icons: <PiListPlusFill />,
            names: 'Add Notification'
        }
    ]

    useEffect(() => {
        handleAllNotification()
    }, [addNotificationData])

    return (
        <>
            <div className="d-flex flex-column">
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage Notifications</h2>
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
                    selectedSideComponent === 'Add Notification' &&
                    <div className='notificationAdd d-flex justify-content-center' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className='container p-1 w-75'>
                            <div className="form-group d-flex justify-content-center">

                                <input type="text" className="form-control" id="NotifDesc" placeholder="Enter New Notifcation" fdprocessedid="47ab85" value={addNotificationData} onChange={(e) => setaddNotificationData(e.target.value)} />
                            </div>
                            <div className='pt-4'>
                                <button onClick={handleAddNotification} type='button' className='btn btn-primary p-3 w-100'>Add New Notification</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    selectedSideComponent === 'All Notifications' &&
                    <div className='notificationList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Notifications</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allNotification?.length > 0 ? (
                                        allNotification.map((item) =>
                                            item.descriptions.map((title, idx) => (
                                                <tr className="table-white" key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{title}</td>
                                                    <td className='text-center'>
                                                        <Button className='me-4 bg-danger mb-1' size='sm' onClick={() => handleDelete(item._id, title)}>
                                                            <MdDelete />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    )
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="6" className='text-danger fw-bold fs-3'>No Notifications Added</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <ToastContainer containerId= 'AdminAddNotif' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default AdminAddNotification