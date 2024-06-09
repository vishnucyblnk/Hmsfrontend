import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { GrDocumentUpdate } from "react-icons/gr";
import { addReportAPI } from '../Services/allApi';
import { editResponse } from '../Redux/responseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';


function DiagLabAddReport({ empDet, eachReq }) {

    const dispatch = useDispatch();
    const isEdited = useSelector((state) => state.response.isEdited)

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
    }

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    const [reportt, setReportt] = useState({
        id: eachReq._id, lbDgReport: ""
    })

    const handleFile = (e) => {
        const reprt = e.target.files[0]
        setReportt({ ...reportt, lbDgReport: reprt })
    }

    const handleReport = async (e) => {
        e.preventDefault()
        const { id, lbDgReport } = reportt
        const reqBody = new FormData()
        reqBody.append("lbDgReport", lbDgReport)

        const reqHeader = {
            "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`
        }
        if (lbDgReport === "") {
            toast.warning("Add Report Before Uploading", { containerId: 'DgLbAdRep' })
        } else {
            try {
                const result = await addReportAPI(id, reqBody, reqHeader);

                if (result.status === 200) {
                    dispatch(editResponse(!isEdited));
                    toast.success("Successfully Added Report", { containerId: 'DgLbTst' });
                    // Modal closed
                    handleClose();
                } else {
                    toast.error("Failed to Add Report: " + result.response.data, { containerId: 'DgLbTst' }); 
                }
            } catch (error) {
                console.error("Error: " + error.message, { containerId: 'DgLbAdRep' }); 
            }
        }

    }

    return (
        <>
            <Button onClick={handleShow} className='btn btn-danger' ><GrDocumentUpdate /></Button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered >
                <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton>
                    <Modal.Title className='fw-bold text-primary'>Add Test Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='addDiagLabReport '>
                        <div className='d-flex flex-column mt-3'>
                            <div className='d-flex align-items-center'>
                                <p className='fs-5'>Patient (Id - Name) :</p>
                                <p className='fw-bold fs-5 ps-1 text-decoration-underline'>{eachReq.patId} - {eachReq.patName}</p>
                            </div>
                            <div className='d-flex align-items-center'>
                                <p className='fs-5'>Referred Doctor :</p>
                                <p className='fw-bold fs-5 ps-1 text-decoration-underline'>{eachReq.refDoc}</p>
                            </div>
                            <div className='d-flex align-items-center'>
                                <p className='fs-5'>Requested Date :</p>
                                <p className='fw-bold fs-5 ps-1 text-decoration-underline'>{eachReq.reqDate}</p>
                            </div>
                        </div>

                        <hr />
                        <div className='d-flex flex-column align-items-center'>
                            <p className='fs-5 fw-bold'>Tests To be Done :</p>
                            {(eachReq.reqTest).map((each, index) => (
                                <div key={index}>{each}</div>
                            ))}
                        </div>

                        <hr />

                        <div class="mb-3 d-flex flex-column">
                            <label htmlFor="formFile" className="form-label fs-5 fw-bold">Add Report :</label>
                            <input class="form-control border" type="file" id="formFile" accept='application/pdf' onChange={handleFile} />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold d-flex align-items-center gap-1' variant="primary" onClick={handleReport}>
                        <GrDocumentUpdate />  Upload Result
                    </Button>
                </Modal.Footer>
            </Modal >
            <ToastContainer containerId= 'DgLbAdRep' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default DiagLabAddReport