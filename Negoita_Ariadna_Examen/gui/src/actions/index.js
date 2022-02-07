import { SERVER } from '../config/global'

export const getJobs = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_JOBS',
    payload: async () => {
      const response = await fetch(`${SERVER}/jobs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addJob = (job, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'ADD_JOB',
    payload: async () => {
      let response = await fetch(`${SERVER}/jobs`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job)
      })
      response = await fetch(`${SERVER}/jobs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const saveJob = (id, job, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'SAVE_JOB',
    payload: async () => {
      let response = await fetch(`${SERVER}/jobs/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job)
      })
      response = await fetch(`${SERVER}/jobs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteJob = (id, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'DELETE_JOB',
    payload: async () => {
      let response = await fetch(`${SERVER}/jobs/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/jobs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      console.log(data)
      return data
    }
  }
}

export const getCandidates = (id) => {
  return {
    type: 'GET_CANDIDATES',
    payload: async () => {
      const response = await fetch(`${SERVER}/jobs/${id}/candidates`)
      const data = await response.json()
      console.log(data)
      return data
      
    }
  }
}
export const addCandidate = (candidate,id) => {
  return {
    type: 'ADD_CANDIDATE',
    payload: async () => {
      let response = await fetch(`${SERVER}/jobs/${id}/candidates`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidate)
      })
      response = await fetch(`${SERVER}/jobs/${id}/candidates`)
      const data = await response.json()
      return data
    }
  }
}
export const saveCandidate = (id, job, idJob) => {
  return {
    type: 'SAVE_CANDIDATE',
    payload: async () => {
      let response = await fetch(`${SERVER}/jobs/${idJob}/candidates/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job)
      })
      response = await fetch(`${SERVER}/jobs/${idJob}/candidates`)
      const data = await response.json()
      return data
    }
  }
}
export const deleteCandidate = (id, idJob) => {
  return {
    type: 'DELETE_CANDIDATE',
    payload: async () => {
      let response = await fetch(`${SERVER}/jobs/${idJob}/candidates/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/jobs/${idJob}/candidates`)
      const data = await response.json()
      console.log(data)
      return data
    }
  }
}




