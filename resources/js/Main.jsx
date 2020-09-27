import React, {useState} from 'react'
import DTR from './components/DTR/DTR'
import AddDTR from './components/AddDTR/AddDtr'

function Main() {

    const [records, setRecords] = useState([]);
    
    return (
        <div>
            <AddDTR setRecords={setRecords} records={records} />
            <DTR records={records} setRecords={setRecords} />
        </div>
    )
}

export default Main
