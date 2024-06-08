import { BASEURL } from "./baseUrl";
import { commonAPI } from "./commonApi";

// login API
    export const loginAPI = async (employee)=>{
        return await commonAPI("POST",`${BASEURL}/employee/login`,employee,"")
    }

// register API 
    export const registerAPI = async (employee,header)=>{
        return await commonAPI("POST",`${BASEURL}/employee/register`,employee,header)
    }

// register department API
   export const registerDepartmentAPI = async(department,reqHeader)=>{
        return await commonAPI("POST",`${BASEURL}/department/register`,department,reqHeader)
   }

// all DepartmentList API
    export const departmentListAPI = async (department)=>{
        return await commonAPI("POST",`${BASEURL}/department/departmentList`,department,"")
    }



// all membersList API
    export const membersListAPI = async (employee)=>{
        return await commonAPI("POST",`${BASEURL}/admin/membersList`,employee,"")
    }

// a members Details API
    export const memberDispAPI = async (employee)=>{
        return await commonAPI("POST",`${BASEURL}/admin/memberdisp`,employee,"")
    }


// register patient API
    export const patientRegisterAPI = async (patient,header)=>{
        return await commonAPI("POST",`${BASEURL}/patient/register`,patient,header)
    }
// all patientList API
    export const patientListAPI = async (patient)=>{
        return await commonAPI("POST",`${BASEURL}/patient/patientList`,patient,"")
    }

// a Patient Details API
    export const patientDispAPI = async (patient)=>{
        console.log("hi",patient);
        return await commonAPI("POST",`${BASEURL}/patient/patientdisp`,patient,"")
    }

// registering appointment for a patient with a doctor
    export const registerAppointmentAPI = async(appointmentData,reqHeader)=>{
        return await commonAPI("POST",`${BASEURL}/appointment/register`,appointmentData,reqHeader)
    }

// allAppointmentList API
    export const appointmentListAPI = async(appointmentOf)=>{
        return await commonAPI("POST",`${BASEURL}/appointment/appointmentList`,appointmentOf,"")
    }

// register new prescription of a patient API
    export const registerPrescriptionAPI = async(prescription,reqHeader)=>{
        return await commonAPI("POST",`${BASEURL}/doctor/newPrescription`,prescription,reqHeader)
    }

// prescription of a particular patient
    export const prescriptionListAPI = async(Patient)=>{
        return await commonAPI("POST",`${BASEURL}/doctor/prescriptionList`,Patient,"")
    }
// BloodBank details retrieving
    export const bloodBankAPI = async(search)=>{
        return await commonAPI("POST",`${BASEURL}/bloodbank/bloodDetails`,search,"")
    }

// laboratory Diagnostic requests
    export const reqDiagLabAPI = async(reqForm,reqHeader)=>{
        return await commonAPI("POST",`${BASEURL}/labDiag/req`,reqForm,reqHeader)
    }

// fetching laboratory Diagnostic requests
    export const fetchDiaglabReqAPI = async(reqForm)=>{
        return await commonAPI("POST",`${BASEURL}/labDiag/fetchReq`,reqForm,"")
    }

// add laboratory diagnosis report API
    export const addReportAPI = async (reqId,reqBody,reqHeader)=>{
        return await commonAPI("PUT",`${BASEURL}/labDiag/labDiagReport/${reqId}`,reqBody,reqHeader)
    }

// register stock API
    export const registerStockAPI = async(stock,reqHeader)=>{
        return await commonAPI("POST",`${BASEURL}/pharmacy/register`,stock,reqHeader)
    }

// all StockList API
    export const stockListAPI = async (stock)=>{
        return await commonAPI("GET",`${BASEURL}/pharmacy/stockList`,"","")
    }
// all Pending Request for patient Medicine
    export const pendingMedicineRequestListAPI = async()=>{
        return await commonAPI("GET",`${BASEURL}/pharmacy/pendingRequest`,"","")
    }

