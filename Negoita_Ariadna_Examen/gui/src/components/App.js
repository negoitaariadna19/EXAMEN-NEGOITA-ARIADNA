import JobList from './JobList'
import CandidateList from './CandidateList'
import{BrowserRouter,Routes,Route} from 'react-router-dom';

import './App.css';
function App () {
  return (
    <div className="App">
    <BrowserRouter>
  <Routes>
 
    <Route path="/" element={<JobList />}/>
    
    {<Route path="/CandidateList" element={<CandidateList />}/>}
   
    
   
  </Routes>
  </BrowserRouter>
  </div>
  )
}

export default App
