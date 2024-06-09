import React, { useEffect, useState } from 'react'
import { prescriptionListAPI, registerPrescriptionAPI } from '../Services/allApi';
import PatientDetailDisplay from './PatientDetailDisplay';
import DiagLabReq from './DiagLabReq';
import DiagLabPatientReportDisplay from './DiagLabPatientReportDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { editResponse } from '../Redux/responseSlice';
import { ToastContainer, toast } from 'react-toastify';

function PrescriptionAdding({ allAppointments }) {

    const dispatch = useDispatch();
    const isEdited = useSelector((state) => state.response.isEdited)

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    const [addPrescriptionData, setaddPrescriptionData] = useState({
        patientId: allAppointments.patientId, doctorNameDep: `${JSON.parse(localStorage.getItem("existingEmployee")).username}-${JSON.parse(localStorage.getItem("existingEmployee")).department}`, complaint: '', reviewPhysical: '', diagonisationFinding: '', medication: '', assessment: '', plan: '', followup: '', prescriptionDate: new Date().toJSON().slice(0, 10)
    })

    // Handling the user selected Patient
    const handleDocDate = () => {
        let currentDate = new Date().toJSON().slice(0, 10);  // "2022-06-17"
        setaddPrescriptionData(prev => ({ ...prev, patientId: allAppointments.patientId, doctorNameDep: `${JSON.parse(localStorage.getItem("existingEmployee")).username}-${JSON.parse(localStorage.getItem("existingEmployee")).department}`, prescriptionDate: currentDate }))
    }

    // handle new prescription of patients
    const handleAddPrescription = async (e) => {
        e.preventDefault()
        const { patientId, doctorNameDep, complaint, reviewPhysical, medication, assessment, prescriptionDate } = addPrescriptionData

        if (!patientId || !doctorNameDep || !complaint || !reviewPhysical || !medication || !assessment || !prescriptionDate) {
            toast.warning("Please fill Complete Details ", { containerId: 'PrescAdd' })
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await registerPrescriptionAPI(addPrescriptionData, reqHeader)
            if (res.status === 200) {
                dispatch(editResponse(!isEdited));
                toast.success("Prescription Added", { containerId: 'PrescAdd' })
                // reset data
                setaddPrescriptionData({
                    patientId: '', doctorNameDep: '', complaint: '', reviewPhysical: '', diagonisationFinding: '', medication: '', assessment: '', plan: '', followup: '', prescriptionDate: ''
                })
            } else {
                toast.error(res.respond.data, { containerId: 'PrescAdd' })
            }
        }
    }

    useEffect(() => {
        if (allAppointments) {
            handleDocDate()
        }
    }, [allAppointments, addPrescriptionData])


    return (
        <>
            <div className='addPrescription d-flex justify-content-center'>
                <div className='container p-1 w-75'>
                    {/* Patient Name */}
                    <div className="mt-2 mb-2 border border-2 border-dark d-flex justify-content-around align-items-center">
                        <div className='w-50 p-1 d-flex justify-content-center align-items-center'>
                            <h5 className=' fw-bold text-dark me-3'>Patient Name: </h5>
                            <h2 className="ps-1 text-center fw-bold">{allAppointments.patientName}</h2>
                        </div>
                        <div className='w-50 border-start border-2 border-dark p-1 d-flex gap-1 justify-content-around align-items-center flex-wrap'>
                            <h5 className=' fw-bold text-dark me-3'>Details: </h5>
                            <div className='d-flex justify-content-end align-items-center'>
                                <PatientDetailDisplay allAppointments={allAppointments} />
                                <DiagLabPatientReportDisplay patientDet={{ modalfor: 'DiagReq', patientId: allAppointments.patientId }} />
                                <DiagLabPatientReportDisplay patientDet={{ modalfor: 'LabReq', patientId: allAppointments.patientId }} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mb-2 d-flex justify-content-around align-items-center">
                        <div className='w-100 p-1 d-flex gap-2 justify-content-end align-items-center'>
                            <DiagLabReq patientDet={{ modalfor: 'DiagReq', patientId: allAppointments.patientId, patId: allAppointments.patId, patName: allAppointments.patientName }} />
                            <DiagLabReq patientDet={{ modalfor: 'LabReq', patientId: allAppointments.patientId, patId: allAppointments.patId, patName: allAppointments.patientName }} />
                        </div>
                    </div>

                    {/* Present Chief Complaint */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Chief Complaint : </label>
                        <textarea className="form-control  mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Description of the reason for the patients visit ond summary of symptoms/complaints' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, complaint: e.target.value })}></textarea>
                    </div>

                    {/* Review of Systems and Physical Examination: */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Review of Systems and Physical Examination : </label>
                        <textarea className="form-control  mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Enter Doctors Observations after checking Patient' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, reviewPhysical: e.target.value })}></textarea>
                    </div>

                    {/* Diagnostic Findings: */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Diagnostic Findings : </label>
                        <textarea className="form-control  mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Enter Diagonisation Findings if any' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, diagonisationFinding: e.target.value })}></textarea>
                    </div>

                    {/* Medication giving for the patient for present condition */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Medication : </label>
                        <textarea className="form-control mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Enter medications for the patient' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, medication: e.target.value })}></textarea>
                    </div>

                    {/* Assessment after examination */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Assessment / Result of Findings : </label>
                        <textarea className="form-control mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Enter assessment / result after examination' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, assessment: e.target.value })}></textarea>
                    </div>

                    {/* plan after examination */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Treatment Plan : </label>
                        <textarea className="form-control mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Enter Plan after examination' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, plan: e.target.value })}></textarea>
                    </div>

                    {/* followup for patient */}
                    <div className="form-group d-flex justify-content-around align-items-center">
                        <label htmlFor="exampleTextarea" className="w-50 form-label mt-3 fw-bolder">Follow-up : </label>
                        <textarea className="form-control mb-1 border ps-1" id="exampleTextarea" rows="3" placeholder='Enter followUp details if any' onChange={(e) => setaddPrescriptionData({ ...addPrescriptionData, followup: e.target.value })}></textarea>
                    </div>

                    <div className='pt-4'>
                        <button onClick={handleAddPrescription} type='button' className='btn btn-primary p-3 w-100'>Add Report</button>
                    </div>
                </div>
            </div>
            <ToastContainer containerId= 'PrescAdd' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    )
}

export default PrescriptionAdding