// Dashboard
    // Calender section
        // Calender event Adding
        export const calenderEventSavingAPI = async(eve,reqHeader)=>{
            return await commonAPI("POST",`${BASEURL}/dashboard/eventAdd`,eve,reqHeader)
        } 

        // Calender event fetching
        export const calenderEventFetchingAPI = async(eve)=>{
            return await commonAPI("POST",`${BASEURL}/dashboard/eventFetch`,eve,"")
        }

        // delete calender event API
        export const calenderEventDeleteAPI = async(eve,reqHeader)=>{
            return await commonAPI("POST",`${BASEURL}/dashboard/removeEvent`,eve,reqHeader)
        }
    // Sticky Notes Section
        //Sticky Notes Adding
        export const noteEventSavingAPI = async(nte,reqHeader)=>{
            return await commonAPI("POST",`${BASEURL}/dashBoard/stickyNoteAdd`,nte,reqHeader)
        }

        // Sticky Notes fetching
        export const stickyNotesFetchingAPI = async(nte)=>{
            return await commonAPI("POST",`${BASEURL}/dashboard/stickyNoteFetch`,nte,"")
        }
        
        // delete Sticky Notes API
        export const stickyNotesDeleteAPI = async(nte,reqHeader)=>{
            return await commonAPI("POST",`${BASEURL}/dashboard/removeStickyNote`,nte,reqHeader)
        }

    // Notification Section
        // add Notification API
            export const addNotificationAPI = async(notification,reqHeader)=>{
                return await commonAPI("POST",`${BASEURL}/notification/add`,notification,reqHeader)
            }

        // show Notification API
            export const showNotificationAPI = async()=>{
                return await commonAPI("GET",`${BASEURL}/notification/showNotification`,"","")
            }

        // delete Notification API
        export const deleteNotificationAPI = async (description,reqHeader)=>{
            return await commonAPI("POST",`${BASEURL}/notifcation/remove`,description,reqHeader)
        }

// ---------------------------------------EDITING SECTION----------------------------------------------------------

// edit Department API
    export const editDepartmentAPI = async(departmentId,reqBody,reqHeader)=>{
        return await commonAPI("PUT",`${BASEURL}/department/edit/${departmentId}`,reqBody,reqHeader)
    }

// edit Employee API
    export const editEmployeeAPI = async(employeeId,reqBody,header)=>{
        return await commonAPI("PUT",`${BASEURL}/employee/edit/${employeeId}`,reqBody,header)
    }

// edit Patient API
    export const editPatientAPI = async(patientId,reqBody,header)=>{
        return await commonAPI("PUT",`${BASEURL}/patient/edit/${patientId}`,reqBody,header)
    }

// edit Appointment API
    export const  editAppointmentAPI = async(appntId,reqBody,reqHeader)=>{
        return await commonAPI("PUT",`${BASEURL}/appointment/edit/${appntId}`,reqBody,reqHeader)
    }

// edit StockDetails API
    export const editStockAPI = async (stockId,reqBody,reqHeader)=>{
        console.log("body",stockId);
        return await commonAPI("PUT",`${BASEURL}/pharmacy/edit/${stockId}`,reqBody,reqHeader)
    }




// -------------------------------------DELETING SECTION---------------------------------------------

// delete Department API
    export const deleteDepartmentAPI = async (id,reqHeader)=>{
        return await commonAPI("DELETE",`${BASEURL}/department/remove/${id}`,{},reqHeader)
    }

// delete Employee API
    export const deleteEmployeeAPI = async (id,reqHeader)=>{
        return await commonAPI("DELETE",`${BASEURL}/employee/remove/${id}`,{},reqHeader)
    }

// delete Patient API
    export const deletePatientAPI = async (id,reqHeader)=>{
        return await commonAPI("DELETE",`${BASEURL}/patient/remove/${id}`,{},reqHeader)
    }

// delete Appointment API
    export const deleteAppointmentAPI = async (id,reqHeader)=>{
        return await commonAPI("DELETE",`${BASEURL}/appointment/remove/${id}`,{},reqHeader)
    }

// delete Stock API
    export const deleteStockAPI = async (id,reqHeader)=>{
        return await commonAPI("DELETE",`${BASEURL}/pharmacy/remove/${id}`,{},reqHeader)
    }

// delete Pending Medicine Request API
    export const deletependingMedcineRequestAPI = async (id,reqHeader)=>{
        return await commonAPI("DELETE",`${BASEURL}/pharmacy/removePendingRequest/${id}`,{},reqHeader)
    }
    

