import React, {useState, useRef} from 'react'
import { addLog, addLogViaExcel, fetchTemplate } from '../../api';

const date = new Date();
const curDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`

function AddDtr({setRecords,  records}) {
    const [form, setForm] = useState({
        name:'',
        date:'',
        time:''
    })

    const [importFile, setImportFile] = useState('');

    const [notification, setNotification] = useState('');
    const fileInputRef = useRef(); 

    const handleChange = e => {
        setForm({...form, [e.target.name]:e.target.value})
        console.log(form.time)
    }

    const toAlert = (msg, status) =>{
       return (
            <div className={`alert alert-${status}`} role="alert">
                {msg}
            </div>
        )   
    }

    const onSubmit = async e => {
        e.preventDefault();
        const res = await addLog(form);
        const {status, data:{data}} = res;
        if(status == 201){
            console.log('success')
            setNotification(toAlert('Log added successfully', 'success'))
            setForm({
                name:'',
                date:'',
                time:''
            })
            data.isEdit = false;
            setRecords([data, ...records])
            setTimeout(()=>setNotification(''), 3000)
        }   
    }

    const onSubmitFile = async e=> {
        e.preventDefault();
        const res = await addLogViaExcel(importFile);
        const {status, data:{data}} = res;
        if(status == 200){
            setImportFile('');
            setNotification(toAlert('Log added successfully', 'success'));
            fileInputRef.current.value = "";
            try{
                setRecords([...data.
                    map(x=>{
                        x.isEdit = false;
                        return x;
                    }).sort((a,b)=>b.id-a.id), ...records])
            }catch(e){
                console.log(e)
            }
            setTimeout(()=>setNotification(''), 3000)
        }
        
    }

    const getTemplate = async () =>{
        return await fetchTemplate();
    }
    
    const handleFile = async e => {
        setImportFile(e.target.files[0])
    }

    const addViaFormModal = (
        <div className="modal fade" data-backdrop="static" id="addLog" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={onSubmit} action="">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Log</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div>
                                        {notification}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Name:</label>
                                        <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Your name here..." 
                                        className="form-control"
                                        onChange={handleChange}
                                        value={form.name}
                                        required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Date:</label>
                                        <input 
                                        type="text" 
                                        name="date" 
                                        placeholder={curDate}
                                        onFocus={e=>e.currentTarget.type='date'}
                                        onBlur={e=>e.currentTarget.type='text'}  
                                        className="form-control"
                                        onChange={handleChange}
                                        value={form.date}
                                        required
                                        />
                                    </div>
                                    <div className="form-group">
                                    <   label htmlFor="">Time:</label>
                                        <input type="time" 
                                        name="time" 
                                        className="form-control"
                                        onChange={handleChange}
                                        value={form.time}
                                        required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
    )

    const addViaExcelModal = (
        <div className="modal fade" data-backdrop="static" id="addLogVieExcel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={onSubmitFile} action="">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Log <small>via Excel</small></h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div>
                                        {notification}
                                    </div>
                                    <div className="formGroup">
                                        <input ref={fileInputRef} type="file" required onChange={handleFile} name="imported_file" className="form-control" id=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                            <button type="button" style={{textDecoration:'none'}} onClick={e=>getTemplate()} className="btn btn-link mr-auto">Download Template</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
    )

    return (
        <div className="">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-6">
                        <div>
                            <button className="btn-success w-100" style={{height:'50px'}} data-toggle="modal" data-target="#addLog">Add Log</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div>
                            <button className="btn-success w-100" style={{height:'50px'}} data-toggle="modal" data-target="#addLogVieExcel">Add Log <small>via Excel</small></button>
                        </div>
                    </div>
                </div>
            </div>
            {addViaFormModal}
            {addViaExcelModal}
        </div>
    )
}

export default AddDtr
