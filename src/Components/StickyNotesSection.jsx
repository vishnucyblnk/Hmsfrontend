import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { noteEventSavingAPI, stickyNotesDeleteAPI, stickyNotesFetchingAPI } from '../Services/allApi';
import { MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';

function StickyNotesSection() {


    const [newStickyNotes, setnewStickyNotes] = useState('');
    const [allNotes, setAllNotes] = useState([]);


    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);


    const addNotes = async () => {
        if (newStickyNotes.trim !== '') {
            try {
                const reqHeader = {
                    "Content-Type": "application/json", "Authorization": `Bearer ${token}`
                }
                const res = await noteEventSavingAPI({ notes: newStickyNotes, userId: JSON.parse(localStorage.getItem("existingEmployee"))._id }, reqHeader)
                if (res.status === 200) {
                    toast.success(`Note Added Successfully....`, { containerId: 'stickyNotesToast' });
                    setnewStickyNotes('');
                    handleStickyNotesFetch();
                } else {
                    toast.error(res.response.data, { containerId: 'stickyNotesToast' });
                }
            } catch (error) {
                console.error("Error adding Notes:", error);
            }
        }
    }

    const handleStickyNotesFetch = async () => {
        try {
            const res = await stickyNotesFetchingAPI({ userId: JSON.parse(localStorage.getItem("existingEmployee"))._id });
            setAllNotes(res.data)
        } catch (error) {
            console.error("Error fetching Sticky Notes:", error);
        }
    };


    const handleStickyNoteDelete = async (eachId, eachNote) => {
        try {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            const res = await (stickyNotesDeleteAPI({ "id": eachId, "eachNote": eachNote }, reqHeader))
            if (res.status === 200) {
                toast.success("Sticky Note Deleted Successfully...", { containerId: 'stickyNotesToast' })
                handleStickyNotesFetch();
            }
        } catch (err) {
            console.error("Error Deleting Sticky Note :", err)
        }
    }


    useEffect(() => {
        handleStickyNotesFetch();
    }, []);

    return (
        <>
            <div className='d-flex flex-column justify-content-center align-items-center '>
                <textarea type="text" className="form-control mb-3 border border-2" placeholder='Add New Sticky Notes.....' id="stickyNotesAdd" value={newStickyNotes} onChange={(e) => setnewStickyNotes(e.target.value)} />
                <Button variant="success" className='w-100' size='sm' onClick={addNotes}>Add Note</Button>
            </div>
            <hr />
            <div className="table-container table-Responsive" style={{ maxHeight: '170px', overflowY: 'auto' }}>
                <table className='table table-hover'>
                    <colgroup>
                        <col style={{ width: '80%' }} />
                        <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead className='table-dark' style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                        <tr className='text-info fw-bold'>
                            <th>Notes</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allNotes.length ? (
                            allNotes.map((item) =>
                                item.notes.map((eachNote, idx) => (
                                    <tr className="table-white" key={idx}>
                                        <td>{eachNote}</td>
                                        <td className='text-center'>
                                            <Button className='me-4 bg-danger mb-1' size='sm' onClick={() => handleStickyNoteDelete(item._id, eachNote)}>
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-danger fw-bold">No Notes Added</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
            <ToastContainer containerId='stickyNotesToast' position="bottom-right" autoClose={4000} closeOnClick theme="dark" />
        </>
    )
}

export default StickyNotesSection 