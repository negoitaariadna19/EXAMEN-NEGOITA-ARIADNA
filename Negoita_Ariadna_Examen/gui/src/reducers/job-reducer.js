const INITIAL_STATE = {
  jobList: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GET_JOBS_PENDING':
    case 'ADD_JOB_PENDING':
    case 'SAVE_JOB_PENDING':
    case 'DELETE_JOB_PENDING':
      return { ...state, error: null, fetching: true, fetched: false }
    case 'GET_JOBS_FULFILLED':
    case 'ADD_JOB_FULFILLED':
    case 'SAVE_JOB_FULFILLED':
    case 'DELETE_JOB_FULFILLED':
      return { ...state, jobList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
    case 'GET_JOBS_REJECTED':
    case 'ADD_JOB_REJECTED':
    case 'SAVE_JOB_REJECTED':
    case 'DELETE_JOB_REJECTED':
      return { ...state, jobList: [], error: action.payload, fetching: false, fetched: true }
    default:
      return state
  }
}
