import navHome from '../../assets/Home/img/nav-home.svg'
import navHomeActive from '../../assets/Home/img/nav-home-active.svg'
import navReport from '../../assets/Home/img/nav-report.svg'
import navReportActive from '../../assets/Home/img/nav-report-active.svg'
import navTracker from '../../assets/Home/img/nav-tracker.svg'
import navTrackerActive from '../../assets/Home/img/nav-tracker-active.svg'
import navMypage from '../../assets/Home/img/nav-mypage.svg'
import navMypageActive from '../../assets/Home/img/nav-mypage-active.svg'

export const navItems = [
  { to: '/home', label: '홈', icon: navHome, activeIcon: navHomeActive },
  { to: '/report', label: '리포트', icon: navReport, activeIcon: navReportActive },
  { to: '/tracker', label: '트래커', icon: navTracker, activeIcon: navTrackerActive },
  { to: '/mypage', label: '마이페이지', icon: navMypage, activeIcon: navMypageActive },
]
