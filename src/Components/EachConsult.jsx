import React, { useEffect, useState } from 'react';
import { FaNotesMedical, FaUserCircle } from 'react-icons/fa';
import PrescriptionAdding from './PrescriptionAdding';
import { Button, Modal } from 'react-bootstrap';

function EachConsult({ patient }) {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(true);
    }
    const handleClose = () => {
        setShow(false)
    }
    const [selectedSideComponent, setselectedSideComponent] = useState("Add Medical Report")
    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }

    // retrieving appointment detail from local storage
    const [appointmentDet, setAppointmentDet] = useState(null);
    const retrieveSelectedAppointment = () => {
        setAppointmentDet({
            appntDate: patient.appntDate, department: patient.department,
            doctorId: patient.doctorId, doctorName: patient.doctorName, patId: patient.patId, patientId: patient.patientId, patientName: patient.patientName, tokenNumber: patient.tokenNumber
        });
    };
    useEffect(() => {
        retrieveSelectedAppointment();
    }, []);



    const mainLinks = [
        {
            icons: <FaNotesMedical />,
            names: "Add Medical Report"
        }
    ]
    return (
        <>
            <button onClick={handleShow} className='btn btn-primary me-3' ><FaNotesMedical /></button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='xl' Centered>
                <Modal.Header closeButton className='border-dark bg-dark' data-bs-theme="dark">
                    <Modal.Title className='fw-bold text-primary'>Medical Report : {(appointmentDet) ? (`(${appointmentDet.patId} - ${appointmentDet.patientName})`) : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex flex-column p-0'>
                        {(appointmentDet) && (
                            <>
                                {selectedSideComponent === `Add Medical Report` &&
                                    <PrescriptionAdding allAppointments={appointmentDet} />
                                }
                            </>
                        )}
                    </div>

                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default EachConsult