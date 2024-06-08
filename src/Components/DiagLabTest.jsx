import React, { useEffect, useState } from 'react';
import { FaList } from 'react-icons/fa';
import { PiListPlusFill } from 'react-icons/pi';
import { fetchDiaglabReqAPI } from '../Services/allApi';
import DiagLabAddReport from './DiagLabAddReport';
import DisplayReport from './DisplayReport';
import { useSelector } from 'react-redux';

function DiagLabTest({ empDet }) {

    const isEdited = useSelector((state) => state.response.isEdited)

    const [allTest, setallTest] = useState(null);
    const [selectedSideComponent, setselectedSideComponent] = useState(`Pending ${empDet.testType} Test Request`)

    const handleLinkClick = (names) => {
        setselectedSideComponent(names)
    }
    const mainLinks = [
        {
            icons: <FaList />,
            names: `Pending ${empDet.testType} Test Request`
        },
        {
            icons: <PiListPlusFill />,
            names: `All ${empDet.testType} Test Reports`
        }
    ]

    const handleAllDiagLabTest = async () => {
        // API Call
        const res = await fetchDiaglabReqAPI({ modalfor: empDet.modalfor })
        if (res.status === 200) {
            setallTest(res.data)
        } else {
            alert(res.response.data);
        }
    }

    useEffect(() => {
        handleAllDiagLabTest()
    }, [isEdited])

    const sortedTestswithZeroStatus = allTest?.filter((item) => item.status === 0).sort((a, b) => new Date(b.reqDate) - new Date(a.reqDate));

    const sortedTestswithOneStatus = allTest?.filter((item) => item.status === 1).sort((a, b) => new Date(b.reqDate) - new Date(a.reqDate));

    return (
        <>
            <div className='d-flex flex-column'>
                <div className='p-1' style={{ backgroundColor: 'rgb(185, 180, 180)' }}>
                    <h2 className='fw-bold ps-3' style={{ color: 'rgb(2, 105, 57)' }}>Manage {empDet.testType} Test</h2>
                </div>
                <div className='headPanel d-flex text-dark'>
                    {mainLinks.map(({ icons, names }) => {
                        return (
                            <button key={names} style={selectedSideComponent === names ? { backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(0, 255, 140)', cursor: 'pointer' } : {}} onClick={() => handleLinkClick(names)} type='button' className='headButton btn btn-primary fw-bold p-3 d-flex align-items-center flex-wrap'>{icons} <span className='ps-1'>{names}</span></button>
                        );
                    }
                    )}
                </div>
                {
                    selectedSideComponent === `Pending ${empDet.testType} Test Request` &&
                    <div className='pendingList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0px', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Requested Date</th>
                                    <th>Patient Name</th>
                                    <th>Test to be Done</th>
                                    <th>Add Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (sortedTestswithZeroStatus && sortedTestswithZeroStatus?.length > 0) ? (
                                        sortedTestswithZeroStatus.map((item, index) => {
                                            const [name, department] = item.refDoc.split('-')
                                            return (
                                                <tr key={index} className="table-white">
                                                    <td>{index + 1}</td>
                                                    <td>{item.reqDate}</td>
                                                    <td>
                                                        <div>{item.patName}</div>
                                                    </td>
                                                    <td>
                                                        {(item.reqTest).map((each, index) => (
                                                            <div key={index}>{each}</div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <DiagLabAddReport empDet={empDet} eachReq={item} />
                                                    </td>
                                                </tr>
                                            )
                                        }))
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="6" className='text-danger fw-bold fs-3'>No Pending Request</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>
                }
                {
                    selectedSideComponent === `All ${empDet.testType} Test Reports` &&
                    <div className='pendingList table-container table-responsive' style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        <table className='table table-hover text-center'>
                            <thead className="table-dark" style={{ position: 'sticky', top: '0px', zIndex: '2' }}>
                                <tr>
                                    <th>SL NO</th>
                                    <th>Requested Date</th>
                                    <th>Patient Id & Name</th>
                                    <th>Referred Doctor</th>
                                    <th>Report Release Date</th>
                                    <th>Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (sortedTestswithOneStatus && sortedTestswithOneStatus?.length > 0) ? (
                                        sortedTestswithOneStatus.map((item, index) => {
                                            const [name, department] = item.refDoc.split('-')
                                            return (
                                                <tr key={index} className="table-white">
                                                    <td>{index + 1}</td>
                                                    <td>{item.reqDate}</td>
                                                    <td>
                                                        <div>{item.patId}</div>
                                                        <div>{item.patName}</div>
                                                    </td>
                                                    <td>
                                                        <div>{name}</div>
                                                        <div>{department}</div>
                                                    </td>
                                                    <td>{item.relseRprtDate}</td>
                                                    <td>
                                                        <DisplayReport lbDgReport={item.lbDgReport} modalfor={item.modalfor} />
                                                    </td>
                                                </tr>
                                            )
                                        }))
                                        :
                                        (
                                            <tr className="table-white">
                                                <td colSpan="6" className='text-danger fw-bold fs-3'>No {empDet.testType} Reports </td>
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

export default DiagLabTest