import React, { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { patientDispAPI, patientListAPI, prescriptionListAPI } from '../Services/allApi';
import { Button, Modal } from 'react-bootstrap';
import { BASEURL } from '../Services/baseUrl';
import { useSelector } from 'react-redux';
import dummyprofImg from '../Assets/dummyProfilePicture.png';


function PatientDetailDisplay({ allAppointments }) {

    const isEdited = useSelector((state) => state.response.isEdited)

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
    }

    const [prescriptionDetail, setprescriptionDetail] = useState([])
    const [patientData, setPatientData] = useState([])

    useEffect(() => {
        if (allAppointments) {
            fetchPrescriptionData();
            fetchPatientData();
        }
    }, [allAppointments, isEdited]);

    // Fetching Prescription Details
    const fetchPrescriptionData = async () => {
        const res = await prescriptionListAPI({ patientId: allAppointments.patientId })
        setprescriptionDetail(res.data)
    }

    // Fetching Patient Details
    const fetchPatientData = async () => {
        const res = await patientDispAPI({ role: 'PAT', patId: allAppointments.patId })
        setPatientData(res.data)
    }


    return (
        <>
            <Button onClick={handleShow} className='btn btn-info me-3' ><FaUserCircle /></Button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered>
                <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton>
                    <Modal.Title className='fw-bold text-primary'>Patient Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='addPrescription d-flex justify-content-center'>
                        <div className='container p-1 w-75'>
                            {/* Personal Details */}
                            <h4 className='fw-bold text-decoration-underline'>Patient Info</h4>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className='d-flex flex-column mt-3'>
                                        {/* Id */}
                                        <div className='fw-bold d-flex align-items-center'>
                                            <p className='w-25'>Id : </p>
                                            <p className='w-75 fs-5'>{patientData.patId}</p>
                                        </div>
                                        {/* Name*/}
                                        <div className='fw-bold d-flex align-items-center'>
                                            <p className='w-25'>Name :</p>
                                            <p className='w-75 fs-5'>{patientData.username}</p>
                                        </div>
                                        {/* Gender */}
                                        <div className='fw-bold d-flex align-items-center'>
                                            <p className='w-25'>Gender :</p>
                                            <p className='w-75 fs-5'>{patientData.gender}</p>
                                        </div>
                                        {/* Age*/}
                                        <div className='fw-bold d-flex align-items-center'>
                                            <p className='w-25'>Age :</p>
                                            <p className='w-75 fs-5'>{patientData.age}</p>
                                        </div>
                                        {/* Blood Group */}
                                        <div className='fw-bold d-flex align-items-center'>
                                            <p className='w-25'>Blood Group :</p>
                                            <p className='w-75 fs-5'>{patientData.bloodgroup}ve</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className='d-flex justify-content-center align-items-center border border-2'>
                                        {(patientData && patientData.profImg) && (
                                            <img width={'180px'} height={'180px'} src={`${BASEURL}/uploads/images/${patientData.profImg}`} alt="profile-pic" />
                                        )}
                                        {!patientData && <img width={'180px'} height={'180px'} src={dummyprofImg} alt="dummy-profile-pic" />}
                                    </div>
                                </div>
                            </div>


                            <hr />

                            {/* Medical Reports */}
                            <h4 className='fw-bold text-decoration-underline'>Medical Report</h4>
                            <div className='d-flex flex-column text-black mt-3' >
                                {
                                    prescriptionDetail?.length > 0 ? prescriptionDetail.sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate))
                                        .map((item, index) => {
                                            return (
                                                <>
                                                    <div className='form-group d-flex flex-column '>

                                                        {/* complaint */}
                                                        {(item.complaint) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'>Complaint : </p>
                                                                <p className='w-50'>{item.complaint}</p>
                                                            </div>
                                                            ) : ''}

                                                        {/* Review of Systems and Physical Examination*/}
                                                        {(item.reviewPhysical) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'>Review of Systems and Physical Examination : </p>
                                                                <p className='w-50'>{item.reviewPhysical}</p>
                                                            </div>
                                                            ) : ''}

                                                        {/* Diagonisation Findings*/}
                                                        {(item.diagonisationFinding) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'> Diagnostic Findings :</p>
                                                                <p className='w-50'>{item.diagonisationFinding}</p>
                                                            </div>
                                                            ) : ''}

                                                        {/* Medication giving for the patient*/}
                                                        {(item.medication) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'>Medication :</p>
                                                                <p className='w-50'>{item.medication}</p>
                                                            </div>
                                                            ) : ''}

                                                        {/* Assessment*/}
                                                        {(item.Assessment) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'>Assessment :</p>
                                                                <p className='w-50'>{item.Assessment}</p>
                                                            </div>
                                                            ) : ''}


                                                        {/* Plan*/}
                                                        {(item.plan) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'>Treatment Plan :</p>
                                                                <p className='w-50'>{item.plan}</p>
                                                            </div>
                                                            ) : ''}


                                                        {/* followup*/}
                                                        {(item.followup) ?
                                                            (<div className='d-flex align-items-center'>
                                                                <p className='fw-bold w-50'>Follow-Up :</p>
                                                                <p className='w-50'>{item.followup}</p>
                                                            </div>
                                                            ) : ''}

                                                        <div className='d-flex justify-content-between'>
                                                            {/* doctor Name */}
                                                            <div className='d-flex align-items-center'>
                                                                <p className='fw-bold'>Attended Doctor : </p>
                                                                <p className='ps-1 text-decoration-underline'>{item.doctorNameDep}</p>
                                                            </div>
                                                            {/* date */}
                                                            <div className='d-flex align-items-center'>
                                                                <p className='fw-bold'>Date : </p>
                                                                <p className='ps-1 text-decoration-underline'>{item.prescriptionDate}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </>
                                            )
                                        })
                                        :
                                        <p className='text-danger fs-3'>No Medical records </p>
                                }
                            </div>

                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default PatientDetailDisplay