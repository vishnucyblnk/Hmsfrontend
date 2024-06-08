import React from 'react'
import CalenderSection from './CalenderSection'
import DashProfileViewer from './DashProfileViewer'
import StickyNotesSection from './StickyNotesSection'
import NotificationSection from './NotificationSection'

function MainDashboard() {
    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-8 border p-1'>
                        <DashProfileViewer />
                    </div>
                    <div className='col-md-4 border p-1' >
                        <StickyNotesSection />
                    </div>
                    <div className='col-md-6 border p-1'>
                        <CalenderSection />
                    </div>
                    <div className='col-md-6 border p-1'>
                        <NotificationSection />
                    </div>
                </div>
            </div>

        </>
    )
}

export default MainDashboard