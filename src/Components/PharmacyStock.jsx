import React, { useEffect, useState } from 'react'
import { FaList } from 'react-icons/fa';
import { PiListPlusFill } from 'react-icons/pi';
import { MdDeleteOutline } from "react-icons/md";
import { deleteStockAPI, registerStockAPI, stockListAPI } from '../Services/allApi';
import { ToastContainer, toast } from 'react-toastify';

function PharmacyStock() {
    const [selectedSideComponent, setselectedSideComponent] = useState('Medicine Stock List')
    const [allStock, setallStock] = useState([])
    const [addMedicineData, setaddMedicineData] = useState({
        medicineName: '', batchNo: '', expDate: '', price: '', stockQuantity: ''
    })

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        handleStockList()
    }, [addMedicineData])

    // limiting calender accessing previous days for appointment
    // Initialize state for minimum date
    const [minDate, setMinDate] = useState('');
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    // Update minimum date when component mounts
    useState(() => {
        setMinDate(today);
    }, []);

    const mainLinks = [
        {
            icons: <FaList />,
            names: 'Medicine Stock List'
        },
        {
            icons: <PiListPlusFill />,
            names: 'Add Stock'
        }
    ]

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }

    // Add New Stock
    const handleAddStock = async (e) => {
        e.preventDefault()
        const { medicineName, batchNo, expDate, price, stockQuantity } = addMedicineData
        if (!medicineName || !batchNo || !expDate || !price || !stockQuantity) {
            toast.warning("Please fill all details", { containerId: 'PhrmStck' })
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await registerStockAPI(addMedicineData, reqHeader)
            if (res.status === 200) {
                toast.success(`${res.data.medicineName} has successfully registered....`, { containerId: 'PhrmStck' })
                // reset state
                setaddMedicineData({
                    medicineName: '', batchNo: '', expDate: '', price: '', stockQuantity: ''
                })
                handleStockList()
            } else {
                toast.error(res.response.data, { containerId: 'PhrmStck' })
            }
        }
    }

    // Show List of All Medicine
    const handleStockList = async () => {
        // api call
        const res = await stockListAPI()
        setallStock(res.data)
    }

    // Delete a Medicine

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        const result = await deleteStockAPI(id, reqHeader)
        if (result.status === 200) {
            toast.success(`${result.data.medicineName} has successfully Deleted....`, { containerId: 'PhrmStck' })
            handleStockList()
        } else {
            toast.error(result.response.data, { containerId: 'PhrmStck' })
        }
    }


    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage Medicine Stock</h2>
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
                    selectedSideComponent === 'Add Stock' &&
                    <div className='stockAdd d-flex justify-content-center' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <div className='container p-1 w-75'>
                            <div className="form-group d-flex justify-content-around">
                                <label htmlFor="medName" className="w-50 form-label mt-3 fw-bolder">Medicine Name: </label>
                                <input type="text" className="form-control" id="medName" placeholder="Enter Medicine Name" fdprocessedid="47ab85" value={addMedicineData.medicineName} onChange={(e) => setaddMedicineData({ ...addMedicineData, medicineName: e.target.value })} />
                            </div>
                            <div className="form-group d-flex justify-content-center">
                                <label htmlFor="medbatch" className="w-50 form-label mt-3 fw-bolder">Batch No: </label>
                                <input type="text" className="form-control" id="medbatch" placeholder="Enter Batch No" fdprocessedid="47ab85" value={addMedicineData.batchNo} onChange={(e) => setaddMedicineData({ ...addMedicineData, batchNo: e.target.value })} />
                            </div>
                            <div className="form-group d-flex justify-content-center">
                                <label htmlFor="medexp" className="w-50 form-label mt-3 fw-bolder">Expiry date: </label>
                                <input type="date" className="form-control" id="medexp" placeholder="Enter Expiry Date" fdprocessedid="47ab85" min={minDate} value={addMedicineData.expDate} onChange={(e) => setaddMedicineData({ ...addMedicineData, expDate: e.target.value })} />
                            </div>
                            <div className="form-group d-flex justify-content-center">
                                <label htmlFor="medPrice" className="w-50 form-label mt-3 fw-bolder">Price: </label>
                                <input type="text" className="form-control" id="medPrice" placeholder="Enter Medicine Price" fdprocessedid="47ab85" value={addMedicineData.price} onChange={(e) => setaddMedicineData({ ...addMedicineData, price: e.target.value })} />
                            </div>
                            <div className="form-group d-flex justify-content-center">
                                <label htmlFor="medQnty" className="w-50 form-label mt-3 fw-bolder">Quantity: </label>
                                <input type="text" className="form-control" id="medQnty" placeholder="Enter Stock Qunatity adding" fdprocessedid="47ab85" value={addMedicineData.stockQuantity} onChange={(e) => setaddMedicineData({ ...addMedicineData, stockQuantity: e.target.value })} />
                            </div>
                            <div className='pt-4'>
                                <button onClick={handleAddStock} type='button' className='btn btn-primary p-3 w-100'>Add Stock</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    selectedSideComponent === 'Medicine Stock List' &&
                    <div className='stockList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Medicine Name</th>
                                    <th>Batch No</th>
                                    <th>Expiry Date</th>
                                    <th>Price</th>
                                    <th>Remaining Quantity</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allStock?.length > 0 ? allStock?.map((item, index) => {
                                        return (
                                            <tr className="table-white" key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.medicineName}</td>
                                                <td>{item.batchNo}</td>
                                                <td>{item.expDate}</td>
                                                <td>{item.price}</td>
                                                <td>{item.stockQuantity}</td>
                                                <td className='d-flex justify-content-center'>
                                                    <button className='btn btn-danger' onClick={(e) => handleDelete(e, item._id)}><MdDeleteOutline /></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="7" className='text-danger fw-bold fs-5'>No Medicine Stock Uploaded</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <ToastContainer containerId= 'PhrmStck' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default PharmacyStock