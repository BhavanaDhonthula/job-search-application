import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showSubmitError: false}

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    const {history} = this.props
    history.replace('/')
    console.log(jwtToken)
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    if (username === '' || password === '') {
      this.onSubmitFailure('Username or password is invalid')
    }

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div className="label-input-container">
        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          type="text"
          className="input-field"
          id="username"
          placeholder="Username"
          value={username}
          onChange={this.updateUsername}
        />
      </div>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <div className="label-input-container">
        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          type="password"
          className="input-field"
          id="password"
          value={password}
          placeholder="Password"
          onChange={this.updatePassword}
        />
      </div>
    )
  }

  renderLoginBtn = () => (
    <div className="login-btn-container">
      <button type="submit" className="login-btn">
        Login
      </button>
    </div>
  )

  render() {
    const {errorMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="form-container">
          <form onSubmit={this.submitForm}>
            <div className="wesite-logo-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="website-logo"
              />
            </div>

            {this.renderUsernameField()}
            {this.renderPasswordField()}
            {this.renderLoginBtn()}
            {showSubmitError ? <p className="error-msg">{errorMsg}</p> : ''}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
