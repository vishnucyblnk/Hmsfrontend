import React, { useEffect, useState } from 'react';
import './StyleComp.css';
import { FaList } from "react-icons/fa";
import { deletePatientAPI, patientListAPI, patientRegisterAPI } from '../Services/allApi';
import DiagLabPatientReportDisplay from './DiagLabPatientReportDisplay';
import { useSelector } from 'react-redux';
import PatientDetailDisplay from './PatientDetailDisplay';

function NursePatient() {

    const isEdited = useSelector((state) => state.response.isEdited)

    const [selectedSideComponent,setselectedSideComponent] = useState('Patients List')
    const [allPatients,setallPatients] = useState([])
    const [addPatientData,setaddPatientData] = useState({
        username:'',role:'PAT',email:'',gender:'',dob:'',bloodgroup:'',phone:'',address:'',profImg:''
    })
    const [preview, setPreview] = useState("")

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (addPatientData.profImg) {
            setPreview(URL.createObjectURL(addPatientData.profImg))
        }
    }, [addPatientData.profImg])

    

    const blood = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

    useEffect(()=>{
        handlePatientList()
    },[isEdited])

    const handleLinkClick = (names)=>{
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons : <FaList />,
            names : 'Patients List'           
        }
    ]

    const handleAddPatient = async (e)=>{
        e.preventDefault()
        const {username,role,email,gender,dob,bloodgroup,phone,address,profImg} = addPatientData
        if(!username || !role || !email || !gender || !dob || !bloodgroup || !phone || !address || !profImg){
            alert("Please fill all details")
        }else{
            const reqBody = new FormData()
            reqBody.append("username",username)
            reqBody.append("role",role)
            reqBody.append("email",email)
            reqBody.append("gender",gender)
            reqBody.append("dob",dob)
            reqBody.append("bloodgroup",bloodgroup)
            reqBody.append("phone",phone)
            reqBody.append("address",address)
            reqBody.append("profImg",profImg)
            const reqHeader = {
                "content-Type": "multipart/form-data", "Authorization": `Bearer ${token}`
            }
            // api call
            const res = await patientRegisterAPI(reqBody, reqHeader)
            if(res.status === 200){
                alert(`${res.data.username} has successfully registered....`)
                // reset state
                setaddPatientData({
                    username:'',role:'PAT',email:'',gender:'',dob:'',bloodgroup:'',phone:'',address:'',profImg:''
                })
                setPreview("")
                handlePatientList()
            }else{
                alert(res.response.data)
            }
        }
    }

    const handlePatientList =async()=>{
        // api call
        const res = await patientListAPI(addPatientData)
        setallPatients(res.data)
    }

    // Delete a Patient

    const handleDelete = async (e, id) => {
        e.preventDefault()
        const reqHeader = {
            "Content-Type":"application/json", "Authorization":`Bearer ${token}`
        }
        const result = await deletePatientAPI(id,reqHeader);
        if (result.status === 200) {
            alert(`${result.data.username} has successfully Deleted....`)
            handlePatientList()
        } else {
            alert(result.response.data)
        }
    }

  return (
    <>
        <div className='d-flex flex-column'>
            <div className='p-1' style={{backgroundColor:'rgb(185, 180, 180)'}}>
                <h2 className='fw-bold ps-3' style={{color:'rgb(2, 105, 57)'}}>Manage Patient</h2>
            </div>
            <div className='headPanel d-flex text-dark'>
                {mainLinks.map(({icons,names})=>{
                        return(
                            <button style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className='headButton btn btn-primary fw-bold p-3 d-flex align-items-center flex-wrap'>{icons} <span className='ps-1'>{names}</span></button>
                        );}
                    )}
            </div>
            {
                selectedSideComponent === 'Patients List' &&
                <div className='PatientList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                <table className='table table-hover text-center'>
                    <thead className="table-dark" style={{ position: 'sticky', top: '0px' ,zIndex: '2'}}>
                        <tr>
                            <th>SL NO</th>
                            <th>Patient Id</th>
                            <th>Patient Name</th>
                            <th>Age</th>
                            <th>Sex</th>
                            <th>Blood Group</th>
                            <th>Birth Date</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allPatients?.length > 0 ? allPatients?.map((item,index)=>{
                                return(
                                    <tr className="table-white">
                                        <td>{index+1}</td>
                                        <td>{item.patId}</td>
                                        <td>{item.username}</td>
                                        <td>{item.age}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.bloodgroup}ve</td>
                                        <td>{item.dob}</td>
                                        <td className='d-flex justify-content-center'>
                                            <PatientDetailDisplay allAppointments={{ patId: item.patId ,patientId: item._id}} />
                                            <DiagLabPatientReportDisplay patientDet={{modalfor:'LabReq',patientId: item._id}}/>
                                            <DiagLabPatientReportDisplay patientDet={{modalfor:'DiagReq',patientId: item._id}}/>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            (
                                <tr className="table-white">
                                    <td colSpan="8" className='text-danger fw-bold fs-3'>No Patients</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                </div>
            }
        </div>

    </>
  )
}

export default NursePatient