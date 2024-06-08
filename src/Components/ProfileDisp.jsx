import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaUser } from "react-icons/fa";
import { memberDispAPI, patientDispAPI } from '../Services/allApi';
import { BASEURL } from '../Services/baseUrl';
import dummyprofImg from '../Assets/dummyProfilePicture.png';


function ProfileDisp({ memberData }) {
    const [memberDet, setMemberDet] = useState(null);
    const [show, setShow] = useState(false);
    const [role, setRole] = useState('');
    const [data, setData] = useState({
        role: memberData.role, patId: memberData.patId, empId: memberData.empId
    });

    const handleShow = () => {
        fetchData()
        setShow(true);
    }
    const handleClose = () => {
        setShow(false)
        setData({
            role: memberData.role, patId: memberData.patId, empId: memberData.empId
        })
    }

    // Fetching Patient Details
    const fetchData = async () => {
        try {
            let res;
            if (data.role === "PAT") {
                res = await patientDispAPI({ role: data.role, patId: data.patId });
            } else {
                res = await memberDispAPI({ role: data.role, empId: data.empId });
            }
            setMemberDet(res.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    }


    const getLabel = (rolee) => {
        switch (rolee) {
            case 'PAT':
                return "Patient";
            case 'DOC':
                return "Doctor";
            case 'NUR':
                return "Nurse";
            case 'REC':
                return "Receptionist";
            case 'ADM':
                return "Admin";
            case 'LAB':
                return "Laboratorist";
            case 'RAD':
                return "Radiologist";
            default:
                return "";
        }
    };

    useEffect(() => {
        fetchData();
        setRole(getLabel(data.role));
    }, [data]);

    return (
        <>
            <button onClick={handleShow} className='btn btn-info me-3' ><FaUser /></button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered>
                <Modal.Header closeButton className='border-dark bg-dark' data-bs-theme="dark">
                    <Modal.Title className='fw-bold text-primary'>PROFILE DETAILS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='profileview d-flex flex-column justify-content-center'>
                        <div className='container p-1 w-100'>
                            <div className='row'>
                                <div className='col-lg-8 '>
                                    {/* Id */}
                                    <div className='fw-bold d-flex align-items-center'>
                                        <p className='w-50'>{role} Id : </p>
                                        {
                                            (data.role === "PAT") ?
                                                (<p className='w-50 fs-5'>{memberDet && memberDet.patId}</p>)
                                                :
                                                (<p className='w-50 fs-5'>{memberDet && memberDet.empId}</p>)
                                        }
                                    </div>
                                    {/* Name*/}
                                    <div className='fw-bold d-flex align-items-center'>
                                        <p className='w-50'>{role} Name :</p>
                                        <p className='w-50 fs-5'>{memberDet && memberDet.username}</p>
                                    </div>
                                    {/* Email*/}
                                    <div className='fw-bold d-flex align-items-center'>
                                        <p className='w-50'>Email :</p>
                                        <p className='w-50 fs-5'>{memberDet && memberDet.email}</p>
                                    </div>
                                    {/* Designation*/}
                                    {
                                        (data.role !== "PAT") && (
                                            <div className='fw-bold d-flex align-items-center'>
                                                <p className='w-50'>Designation :</p>
                                                <p className='w-50 fs-5'>{role}</p>
                                            </div>
                                        )
                                    }

                                </div>
                                <div className='col-lg-4'>
                                    <div className='d-flex justify-content-center align-items-center border border-2'>
                                        {(memberDet && memberDet.profImg) && (
                                            <img width={'180px'} height={'180px'} src={`${BASEURL}/uploads/images/${memberDet.profImg}`} alt="profile-pic" />
                                        )}
                                        {!memberDet && <img width={'180px'} height={'180px'} src={dummyprofImg} alt="dummy-profile-pic" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='container p-1 w-75'>
                            {/* Personal Details */}
                            <div className='d-flex flex-column mt-3'>
                                {/* Department */}
                                {
                                    (data.role === "DOC") && (
                                        <div className='fw-bold d-flex align-items-center'>
                                            <p className='w-50'>Department :</p>
                                            <p className='w-50 fs-5'>{memberDet && memberDet.department}</p>
                                        </div>
                                    )
                                }

                                {/* Gender */}
                                <div className='fw-bold d-flex align-items-center'>
                                    <p className='w-50'>Gender :</p>
                                    <p className='w-50 fs-5'>{memberDet && memberDet.gender}</p>
                                </div>
                                {/* Age*/}
                                <div className='fw-bold d-flex align-items-center'>
                                    <p className='w-50'>Age :</p>
                                    <p className='w-50 fs-5'>{memberDet && memberDet.age}</p>
                                </div>
                                {/* Dob*/}
                                <div className='fw-bold d-flex align-items-center'>
                                    <p className='w-50'>Date of Birth :</p>
                                    <p className='w-50 fs-5'>{memberDet && memberDet.dob}</p>
                                </div>
                                {/* Blood Group */}
                                <div className='fw-bold d-flex align-items-center'>
                                    <p className='w-50'>Blood Group :</p>
                                    <p className='w-50 fs-5'>{memberDet && memberDet.bloodgroup}ve</p>
                                </div>
                                {/* Address */}
                                <div className='fw-bold d-flex align-items-center'>
                                    <p className='w-50'>Address :</p>
                                    <p className='w-50 fs-5'>{memberDet && memberDet.address}</p>
                                </div>
                                {/* phone */}
                                <div className='fw-bold d-flex align-items-center'>
                                    <p className='w-50'>Phone No :</p>
                                    <p className='w-50 fs-5'>{memberDet && memberDet.phone}</p>
                                </div>
                            </div>

                        </div>

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

export default ProfileDisp