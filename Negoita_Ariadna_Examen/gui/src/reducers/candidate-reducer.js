const INITIAL_STATE = {
    candidateList: [],
    error: null,
    fetching: false,
    fetched: false,
    count:0,
 
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case "GET_CANDIDATES_PENDING":
        case "ADD_CANDIDATE_PENDING":
        case "SAVE_CANDIDATE_PENDING":
        case 'DELETE_CANDIDATE_PENDING':
            return { ...state, error: null, fetching: true, fetched: false }
        case "GET_CANDIDATES_FULFILLED":
        case "ADD_CANDIDATE_FULFILLED":
        case "SAVE_CANDIDATE_FULFILLED":
        case 'DELETE_CANDIDATE_FULFILLED':
            return { ...state, candidateList: action.payload, count:action.payload.count,error:null,fetching: false, fetched: true }
        case "GET_CANDIDATES_REJECTED":
        case "ADD_CANDIDATE_REJECTED":
        case "SAVE_CANDIDATE_REJECTED":
        case 'DELETE_CANDIDATE_REJECTED':
            return { ...state, error: action.payload, fetching: false, fetched: false }
        default:
            return state
    }
}


