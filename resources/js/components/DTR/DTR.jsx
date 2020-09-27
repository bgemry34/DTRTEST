import { isNull } from 'lodash';
import React, {useEffect, useState} from 'react'
import {fetchRecords, editLog, deleteRecord, addLog} from './../../api'
import styles from './DTR.module.css';

function DTR({records, setRecords}) {

    const [form, setForm] = useState({
        id:'',
        name:'',
        date:'',
        time:''
    })

    const [trash, setTrash] = useState(null)

    useEffect(() => {
        const fetchApi = async ()=>{
            const res = await fetchRecords();
            console.log(res)
            setRecords(res.map(x=>{
                x.isEdit = false;
                return x;
            }));
        }
        fetchApi();
    }, [])


    //Toggle editing in the table 
    const toEdit = id => e =>{
        e.preventDefault();
        setRecords(records.map(record=>{
            if(record.id == id){
                record.isEdit = true;
                setForm({...record, time: getTwentyFourHourTime(record.time), date:formatDate(record.date)});
            }else{
                record.isEdit = false;
            }
            return record;
        }))
    }

    //Cancel editing in table
    const toCancel = e =>{
        setRecords(records.map(record=>{
            record.isEdit = false;
            return record;
        }))
        setForm({
            id:'',
            name:'',
            date:'',
            time:''
        })
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    const getTwentyFourHourTime = (amPmString) => { 
        let d = new Date("1/1/2020 " + amPmString), 
        hour = d.getHours().toString().length <= 1 ? ('0'+d.getHours().toString()) : d.getHours(),
        minute = d.getMinutes().toString().length <= 1 ? ('0'+d.getMinutes().toString()) : d.getMinutes();
        return hour + ':' + minute ;
    }

    const handleChange = e =>{
        setForm({...form, [e.target.name]:e.target.value})
    }
    
    const editSubmit = async e =>{
        e.preventDefault();
        const res = await editLog(form);
        const {status} = res;
        if(status==200){
            setRecords(records.map(record=>{
                console.log(record.id == res.data.data.id)
                return record.id == res.data.data.id ? res.data.data : record
            }))
            console.log(data)
            toCancel();
        }
    }

    const toDelete = async e => {
        e.preventDefault();
        const res = await deleteRecord(form.id);
        const {status, data:{data}} = res;
        if(status==200){
            setTrash({...data, 
                time:getTwentyFourHourTime(data.time),
                date:formatDate(data.date)});
            setRecords(records.filter(record=>record.id!==res.data.data.id));
            $('#deleteModal').modal('hide');
        }
    }

    const undoDelete = async e =>{
        e.preventDefault();
        const res = await addLog(trash);
        const {status, data:{data}} = res;
        if(status == 201){
            setRecords([data, ...records]);
            setTrash(null);
        }
    }

    const confirmDeleteModal = (
        <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete ?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={toDelete} className="btn btn-link">Yes</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )

    const undoNotif = (
        <div className="notif" >
                <div className="message"> Record Deleted </div>
                <div className="undo" ><button onClick={undoDelete} type="button" > Undo</button></div>
                <button onClick={e=>setTrash(null)}  type="button" className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
    )

    return (
        <div>
            
           <div className="container-fluid">
            <form onSubmit={editSubmit} action="">
            <table className="table">
            <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col" className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {records.map(record=>{
                    return !record.isEdit ? 
                    (
                        <tr key={record.id}>
                            <td>{record.name}</td>
                            <td>{record.date}</td>
                            <td>{record.time}</td>
                            <td>
                               <div className="col-md-12">
                                   <div className="row">
                                       <div className="col-md-6">
                                        <button type="button" onClick={toEdit(record.id)} className="btn btn-primary w-100" data-toggle="modal" data-target="#editLog">
                                            Edit
                                        </button>
                                       </div>
                                       <div className="col-md-6">
                                        <button type="button" onClick={()=>setForm(record)} className="btn btn-danger w-100" data-toggle="modal" data-target="#deleteModal">
                                            Delete
                                        </button>
                                       </div>
                                   </div>
                               </div>
                            </td>
                        </tr>
                    ) : 
                    (
                        <tr key={record.id}>
                            <td>
                                <div>
                                    <input 
                                    type="text"  
                                    name="name" 
                                    className="form-control" 
                                    id="" 
                                    value={form.name} 
                                    onChange={handleChange} />
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input 
                                    type="text"  
                                    name="date" 
                                    className="form-control"
                                    onFocus={e=>e.currentTarget.type = "date"} 
                                    onBlur={e=>e.currentTarget.type='text'} 
                                    value={form.date} 
                                    onChange={handleChange} 
                                    placeholder={form.date}
                                    />
                                </div>
                            </td>
                            <td>
                                <div>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder={form.time} 
                                    name="time" 
                                    onFocus={e=>e.currentTarget.type = "time"} 
                                    onBlur={e=>{e.currentTarget.type='text'}} 
                                    id="" 
                                    value={form.time}
                                    placeholder={form.time}
                                    onChange={handleChange} 
                                    />
                                </div>
                            </td>
                            <td>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <button type="submit" className="btn btn-primary w-100">
                                            Save Changes
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button onClick={toCancel} type="button" className="btn btn-secondary w-100">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            </table>
            </form>
           </div>
           {confirmDeleteModal}
           {trash !== null && undoNotif}
        </div>
    )
}

export default DTR
