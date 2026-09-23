
import { Toaster } from 'react-hot-toast'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { OpenRoute } from './routing/OpenRoutes'
import Login from './pages/Login'
// import { PrivateRoute } from './routing/PrivateRoute'
import MainLayout from './components/MainLayout'
import Contact from './pages/contactform/Contact'
import Bhomayag from './pages/abhishek/Bhomayag'
import Panchamrit from './pages/abhishek/Panchamrit'
import Hawanatmak from './pages/abhishek/Hawanatmak'
import NityaMangal from './pages/abhishek/NityaMangal'
import Special from './pages/abhishek/Special'
import Abhishek from './pages/abhishek/Abhishek'
import AddUser from './pages/users/AddUser'
import User from './pages/users/User'
import Darshan from './pages/abhishek/Darshan'
import BookingDashboard from './pages/booking/BookingDashboard'
import Donate from './pages/abhishek/Donate'
import Prasad from './pages/prasad/Prasad'
import BookingReport from './pages/booking/BookingReport'
import AddLink from './pages/live/AddLink'
import Links from './pages/live/Links'
import UserwiseReport from './pages/booking/UserwiseReport'
import ScannerMain from './pages/ticketScanner/ScannerMain'
import { PrivateRoute } from './routing/PrivateRoute'

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes> 
          <Route
            path="/"
            element={
              //<OpenRoute>
                <Login />
              //</OpenRoute>
            }
          />
          <Route
            path="/admin"
            element={
          <PrivateRoute>
            {/* <PrivateRoute */}
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Contact/>} />
            <Route path={`add-admins`} element={<AddUser />} />
            <Route path={`admins`} element={<User />} />
            <Route path={`bhomayag--registration`} element={<Bhomayag/>} />
            <Route path={`panchamrit--registration`} element={<Panchamrit/>} />
            <Route path={`hawanatmak--registration`} element={<Hawanatmak/>} />
            <Route path={`nitya--mangal--registration`} element={<NityaMangal/>} />
            <Route path={`special--registration`} element={<Special/>} />
            <Route path={`abhishek--registration`} element={<Abhishek/>} />
            <Route path={`darshan--booking`} element={<Darshan />} />
            <Route path='donate' element={<Donate />} />
            <Route path={`temple-booking`} element={<BookingDashboard />} />
            <Route path='offline-prasad' element={<Prasad />} />
             
             <Route path="scan-ticket" element={<ScannerMain/>}/>

            <Route path='booking-report' element={<BookingReport />} />
            <Route path='user-wise-report' element={<UserwiseReport />} />
            <Route path='add-live-link' element={<AddLink />} />
            <Route path='link-list' element={<Links />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
