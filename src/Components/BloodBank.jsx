import React, { useEffect, useState } from 'react'
import { bloodBankAPI } from '../Services/allApi';
import { ToastContainer, toast } from 'react-toastify';

function BloodBank() {
    const [bloodDet, setBloodDet] = useState(null);
    const [search, setSearch] = useState({});

    const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const fetchData = async () => {
        // api call
        const res = await bloodBankAPI(search)
        if (res.status === 200) {
            setBloodDet(res.data)
        } else {
            toast.error(res.response.data, { containerId: 'BloodBank' })
        }
    }

    useEffect(() => {
        fetchData()
    }, [search])


    return (
        <>
            <div className='bloodData'>
                {/* Blood Search */}
                <div className="form-group d-flex justify-content-around align-items-center p-2 " style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <label htmlFor="bloodgroup" className="fs-4 w-50 form-label mt-3 fw-bolder text-black">Search BloodGroup: </label>
                    <select className="form-select mt-3 rounded ps-1" id="docDepartment" fdprocessedid="85cko" onChange={(e) => setSearch({ bloodgroup: e.target.value })} style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                        <option selected disabled>Select BloodGroup</option>
                        <option value="">All</option>
                        {
                            blood.map((item) => (
                                <option value={item}>{item}ve</option>
                            ))
                        }
                    </select>
                </div>
                <div className='table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                    <table className='table table-hover text-center'>
                        <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                            <tr>
                                <th>SL NO</th>
                                <th>Blood Group</th>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>PhoneNo</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bloodDet?.length > 0 ? bloodDet?.map((item, index) => {
                                    return (
                                        <tr className="table-white">
                                            <td>{index + 1}</td>
                                            <td>{item.bloodgroup}ve</td>
                                            {(item.role !== 'PAT') ? (<td>{item.empId}</td>) : (<td>{item.patId}</td>)}
                                            <td>{item.username}</td>
                                            <td>{item.age}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.address}</td>
                                        </tr>
                                    )
                                })
                                    :
                                    (
                                        <tr className="table-white">
                                            <td colSpan="7" className='text-danger fw-bold fs-3'>No BloodBank Data</td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer containerId= 'BloodBank' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default BloodBank