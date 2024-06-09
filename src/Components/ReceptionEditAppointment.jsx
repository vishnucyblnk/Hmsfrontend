import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MdOutlineEditNote } from "react-icons/md";
import { editAppointmentAPI } from '../Services/allApi';
import { useDispatch, useSelector } from 'react-redux';
import { editResponse } from '../Redux/responseSlice';
import { ToastContainer, toast } from 'react-toastify';

function ReceptionEditAppointment({ displayData, patients, allDepartment }) {

  const dispatch = useDispatch();
  const isEdited = useSelector((state) => state.response.isEdited)

  const [addAppointmentData, setaddAppointmentData] = useState({
    id: displayData._id, patientId: displayData.patientId, patientName: displayData.patientName, department: displayData.department, doctorId: displayData.doctorId, doctorName: displayData.doctorName, appntDate: displayData.appntDate
  })

  const [token, setToken] = useState("");
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (localStorage.getItem("existingEmployee") && token) {
      setToken(token);
    }
  }, []);

  useEffect(()=>{
    setaddAppointmentData({
      id: displayData._id, patientId: displayData.patientId, patientName: displayData.patientName, department: displayData.department, doctorId: displayData.doctorId, doctorName: displayData.doctorName, appntDate: displayData.appntDate
    })
  },[displayData])

  const [doctors, setDoctors] = useState([])
  const [show, setShow] = useState(false);


  // limiting calender accessing previous days for appointment
  // Initialize state for minimum date
  const [minDate, setMinDate] = useState('');
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  // Update minimum date when component mounts
  useState(() => {
    setMinDate(today);
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false)
    setaddAppointmentData({
      id: displayData._id, patientId: displayData.patientId, patientName: displayData.patientName, department: displayData.department, doctorId: displayData.doctorId, doctorName: displayData.doctorName, appntDate: displayData.appntDate
    })
  }

  const handleEditAppointment = async (e) => {
    e.preventDefault()
    const { id, patientId, patientName, department, doctorId, doctorName, appntDate } = addAppointmentData;
    if (!patientId || !patientName || !department || !doctorId || !doctorName || !appntDate) {
      toast.warning("Please edit any details for Updating", { containerId: 'RecEdtApp' })
    } else {
      const reqHeader = {
        "Content-Type": "application/json", "Authorization": `Bearer ${token}`
      }
      const reqBody = new FormData()
      reqBody.append("patientId", patientId)
      reqBody.append("patientName", patientName)
      reqBody.append("department", department)
      reqBody.append("doctorId", doctorId)
      reqBody.append("doctorName", doctorName)
      reqBody.append("appntDate", appntDate)
      const result = await editAppointmentAPI(id, reqBody, reqHeader)
      if (result.status === 200) {
        dispatch(editResponse(!isEdited));
        // modal closed
        handleClose()
        toast.success(`Successfully Updated the Appointment and your Token No ${result.data.tokenNumber}`, { containerId: 'RecApp' })
      } else {
        toast.error(result.response.data, { containerId: 'RecApp' })
      }
    }
  }


  return (
    <>
      <button onClick={handleShow} className='btn btn-primary me-3'><MdOutlineEditNote /></button>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered>
        <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton>
          <Modal.Title className='fw-bold text-primary'>Edit Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='departmentAdd d-flex justify-content-center'>
            <div className='container p-1 w-75'>

              {/* Patient Id */}
              <div className='fw-bold d-flex align-items-center'>
                  <p className='w-50'>Patient ID & Name: </p>
                  <p className='w-50 fs-5'>{displayData.patId} - {displayData.patientName}</p>
              </div>

              {/* Appointment Department */}
              <div className='fw-bold d-flex align-items-center'>
                  <p className='w-50'>Appointment Department: </p>
                  <p className='w-50 fs-5'>{displayData.department}</p>
              </div>

              {/* Doctor Id */}
              <div className='fw-bold d-flex align-items-center'>
                  <p className='w-50'>Doctor : </p>
                  <p className='w-50 fs-5'>{displayData.doctorName}</p>
              </div>

              {/* Appointment Date */}
              <div className="form-group d-flex justify-content-center align-items-center">
                <label htmlFor="patDob" className="w-50 form-label mt-3 fw-bolder">Appointment Date : </label>
                <input type="date" className="form-control mt-3 mb-1 border" id="patDob" name="patDob" placeholder="Enter Appointment Date" fdprocessedid="47ab85" min={minDate} value={addAppointmentData.appntDate} onChange={(e) => setaddAppointmentData({ ...addAppointmentData, appntDate: e.target.value })} />
              </div>
            </div>


          </div>

        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button className='fw-bold' variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className='bg-success fw-bold' variant="primary" onClick={handleEditAppointment}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer containerId= 'RecEdtApp' position="bottom-right" autoClose={4000} theme="dark"/>
    </>
  )
}

export default ReceptionEditAppointment