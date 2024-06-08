import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { GrDocumentPdf } from "react-icons/gr";
import { BASEURL } from '../Services/baseUrl';

function DisplayReport(reportt) {
    const [show, setShow] = useState(false);
    const handleShow = (lbDgReport) => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false);
    };


    return (
        <>
            <button onClick={handleShow} className='btn btn-info'> <GrDocumentPdf /> </button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' centered>
                <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton>
                    <Modal.Title className='fw-bold text-primary'>
                        {reportt.modalfor === 'LabReq' ? "Laboratory Report" : "Diagnostic Report"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='pdf d-flex justify-content-center align-items-center'>

                    <iframe className="pdf"
                        src={reportt?.lbDgReport ? `${BASEURL}/uploads/pdfs/${reportt.lbDgReport}` : "PDF REPORT"}
                        width="800" height="400">
                    </iframe>

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

export default DisplayReport