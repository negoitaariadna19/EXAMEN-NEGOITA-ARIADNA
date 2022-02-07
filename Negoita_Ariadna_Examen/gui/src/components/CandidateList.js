import { useEffect, useState } from 'react'
import './CandidateList.css';
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import Select from 'react-select'
import { Dropdown } from 'primereact/dropdown'


import { getCandidates,addCandidate,saveCandidate,deleteCandidate } from '../actions'

const candidateSelector = state => state.candidate.candidateList


 


function CandidateList () {
  const id=localStorage.id
  

  const [isDialogShown, setIsDialogShown] = useState(false)
  const [nume, setNume] = useState('')
  const [cv, setCV] = useState('')
  const [email, setEmail] = useState('')
 



  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  


 



const dispatch = useDispatch()
const candidates = useSelector(candidateSelector)





useEffect(() => {
 dispatch(getCandidates(localStorage.id))

}, [])

  

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setNume('')
    setCV('')
    setEmail('')

  }
  

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    let id=localStorage.id
    if (isNewRecord) {
        
      dispatch(addCandidate({ nume, cv,email },id))
    } else {
      dispatch(saveCandidate(selectedCandidate, { nume, cv,email },id))
      
    }

    setIsDialogShown(false)
    setSelectedCandidate(null)
    setNume('')
    setCV('')
    setEmail('')
  }

  const editCandidate = (rowData) => {
    setSelectedCandidate(rowData.id)
    setNume(rowData.nume)
    setCV(rowData.cv)
    setEmail(rowData.email)
  
    
    setIsDialogShown(true)
    setIsNewRecord(false)
    
  }
  

  const handleDeleteCandidate = (rowData) => {
      
    dispatch(deleteCandidate(rowData.id,id))
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' id={'but2'} onClick={handleAddClick} />
    </div>
  )

  const dialogFooter = (
    <div>
      <Button label='Save' icon='pi pi-save' id={'but2'} onClick={handleSaveClick} />
    </div>
  )

  const opsColumn = (rowData) => {
    return (
      <>
        <Button label='Edit' icon='pi pi-pencil'className="p-button p-button-success" id={'but2'} onClick={() => editCandidate(rowData)} /><hr></hr>
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' id={'but2'} onClick={() => handleDeleteCandidate(rowData)} />
        
      </>
    )
  }

  

  return (
    <div className="wrapper">
      <DataTable 
      style={{
        height: "550px",
        
        
        
      }}
      value={candidates}
      
      

        footer={tableFooter}
       
        
       
      >
        <Column header='Nume' field='nume'  />
        <Column header='CV' field='cv'  />
        <Column header='Email' field='email'  />
       
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='Date candidat' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='Adauga nume' onChange={(evt) => setNume(evt.target.value)} value={nume} />
        </div>
        <div>
          <InputText placeholder='Adauga descriere CV' onChange={(evt) => setCV(evt.target.value)} value={cv} />
        </div>
        <div>
          <InputText placeholder='Adauga email' onChange={(evt) => setEmail(evt.target.value)} value={email} />
        </div>
       
        
      </Dialog>
      
    

    </div>
  )
}

export default CandidateList

