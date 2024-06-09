import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaFileMedical } from 'react-icons/fa';
import { deleteStockAPI, deletependingMedcineRequestAPI, editStockAPI, stockListAPI } from '../Services/allApi';
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';

function PharmacyBilling({ displayData }) {

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    const [allStock, setAllStock] = useState([]);
    const [allBill, setAllBill] = useState([]);
    const [addBillingData, setAddBillingData] = useState({
        medicineName: '', quantity: '', totalQuantityPrice: '', payableAmount: 0, billingDate: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
        setAddBillingData({
            medicineName: '', quantity: '', totalQuantityPrice: '', payableAmount: 0, billingDate: ''
        })
        setAllBill([]);
    }

    const handleStockList = async () => {
        try {
            const res = await stockListAPI();
            setAllStock(res.data);
        } catch (error) {
            console.error('Error fetching stock list:', error);
        }
    };

    const handleQuantity = (e) => {
        const value = parseInt(e.target.value, 10);
        const selectedMedicine = allStock.find((item) => item.medicineName === addBillingData.medicineName);
        const remainingQuantity = selectedMedicine ? selectedMedicine.stockQuantity : 0;

        if (value > remainingQuantity || value < 0) {
            setErrorMessage('Insufficient Quantity in Stock');
        } else {
            setErrorMessage('');
        }
        setAddBillingData({ ...addBillingData, quantity: value, totalQuantityPrice: (selectedMedicine.price * value) });

    };

    const handleAllMedicine = async () => {

        const { medicineName, quantity, totalQuantityPrice } = addBillingData;
        const selectedMedicine = allStock.find((item) => item.medicineName === medicineName);
        const { _id, batchNo, expDate, price } = selectedMedicine

        const remainingQuantity = (selectedMedicine.stockQuantity - quantity) > 0 ? (selectedMedicine.stockQuantity - quantity) : 0;

        setAllBill(prevBills => [...prevBills, { medicineName, batchNo, expDate, quantity, price, totalQuantityPrice }])

        setAddBillingData(prevData => ({
            ...prevData,
            payableAmount: prevData.payableAmount + totalQuantityPrice
        }));

        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        if (remainingQuantity <= 0 || new Date(expDate) >= new Date()) {
            const result = await deleteStockAPI(_id, reqHeader)
            if (result.status === 200) {
                console.log(`${result.data.medicineName} has successfully Deleted because of Insufficient Stock ....`)
                handleStockList()
            } else {
                console.log(result.response.data)
            }
        } else {
            const reqBody = new FormData()
            reqBody.append("medicineName", medicineName)
            reqBody.append("batchNo", batchNo)
            reqBody.append("expDate", expDate)
            reqBody.append("price", price)
            reqBody.append("stockQuantity", remainingQuantity)

            // Make the API call to update the stock
            try {
                const result = await editStockAPI(_id, reqBody, reqHeader);

                if (result.status === 200) {
                    console.log(`${result.data.medicineName} added to Bill.`);
                } else {
                    alert(result.response.data);
                }
            } catch (error) {
                console.error("An error occurred while updating the stock:", error);
            }
        }

        setAddBillingData({
            medicineName: '', quantity: '', totalQuantityPrice: '', payableAmount: (addBillingData.payableAmount + totalQuantityPrice)
        })

    }

    const handleDeleteRequest = async () => {
        const reqHeader = {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        }
        const result = await deletependingMedcineRequestAPI(displayData._id, reqHeader)
        if (result.status === 200) {
            console.log(`${result.data.patId} has successfully Deleted from pending medicine request list....`)
        } else {
            alert(result.response.data)
        }
    }

    const handlePay = () => {
        handleDeleteRequest()
        toast.success("BILL PAID SUCCESSFULL...", { containerId: 'PhrmReq' });
        handleClose();
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

    useEffect(() => {
        handleStockList();
        setAddBillingData({ ...addBillingData, billingDate: getTodaysDate() })
    }, []);

    return (
        <>
            <button onClick={handleShow} className='btn btn-primary me-3'>
                <FaFileMedical />
            </button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' centered>
                <Modal.Header className='border-dark bg-dark' closeButton>
                    <Modal.Title className='fw-bold text-primary'>Medicine Billing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='departmentAdd d-flex justify-content-center'>
                        <div className='container p-1 w-100'>
                            {/* Adding Medicine Part */}
                            <div className='addMedicine table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                <table className='table table-hover text-center'>
                                    <thead className="table-dark" style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                        <tr>
                                            <th>Add Medicine</th>
                                            <th>Quantity</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="table-white">
                                            <td>
                                                <select className="form-select" id="addingMedicine" value={addBillingData.medicineName || ''} onChange={(e) => setAddBillingData({ ...addBillingData, medicineName: e.target.value })}>
                                                    <option value="" selected disabled>Select Medicine</option>
                                                    {allStock.map((stockItem) => (
                                                        <option key={stockItem.medicineName} value={stockItem.medicineName}>
                                                            {stockItem.medicineName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input type="number" className="form-control" id="medQnty" placeholder="Enter Quantity" value={addBillingData.quantity || ''} onChange={handleQuantity} />
                                                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                            </td>
                                            <td>
                                                <button className='btn btn-primary' onClick={handleAllMedicine}>
                                                    <IoIosAddCircle />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='w-100 d-flex justify-content-between align-items-center'>
                                    {displayData.medication && (
                                        <div className='d-flex flex-column'>
                                            <p className='fw-bold me-1'>Prescribed Medicines:</p>
                                            {displayData.medication.split(',').map((sentence, idx) => (
                                                <p key={idx}>&#8226; {sentence.trim()}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <hr className='border-3 border-dark' />
                            {/* Show Bill */}
                            <div className='form-group d-flex flex-column'>
                                <div><h2 className='text-center text-decoration-underline fw-bolder'>Medicine Bill</h2></div>
                                <div className='w-100 d-flex justify-content-between align-items-center'>
                                    {displayData?.patId && (
                                        <div className='d-flex align-items-center'>
                                            <p className='fw-bold me-1'>Patient Id:</p>
                                            <p className='text-decoration-underline'>{displayData.patId}</p>
                                        </div>
                                    )}
                                    {displayData?.patientName && (
                                        <div className='d-flex align-items-center'>
                                            <p className='fw-bold me-1'>Patient Name:</p>
                                            <p className='text-decoration-underline'>{displayData.patientName}</p>
                                        </div>
                                    )}
                                </div>
                                <div className='w-100 d-flex justify-content-between align-items-center'>
                                    {addBillingData?.billingDate && (
                                        <div className='d-flex align-items-center'>
                                            <p className='fw-bold me-1'>Billing Date:</p>
                                            <p className='text-decoration-underline'>{addBillingData.billingDate}</p>
                                        </div>
                                    )}
                                    {displayData?.doctorNameDep && (
                                        <div className='d-flex align-items-center'>
                                            <p className='fw-bold me-1'>Prescribed Doctor:</p>
                                            <p className='text-decoration-underline'>{displayData.doctorNameDep}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='showBill border table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                <table className='table table-hover text-center'>
                                    <thead className='table-success' style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                        <tr>
                                            <th>SLNO</th>
                                            <th>Medicine Name</th>
                                            <th>Batch No</th>
                                            <th>ExpiryDate</th>
                                            <th>Price Per Unit</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allBill?.length > 0 ? allBill?.map((item, index) => (
                                                <tr className="table-white" key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.medicineName}</td>
                                                    <td>{item.batchNo}</td>
                                                    <td>{item.expDate}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.totalQuantityPrice}</td>
                                                </tr>
                                            ))
                                                :
                                                (
                                                    <tr className='table-white'>
                                                        <td colSpan="7" className='text-danger fw-bold fs-6'>No Medicines Uploaded</td>
                                                    </tr>
                                                )
                                        }
                                        <tr className='fw-bold table-success'>
                                            <td colSpan={6}>PAYABLE AMOUNT :</td>
                                            <td colSpan={1}>&#x20B9; {addBillingData.payableAmount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className='bg-success fw-bold' variant="primary" onClick={handlePay}>
                        PAY BILL
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer containerId= 'PhrmBill' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    );
}

export default PharmacyBilling;
