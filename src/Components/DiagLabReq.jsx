import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BiBody } from "react-icons/bi";
import { GiTestTubes } from "react-icons/gi";
import { reqDiagLabAPI } from '../Services/allApi';
import { ToastContainer, toast } from 'react-toastify';

function DiagLabReq({ patientDet }) {

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);


    const [sendReq, setSendReq] = useState({
        modalfor: patientDet.modalfor,
        patientId: patientDet.patientId,
        patId: patientDet.patId,
        patName: patientDet.patName,
        reqDate: new Date().toJSON().slice(0, 10),
        refDoc: `${JSON.parse(localStorage.getItem("existingEmployee")).username}-${JSON.parse(localStorage.getItem("existingEmployee")).department}`,
        reqTest: []
    });

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setSendReq({
            modalfor: patientDet.modalfor,
            patientId: patientDet.patientId,
            patId: patientDet.patId,
            patName: patientDet.patName,
            reqDate: new Date().toJSON().slice(0, 10),
            refDoc: '',
            reqTest: []
        });
        setShow(false);
    };

    const labOptions = [
        { Hematology: ['Complete Blood Count (CBC)', 'Blood Smear Examination'] },
        { ClinicalChemistry: ['Basic Metabolic Panel (BMP)', 'Liver Function Tests (LFTs)', 'Electrolyte Panel (Sodium, Potassium, Chloride, Bicarbonate)'] }
    ];

    const diagOptions = [
        { 'X-ray': ['Chest', 'Abdomen', 'Extremities (e.g, arms, legs)', 'Skull', 'Spine', 'Joints'] },
        { 'CT-Scan': ['Head (Brain, Sinuses)', 'Chest (Lungs, Heart, Thoracic Spine)', 'Abdomen (Liver, Gallbladder, Pancreas, Kidneys, Spleen)', 'Pelvis (Pelvic Organs, Bladder)', 'Spine (Cervical, Thoracic, Lumbar)', 'Extremities (for evaluating fractures, tumors'] }
    ];

    // handling the test options
    const handleTest = (e) => {
        e.preventDefault()
        const { value, checked } = e.target;
        if (checked) {
            setSendReq((prev) => ({ ...prev, reqTest: [...prev.reqTest, value] }));
        } else {
            setSendReq((prev) => ({ ...prev, reqTest: prev.reqTest.filter(item => item !== value) }));
        }
    };

    // handling the request for test
    const handleRequest = async () => {
        if ((sendReq.reqTest.length) === 0) {
            toast.warning('Please add at least one test before sending request', { containerId: 'DgLbReq' });
        } else {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            // API call
            const res = await reqDiagLabAPI(sendReq, reqHeader);
            if (res.status === 200) {
                toast.success(`Request Sent Successfully`, { containerId: 'DgLbReq' });
                handleClose();
            } else {
                toast.error(res.response.data, { containerId: 'DgLbReq' });
            }
        }
    };

    const handleDocDate = () => {
        let currentDate = new Date().toJSON().slice(0, 10);  // "2022-06-17"
        let existingEmployee = JSON.parse(localStorage.getItem("existingEmployee"));
        setSendReq(prev => ({
            ...prev,
            refDoc: `${existingEmployee.username}-${existingEmployee.department}`,
            reqDate: currentDate
        }));
    }
    useEffect(() => {
        if (patientDet) {
            handleDocDate()
        }
    }, [patientDet])

    return (
        <>
            <button onClick={handleShow} className={patientDet.modalfor === 'DiagReq' ? 'btn btn-warning text-dark' : 'btn btn-danger text-dark'} >
                {patientDet.modalfor === 'DiagReq' ? <BiBody /> : <GiTestTubes />}
            </button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='lg' centered>
                <Modal.Header className='border-dark' closeButton>
                    <Modal.Title className='fw-bold text-primary'>
                        {patientDet.modalfor === 'DiagReq' ? 'Diagnostic Requisition Form' : 'Lab Requisition Form'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(patientDet.modalfor === 'LabReq') &&
                        <div className='addPrescription d-flex justify-content-center'>
                            <div className='container p-1 w-75'>
                                {labOptions.map((category, index1) => (
                                    <div className='pb-3' key={index1}>
                                        {Object.entries(category).map(([catName, eachTest]) => (
                                            <div key={catName}>
                                                <h5 className='fw-bold text-decoration-underline'>{catName}</h5>
                                                {eachTest.map((item, index3) => (
                                                    <div className="d-flex align-item-center" key={index3}>
                                                        <input className='me-2' id={item} type='checkbox' value={`${catName}-${item}`} onChange={(e) => handleTest(e)} />
                                                        <label htmlFor={item}>{item}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {(patientDet.modalfor === 'DiagReq') &&
                        <div className='addPrescription d-flex justify-content-center'>
                            <div className='container p-1 w-75'>
                                {diagOptions.map((category, index1) => (
                                    <div className='pb-3' key={index1}>
                                        {Object.entries(category).map(([catName, bodyPart]) => (
                                            <div key={catName}>
                                                <h5 className='fw-bold text-decoration-underline'>{catName}</h5>
                                                {bodyPart.map((item, index3) => (
                                                    <div className="d-flex align-item-center" key={index3}>
                                                        <input className='me-2' id={item} type='checkbox' value={`${catName}-${item}`} onChange={(e) => handleTest(e)} />
                                                        <label htmlFor={item}>{item}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer className='border-dark'>
                    <Button className='fw-bold' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className='fw-bold' variant="primary" onClick={handleRequest}>
                        Send Request
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer containerId= 'DgLbReq' position="bottom-right" autoClose={4000} theme="dark" />
        </>
    );
}

export default DiagLabReq;
