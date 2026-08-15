import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Onboarding from './pages/Onboarding/Onboarding.jsx'
import Login from './pages/Onboarding/Login.jsx'
import Profile from './pages/Onboarding/Profile.jsx'
import Info from './pages/Onboarding/Info.jsx'
import Signup from './pages/Onboarding/Signup.jsx'
import Home from './pages/Home/Home.jsx'
import TrackerMain from './pages/Tracker/Tracker_main.jsx'
import TrackerDetail from './pages/Tracker/Tracker_detail.jsx'
import Report from './pages/Report/Report.jsx'
import TrackerWeek from './pages/Tracker/Tracker_week.jsx'
import MyPage from './pages/MyPage/MyPage.jsx'
import MyPage_notification from './pages/MyPage/MyPage_notification.jsx'
import MyPage_authority from './pages/MyPage/MyPage_authority.jsx'
import MyPage_edit from './pages/MyPage/MyPage_edit.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/info" element={<Info />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/tracker" element={<TrackerMain />} />
          <Route path="/tracker/detail/:id" element={<TrackerDetail />} />
          <Route path="/tracker/week" element={<TrackerWeek />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/notification" element={<MyPage_notification />} />
          <Route path="/mypage/authority" element={<MyPage_authority />} />
          <Route path="/mypage/edit" element={<MyPage_edit />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
