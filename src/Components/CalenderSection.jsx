import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { calenderEventDeleteAPI, calenderEventFetchingAPI, calenderEventSavingAPI } from '../Services/allApi';
import { MdDelete } from "react-icons/md";

function CalendarSection() {
    const [show, setShow] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    const [token, setToken] = useState("");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (localStorage.getItem("existingEmployee") && token) {
            setToken(token);
        }
    }, []);

    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const event = events.find(item => item.date === date.toDateString()) || null;
            if (event) {
                // return event.eventTitles.map((title, index) => (
                //     <p key={index}>{title}</p>
                // ));
                return (<p>{event.eventTitles.join(",").slice(0, 6)} ...</p>)
            }
        }
    };

    const addEvent = async () => {
        if (newEventTitle.trim() !== '') {
            try {
                const reqHeader = {
                    "Content-Type": "application/json", "Authorization": `Bearer ${token}`
                }
                const res = await calenderEventSavingAPI({ date: date.toDateString(), eventTitles: newEventTitle, userId: JSON.parse(localStorage.getItem("existingEmployee"))._id }, reqHeader);
                if (res.status === 200) {
                    alert(`Event Added Successfully....`);
                    setNewEventTitle('');
                    handleClose();
                    handleCalendarEventsFetch();
                } else {
                    alert(res.response.data);
                }
            } catch (error) {
                console.error("Error adding calendar event:", error);
            }
        }
    };

    const handleCalendarEventsFetch = async () => {
        try {
            const res = await calenderEventFetchingAPI({ userId: JSON.parse(localStorage.getItem("existingEmployee"))._id });
            setEvents(res.data);
        } catch (error) {
            console.error("Error fetching calendar events:", error);
        }
    };

    const handleEventDelete = async (eachId, title) => {
        try {
            const reqHeader = {
                "Content-Type": "application/json", "Authorization": `Bearer ${token}`
            }
            const res = await (calenderEventDeleteAPI({ "id": eachId, "title": title }, reqHeader))
            if (res.status === 200) {
                alert("Event Deleted Successfully...")
                handleCalendarEventsFetch();
            }
        } catch (err) {
            console.error("Error Deleting calender event:", err)
        }
    }

    const filteredEvents = (events.filter(event => event.date === date.toDateString()));

    useEffect(() => {
        handleCalendarEventsFetch();
    }, []);

    return (
        <>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <div className='calendarBox'>
                    <Calendar className="w-100 fs-6 fw-bold" onChange={(value) => setDate(value)} value={date} tileContent={tileContent} onClickDay={handleShow} />
                </div>
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size='md' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{date.toDateString()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3 className='text-decoration-underline'>Events charted:</h3>
                    <div className="table-container table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        <table className='table table-hover' >
                            <colgroup>
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '60%' }} />
                                <col style={{ width: '20%' }} />
                            </colgroup>
                            <thead className='table-dark' style={{ position: 'sticky', top: '0', zIndex: '2' }}>
                                <tr className='text-info fw-bold'>
                                    <th>SL NO</th>
                                    <th>Events</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.length ? (
                                    filteredEvents.map((item) =>
                                        item.eventTitles.map((title, idx) => (
                                            <tr className="table-white" key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{title}</td>
                                                <td className='text-center'>
                                                    <Button className='me-4 bg-danger mb-1' size='sm' onClick={() => handleEventDelete(item._id, title)}>
                                                        <MdDelete />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-danger fw-bold">No events yet found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <hr />
                    <div className="form-group d-flex flex-column">
                        <label htmlFor="eventAdd" className="form-label mt-3 fs-3 text-decoration-underline">Add Events:</label>
                        <input type="text" className="form-control mb-3 border border-2" id="eventAdd" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
                        <Button variant="primary" className="btn btn-success" onClick={addEvent}>Add New Event</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CalendarSection;
