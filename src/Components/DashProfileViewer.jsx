import React, { useEffect, useState } from 'react'
import { memberDispAPI, patientDispAPI } from '../Services/allApi';
import { BASEURL } from '../Services/baseUrl';
import dummyprofImg from '../Assets/dummyProfilePicture.png';


function DashProfileViewer() {
    const [memberDet, setMemberDet] = useState(null);
    const [role, setRole] = useState('');

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
            case 'PHM':
                return "Pharmacist";
            default:
                return "";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const existingEmployee = JSON.parse(localStorage.getItem("existingEmployee"));
                setRole(getLabel(existingEmployee.role));
                if (!existingEmployee || !existingEmployee.role || !existingEmployee.empId) {
                    throw new Error("Employee details not found in localStorage");
                }
                const res = await memberDispAPI({ role: existingEmployee.role, empId: existingEmployee.empId });
                setMemberDet(res.data);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        }
        fetchData();
    }, []);


    if (!memberDet) {
        return <div>Loading...</div>; // or any loading indicator
    }


    return (
        <>
            <div className='profileview d-flex flex-column justify-content-center'>
                <div className='container p-1 w-100'>
                    <div className="row">
                        <div className="col-lg-6">
                            {/* Id */}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Id : </p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.empId}</p>
                            </div>
                            {/* Name*/}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Name :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.username}</p>
                            </div>
                            {/* Email*/}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Email :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.email}</p>
                            </div>
                            {/* Designation*/}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Designation :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{role}</p>
                            </div>
                            {/* Department */}
                            {
                                (memberDet.role === "DOC") && (
                                    <div className='fw-bold d-flex align-items-center'>
                                        <p className='w-50'>Department :</p>
                                        <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.department}</p>
                                    </div>
                                )
                            }
                            {/* Gender */}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Gender :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.gender}</p>
                            </div>
                            {/* Age*/}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Age :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.age}</p>
                            </div>
                            {/* Dob*/}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Date of Birth :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.dob}</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className='d-flex justify-content-center align-items-center border border-2'>
                                {(memberDet && memberDet.profImg) && (
                                    <img width={'170px'} height={'170px'} src={`${BASEURL}/uploads/images/${memberDet.profImg}`} alt="profile-pic" />
                                )}
                                {!memberDet && <img width={'170px'} height={'170px'} src={dummyprofImg} alt="dummy-profile-pic" />}
                            </div>
                            {/* Blood Group */}
                            <div className='fw-bold d-flex align-items-center mt-1'>
                                <p className='w-50'>Blood Group :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.bloodgroup}ve</p>
                            </div>
                            {/* Address */}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Address :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.address}</p>
                            </div>
                            {/* phone */}
                            <div className='fw-bold d-flex align-items-center'>
                                <p className='w-50'>Phone No :</p>
                                <p className='w-50 fs-6 text-decoration-underline'>{memberDet && memberDet.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashProfileViewer