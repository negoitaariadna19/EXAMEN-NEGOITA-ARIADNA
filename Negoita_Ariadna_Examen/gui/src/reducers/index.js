import { combineReducers } from 'redux'
import job from './job-reducer'
import candidate from './candidate-reducer'



export default combineReducers({
  job,candidate
})
