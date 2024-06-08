import React, { useEffect, useState } from 'react';
import { RiBodyScanFill } from "react-icons/ri";
import { GrDocumentTest } from "react-icons/gr";
import { Button, Modal } from 'react-bootstrap';
import { fetchDiaglabReqAPI } from '../Services/allApi';
import DisplayReport from './DisplayReport';

function DiagLabPatientReportDisplay({ patientDet }) {
    const [allReport, setallReport] = useState([]);
    const [show, setShow] = useState(false);

    const handleShow = () => {
        handleAllDiagLabTest()
        setShow(true);
    }
    const handleClose = () => {
        setShow(false)
    }

    const handleAllDiagLabTest = async () => {
        // API Call
        const res = await fetchDiaglabReqAPI({ modalfor: patientDet.modalfor, patientId: patientDet.patientId, status: patientDet.status })
        setallReport(res.data)
    }


    return (
        <>
            <button onClick={handleShow} className={patientDet.modalfor === 'DiagReq' ? 'btn btn-warning text-dark me-3' : 'btn btn-danger text-dark me-3'} >
                {patientDet.modalfor === 'DiagReq' ? <RiBodyScanFill /> : <GrDocumentTest />}
            </button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' centered>
                <Modal.Header className='border-dark bg-dark ' data-bs-theme="dark" closeButton>
                    <Modal.Title className='fw-bold text-primary '>
                        {patientDet.modalfor === 'LabReq' ? 'Laboratory Reports' : 'Diagnostic Reports'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='addPrescription d-flex justify-content-center'>
                        <div className='container p-1 w-75'>
                            {
                                allReport.sort((a, b) => new Date(b.relseRprtDate) - new Date(a.relseRprtDate)).map((item, index) => {
                                    return (
                                        <>
                                            <div className='d-flex flex-column mt-3'>

                                                {/* report released date */}
                                                <div className='d-flex align-items-center'>
                                                    <p className='fw-bold w-50'>Report Released Date : </p>
                                                    <p className='w-50 text-decoration-underline'>{item.relseRprtDate}</p>
                                                </div>

                                                {/* requested date */}
                                                <div className='d-flex align-items-center'>
                                                    <p className='fw-bold w-50'>Requested Date : </p>
                                                    <p className='w-50 text-decoration-underline'>{item.reqDate}</p>
                                                </div>

                                                {/* Referred Doctor */}
                                                <div className='d-flex align-items-center'>
                                                    <p className='fw-bold w-50'>Referred Doctor :</p>
                                                    <p className='w-50'>{item.refDoc}</p>
                                                </div>

                                                {/* test Done */}
                                                <div className='d-flex align-items-center'>
                                                    <p className='fw-bold w-50'>Test Done :</p>
                                                    {(item.reqTest).map((each, index) => (
                                                        <p className='w-50' key={index}>{each}</p>
                                                    ))}
                                                </div>

                                                {/* Report display */}
                                                <div className='d-flex align-items-center'>
                                                    <p className='fw-bold w-50'>Report :</p>
                                                    <div className='w-50 rounded border border-1 border-info d-flex justify-content-center'><DisplayReport lbDgReport={item.lbDgReport} modalfor={item.modalfor} /></div>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='border-dark bg-dark'>
                    <Button className='fw-bold ' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DiagLabPatientReportDisplay