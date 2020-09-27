import axios from 'axios';

const url = window.location.origin;

export const fetchRecords = async () => {
    try{
        const {data:{data}} = await axios.get(`${url}/api/employees`);
        return data;
    }catch(error){
        return error.response
    }
}

export const fetchTemplate = async () => {
    try{
        window.open(`${url}/api/employees/template`)
    }catch(error){
        return error.response
    }
}

export const addLog = async (form) => {
    try{
        const res = await axios.post(`${url}/api/employees/create`, form);
        return res;
    }catch(error){
        return error.response
    }
}

export const editLog = async (form) => {
    try{
        const res = await axios.put(`${url}/api/employees/update`, form);
        return res;
    }catch(error){
        return error.response
    }
}

export const addLogViaExcel = async (file) => {
    const fd = new FormData();
    fd.append('imported_file', file);
    try{
        const res =  await axios.post(`${url}/api/employees/import`, fd)
        return res;
    }catch(error){
        return error.response
    }
}

export const deleteRecord = async id =>{
    try{
        const res =  await axios.delete(`${url}/api/employees/destroy`, {data:{id}})
        return res;
    }catch(error){
        return error.response
    }
}