import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {IoIosLogOut} from 'react-icons/io'
import {FaShoppingBag} from 'react-icons/fa'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <>
      <nav className="header-desktop-view-bg-container">
        <div className="header-logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-website-logo"
            />
          </Link>
        </div>

        <ul className="nav-items-container">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>

        <div className="logout-btn-container">
          <button className="logout-btn" type="button" onClick={onClickLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile view navbar start */}
      <nav className="header-mobile-view-bg-container">
        <div className="header-logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-website-logo"
            />
          </Link>
        </div>

        <ul className="nav-items-container">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <AiFillHome />
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs" className="nav-link">
              <FaShoppingBag />
            </Link>
          </li>
        </ul>

        <div className="logout-btn-container">
          <button
            className="logout-btn-mobile"
            type="button"
            onClick={onClickLogout}
          >
            <IoIosLogOut />
          </button>
        </div>
      </nav>
    </>
  )
}
export default withRouter(Header)
