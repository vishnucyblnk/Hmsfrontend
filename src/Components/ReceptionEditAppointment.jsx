import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MdOutlineEditNote } from "react-icons/md";
import { editAppointmentAPI, membersListAPI } from '../Services/allApi';
import { useDispatch, useSelector } from 'react-redux';
import { editResponse } from '../Redux/responseSlice';

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

  // Handling the user selected Patient
  const handlePatientSelect = (value) => {

    patients.map(item => {
      if (item.patientId === value) {
        setaddAppointmentData(prev => ({ ...prev, patientName: item.patientName, patientId: value }))
      }
    })
  }

  // Handling the user selected Doctor
  const handleDoctorSelect = (value) => {
    doctors.map(item => {
      if (item.docId === value) {
        setaddAppointmentData(prev => ({ ...prev, doctorName: item.docName, doctorId: value }))
      }
    })
  }

  // accesing the doctors list function and adding department to data
  const handleDepartmentChange = (value) => {
    setaddAppointmentData({ ...addAppointmentData, department: value })
    getDoctorsList(value)
  }

  // get DoctorList in the Corresponding Department
  const getDoctorsList = async (value) => {
    const res = await membersListAPI({ role: '', department: value })
    console.log(res.data);
    setDoctors(
      res.data.map((item) => ({
        docName: item.username,
        docEmail: item.email,
        doctorId: item._id
      }))
    )
  }

  // handling Editing Function

  const handleEditAppointment = async (e) => {
    e.preventDefault()
    const { id, patientId, patientName, department, doctorId, doctorName, appntDate } = addAppointmentData;
    if (!patientId || !patientName || !department || !doctorId || !doctorName || !appntDate) {
      alert("Please edit any details for Updating")
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
        alert(`has successfully Updated....`)
        // modal closed
        handleClose()
      } else {
        alert(result.response.data)
      }
    }
  }

  // useEffect hook to fetch doctors for the initial department
  useEffect(() => {
    if (addAppointmentData.department) {
      handleDepartmentChange(addAppointmentData.department);
    }
  }, [addAppointmentData.department]);


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
              <div className="form-group d-flex justify-content-center align-items-center">
                <label for="patGender" className="w-50 form-label mt-3 fw-bolder">Patient ID: </label>
                <select className="form-select mt-3 mb-1 border" id="patGender" fdprocessedid="85cko" value={addAppointmentData.patientId} onChange={(e) => handlePatientSelect(e.target.value)}>
                  <option selected disabled>Select Patient Id</option>
                  {
                    patients.map((item) => (
                      <option value={item.patientId}>{item.patId} - {item.patName}</option>
                    ))
                  }
                </select>
              </div>

              {/* Appointment Department */}
              <div className="form-group d-flex justify-content-center align-items-center">
                <label for="docDepartment" className="w-50 form-label mt-3 fw-bolder">Appointment Department: </label>
                <select className="form-select mt-3 mb-1 border" id="docDepartment" fdprocessedid="85cko" value={addAppointmentData.department} onChange={(e) => handleDepartmentChange(e.target.value)}>
                  <option selected disabled>Select Department</option>
                  {
                    allDepartment.map((item) => (
                      <option value={item.doctorId}>{item.name}</option>
                    ))
                  }
                </select>
              </div>

              {/* Doctor Id */}
              <div className="form-group d-flex justify-content-center align-items-center">
                <label for="patGender" className="w-50 form-label mt-3 fw-bolder">Doctor : </label>
                <select className="form-select mt-3 mb-1 border" id="patGender" fdprocessedid="85cko" value={addAppointmentData.doctorId} onChange={(e) => handleDoctorSelect(e.target.value)}>
                  <option selected disabled>Select Doctor</option>
                  {
                    doctors.map((item) => (
                      <option value={item.doctorId}>Dr. {item.docName}</option>
                    ))
                  }
                </select>
              </div>

              {/* Appointment Date */}
              <div className="form-group d-flex justify-content-center align-items-center">
                <label for="patDob" className="w-50 form-label mt-3 fw-bolder">Appointment Date : </label>
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

    </>
  )
}

export default ReceptionEditAppointment