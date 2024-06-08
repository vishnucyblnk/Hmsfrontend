import React, { useState } from 'react';
import { MdOutlineEditNote } from "react-icons/md";
import { Button, Modal } from 'react-bootstrap';
import { editDepartmentAPI } from '../Services/allApi';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editResponse } from '../Redux/responseSlice';


function AdminEditDepartment({ displayData }) {
    const [addDepartmentData, setaddDepartmentData] = useState({
        id: displayData._id, name: displayData.name, description: displayData.description
    })

    const dispatch = useDispatch();
    const isEdited = useSelector((state) => state.response.isEdited)


    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
        setaddDepartmentData({
            id: displayData._id, name: displayData.name, description: displayData.description
        })
    }

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        setaddDepartmentData({
            id: displayData._id, name: displayData.name, description: displayData.description
        });
    }, [displayData]);

    const handleEditDepartment = async (e) => {
        e.preventDefault()
        const { id, name, description } = addDepartmentData;
        if (!name || !description) {
            alert("Please edit any details for Updating")
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            const reqBody = new FormData()
            reqBody.append("name", name)
            reqBody.append("description", description)
            const result = await editDepartmentAPI(id, reqBody, reqHeader)
            if (result.status === 200) {
                dispatch(editResponse(!isEdited));
                alert(`${result.data.name} has successfully Updated....`)
                // modal closed
                handleClose()
            } else {
                alert(result.response.data)
            }
        }
    }
    return (
        <>
            <button onClick={handleShow} className='btn btn-primary me-3'><MdOutlineEditNote /></button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' Centered>
                <Modal.Header className='border-dark bg-dark' data-bs-theme="dark" closeButton>
                    <Modal.Title className='fw-bold text-primary'>Edit Department Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='departmentAdd d-flex justify-content-center'>
                        <div className='container p-1 w-75'>
                            <div className="form-group d-flex justify-content-around">
                                <label for="depName" className="w-50 form-label mt-3 fw-bolder">Department Name: </label>
                                <input type="text" className="form-control" id="depName" placeholder="Enter Department Name" fdprocessedid="47ab85" value={addDepartmentData.name} onChange={(e) => setaddDepartmentData({ ...addDepartmentData, name: e.target.value })} />
                            </div>
                            <div className="form-group d-flex justify-content-center">
                                <label for="depDesc" className="w-50 form-label mt-3 fw-bolder">Department Description: </label>
                                <input type="text" className="form-control" id="depDesc" placeholder="Enter Department Description" fdprocessedid="47ab85" value={addDepartmentData.description} onChange={(e) => setaddDepartmentData({ ...addDepartmentData, description: e.target.value })} />
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className='bg-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className='bg-success fw-bold' variant="primary" onClick={handleEditDepartment}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdminEditDepartment