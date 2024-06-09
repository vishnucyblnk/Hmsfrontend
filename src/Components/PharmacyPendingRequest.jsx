import React, { useEffect, useState } from 'react'
import { FaList } from 'react-icons/fa';
import { pendingMedicineRequestListAPI } from '../Services/allApi';
import PharmacyBilling from './PharmacyBilling';
import { ToastContainer, toast } from 'react-toastify';

function PharmacyPendingRequest() {
    const [selectedSideComponent, setselectedSideComponent] = useState('Pending Medicine Requests')
    const [allPendingRequest, setallPendingRequest] = useState([])

    const mainLinks = [
        {
            icons: <FaList />,
            names: 'Pending Medicine Requests'
        }
    ]

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }

    useEffect(() => {
        handlePendingList()
    }, [])

    // Show List of All Medicine
    const handlePendingList = async () => {
        // API Call
        const res = await pendingMedicineRequestListAPI()
        if (res.status === 200) {
            setallPendingRequest(res.data)
        } else {
            toast.error(res.response.data, { containerId: 'PhrmReq' });
        }
    }

    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage Pending Medication Request</h2>
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
                    selectedSideComponent === 'Pending Medicine Requests' &&
                    <div className='pendingList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Patient Id</th>
                                    <th>Patient Name</th>
                                    <th>Prescribed Date</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allPendingRequest?.length > 0 ? allPendingRequest?.map((item, index) => {
                                        return (
                                            <tr className="table-white" key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.patId}</td>
                                                <td>{item.patientName}</td>
                                                <td>{item.prescriptionDate}</td>
                                                <td className='d-flex justify-content-center'>
                                                    <PharmacyBilling displayData={item} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="6" className='text-danger fw-bold fs-5'>No Pending Request</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <ToastContainer containerId= 'PhrmReq' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default PharmacyPendingRequest