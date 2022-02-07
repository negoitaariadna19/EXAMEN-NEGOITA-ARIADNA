import './JobList.css';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import{useNavigate} from "react-router";

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

import { getJobs, addJob, saveJob, deleteJob } from '../actions'

const jobSelector = state => state.job.jobList
const jobCountSelector = state => state.job.count

function JobList () {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const navigate=useNavigate();
  const [descriere, setDescriere] = useState('')
  const [deadline, setDeadline] = useState(new Date())
  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filterString, setFilterString] = useState('')

  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const [filters, setFilters] = useState({
    descriere: { value: null, matchMode: FilterMatchMode.CONTAINS },
    deadline: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState(0)

  const handleFilter = (evt) => {
    const oldFilters = filters
    oldFilters[evt.field] = evt.constraints.constraints[0]
    setFilters({ ...oldFilters })
  }

  const handleFilterClear = (evt) => {
    setFilters({
      descriere: { value: null, matchMode: FilterMatchMode.CONTAINS },
      deadline: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
  }

  useEffect(() => {
    const keys = Object.keys(filters)
    const computedFilterString = keys.map(e => {
      return {
        key: e,
        value: filters[e].value
      }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
    setFilterString(computedFilterString)
  }, [filters])

  const jobs = useSelector(jobSelector)
  const count = useSelector(jobCountSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getJobs(filterString, page, 2, sortField, sortOrder))
  }, [filterString, page, sortField, sortOrder])

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setDescriere('')
    
    

  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }
  const setCandidateJob= async(rowData) => {
    localStorage.id=rowData.id;
    
    console.log(localStorage.id)
    
    
    navigate(`/CandidateList`)
    
  }
  const handleSaveClick = () => {
    
    if (isNewRecord) {
    
      dispatch(addJob({ descriere, deadline}))
    } else {
      dispatch(saveJob(selectedJob, { descriere, deadline}))
      console.log(descriere);
    }

    setIsDialogShown(false)
    setSelectedJob(null)
    setDescriere('')
    setDeadline(new Date())
  }

  const editJob = (rowData) => {
    setSelectedJob(rowData.id)
    setDescriere(rowData.descriere)
   
    setDeadline(rowData.deadline)
    
   
    
    setIsDialogShown(true)
    setIsNewRecord(false)
    
  }


  const handleDeleteJob = (rowData) => {
    dispatch(deleteJob(rowData.id))
  }

  const tableFooter = (
    <div>
      
      <Button label='Add' icon='pi pi-plus' id={'but'} onClick={handleAddClick} />
      
    </div>
    
  )


  const dialogFooter = (
    <div>
      <Button label='Save' icon='pi pi-save' id={'but'} onClick={handleSaveClick} />
      
    </div>
  )

  const opsColumn = (rowData) => {
    return (
      <>
        <Button label='Edit'  icon='pi pi-pencil' className="p-button p-button-success" id={'but'} onClick={() => editJob(rowData)} /><hr></hr>
        <Button label='Candidate'  icon='pi pi-user-edit'className="p-button p-button-warning" id={'but'} onClick={() => setCandidateJob(rowData)} /><hr></hr>
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' id={'but'} onClick={() => handleDeleteJob(rowData)} />
        
       
      
      </>
    )
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 2)
  }

  const handleSort = (evt) => {
    console.warn(evt)
    setSortField(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  return (
    <div className="wrapper">
      <DataTable
        
        value={jobs}
        footer={tableFooter}
        lazy
        paginator
        onPage={handlePageChange}
        first={first}
        rows={2}
        totalRecords={count}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column header='Descriere'  field='descriere' filter filterField='descriere'  filterPlaceholder='filter by descriere' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column header='Deadline'  field='deadline'  filter filterField='deadline'  filterPlaceholder='filter by deadline' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        
       
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='Date job' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='Adauga descriere job' onChange={(evt) => setDescriere(evt.target.value)} value={descriere} />
        </div>
        
        <div>
        <InputText placeholder="deadline" type={"date"} onChange={(evt) => setDeadline(evt.target.value)} value={deadline} />
        </div>
        
      </Dialog>
    </div>
  )
}

export default JobList
