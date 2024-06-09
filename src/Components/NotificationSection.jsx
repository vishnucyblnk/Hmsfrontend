import React, { useEffect, useState } from 'react';
import { showNotificationAPI } from '../Services/allApi';

function StickyNotesSection() {
    const [allNotif, setAllNotif] = useState([]);

    const handleAllNotification = async () => {
        try {
            const res = await showNotificationAPI();
            setAllNotif(res.data)
        } catch (error) {
            console.error("Error fetching Notifications:", error);
        }
    };


    useEffect(() => {
        handleAllNotification();
    }, []);

    return (
        <>
            <div className="table-container table-Responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className='table table-hover'>
                    <colgroup>
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '80%' }} />
                    </colgroup>
                    <thead className='table-dark' style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                        <tr className='text-info fw-bold'>
                            <th>Date</th>
                            <th>Notifications</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allNotif.length ? (
                            allNotif.map((item) =>
                                item.descriptions.map((eachNotif, idx) => (
                                    <tr className="table-white" key={idx}>
                                        <td>{item.date}</td>
                                        <td>{eachNotif}</td>
                                    </tr>
                                ))
                            )
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-danger fw-bold">No Notifications</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </>
    )
}

export default StickyNotesSection 