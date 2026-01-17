import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaSearch, FaRegStar, FaShoppingBag} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import './index.css'

/* no need to edit details start */

const apiStatusConstantsForUserDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusConstantsForJobs = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    id,
    title,
  } = jobDetails
  return (
    <li className='job-item-container'>
      <Link to={`/jobs/${id}`} className='job-item-details-link'>
        <div className='logo-title-container'>
          <div className='logo-container'>
            <img
              src={companyLogoUrl}
              alt='company logo'
              className='company-logo-img'
            />
          </div>
          <div className='title-container'>
            <h1 className='title'>{title}</h1>
            <p className='rating'>
              <FaRegStar className='rating-star' />
              {rating}
            </p>
          </div>
        </div>

        <div className='location-salary-details-container'>
          <div className='location-emp-type-container'>
            <p className='location'>
              <MdLocationOn />
              {location}
            </p>
            <p className='job-type'>
              <FaShoppingBag />
              {employmentType}
            </p>
          </div>
          <p className='package'>{packagePerAnnum}</p>
        </div>
        <hr className='hr-line' />
        <div className='description-container'>
          <h1 className='job-description title'>Description</h1>
          <p className='description'>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

const EmploymentTypeItem = props => {
  const {employmentTypeDetails, updateEmploymentIdsList} = props
  const {employmentTypeId, label} = employmentTypeDetails

  return (
    <li className='employment-type-container'>
      <input
        type='checkbox'
        className='checkbox-field'
        id={employmentTypeId}
        onChange={event =>
          updateEmploymentIdsList(employmentTypeId, event.target.checked)
        }
      />
      <label htmlFor={employmentTypeId} className='label'>
        {label}
      </label>
    </li>
  )
}

const EachSalaryRange = props => {
  const {salaryRangeDetails, updatePackagePerAnnum} = props
  const {salaryRangeId, label} = salaryRangeDetails

  const onClickUpdatePackagePerAnnum = event => {
    if (event.target.checked) {
      updatePackagePerAnnum(salaryRangeId)
    }
  }

  return (
    <li className='salary-range-container'>
      <input
        type='radio'
        className='radio-field'
        name='salary-range'
        id={salaryRangeId}
        onChange={onClickUpdatePackagePerAnnum}
      />
      <label htmlFor={salaryRangeId} className='label'>
        {label}
      </label>
    </li>
  )
}

/* no need to edit details end */

class Jobs extends Component {
  state = {
    userDetails: {},
    employmentIdsList: [],
    minimumPackage: '',
    search: '',
    jobsList: [],
    apiStatusOfUserDetails: apiStatusConstantsForUserDetails.initial,
    apiStatusOfJobs: apiStatusConstantsForJobs.initial,
  }

  componentDidMount() {
    this.getUserDetails()
    this.getJobs()
  }

  getJobs = async () => {
    const {employmentIdsList, minimumPackage, search} = this.state

    const finalEmpTypeString =
      employmentIdsList.length > 0 ? employmentIdsList.join(',') : ''

    console.log(finalEmpTypeString)

    this.setState({apiStatusOfJobs: apiStatusConstantsForJobs.inProgress})

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${finalEmpTypeString}&minimum_package=${minimumPackage}&search=${search}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        apiStatusOfJobs: apiStatusConstantsForJobs.success,
      })
    } else {
      this.setState({apiStatusOfJobs: apiStatusConstantsForJobs.failure})
    }
  }

  getUserDetails = async () => {
    this.setState({
      apiStatusOfUserDetails: apiStatusConstantsForUserDetails.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileApiUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(profileApiUrl, options)
    const data = await response.json()

    const profileDetails = data.profile_details

    const updatedUserData = profileDetails &&
      profileDetails !== undefined && {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

    if (response.ok) {
      this.setState({
        userDetails: updatedUserData,
        apiStatusOfUserDetails: apiStatusConstantsForUserDetails.success,
      })
    } else {
      this.setState({
        apiStatusOfUserDetails: apiStatusConstantsForUserDetails.failure,
      })
    }
  }

  renderJobsFailureView = () => (
    <div className='failure-view'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
        alt='failure view'
        className='failure-img'
      />
      <h1 className='failure-heading'>Oops! Something Went Wrong</h1>
      <p className='failure-description'>
        We cannot seem to find the page you are looking for
      </p>

      <button
        type='button'
        data-testid='retryButton'
        className='retry-btn'
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobs = () => {
    const {jobsList} = this.state
    return (
      <>
        {jobsList && jobsList.length === 0 ? (
          <div className='no-jobs-found-view'>
            <img
              src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
              alt='no jobs'
              className='no-jobs-img'
            />
            <h1 className='no-jobs-heading'>No Jobs Found</h1>
            <p className='no-jobs-description'>
              We could not find any jobs. Try other filters
            </p>
          </div>
        ) : (
          <ul className='job-items'>
            {jobsList.map(eachJobItem => (
              <JobItem jobDetails={eachJobItem} key={eachJobItem.id} />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderJobsComponent = () => {
    const {apiStatusOfJobs} = this.state
    switch (apiStatusOfJobs) {
      case apiStatusConstantsForJobs.success:
        return this.renderJobs()
      case apiStatusConstantsForJobs.failure:
        return this.renderJobsFailureView()
      case apiStatusConstantsForJobs.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderUserProfile = () => {
    const {userDetails} = this.state
    const {name, profileImageUrl, shortBio} = userDetails
    return (
      <div className='profile-details-container'>
        <img src={profileImageUrl} alt='profile' className='profile-icon' />
        <h1 className='username'>{name}</h1>
        <p className='short-bio'>{shortBio}</p>
      </div>
    )
  }

  renderUserDetailsFailureView = () => (
    <button
      data-testid='retryButton'
      type='button'
      className='retry-btn'
      onClick={this.getUserDetails}
    >
      Retry
    </button>
  )

  renderUserProfileComponent = () => {
    const {apiStatusOfUserDetails} = this.state
    switch (apiStatusOfUserDetails) {
      case apiStatusConstantsForUserDetails.success:
        return this.renderUserProfile()
      case apiStatusConstantsForUserDetails.failure:
        return this.renderUserDetailsFailureView()
      case apiStatusConstantsForUserDetails.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  updateSearch = event => {
    this.setState({search: event.target.value})
  }

  updatePackagePerAnnum = minimumPackage => {
    this.setState({minimumPackage}, this.getJobs)
  }

  updateEmploymentIdsList = (employmentTypeId, isChecked) => {
    this.setState(
      prevState => ({
        employmentIdsList:
          isChecked === true
            ? [...prevState.employmentIdsList, employmentTypeId]
            : prevState.employmentIdsList.filter(
                eachEmploymentTypeId =>
                  eachEmploymentTypeId !== employmentTypeId,
              ),
      }),
      this.getJobs,
    )
  }

  render() {
    const {search} = this.state
    return (
      <>
        <Header />
        <div className='jobs-bg-container'>
          <div className='filters-group-container'>
            {this.renderUserProfileComponent()}

            <hr className='hr-line' />

            {/* hr line-1 */}

            <ul className='type-of-employment-options-container'>
              <h1 className='filters-heading'>Type of Employment</h1>
              {employmentTypesList.map(eachType => (
                <EmploymentTypeItem
                  employmentTypeDetails={eachType}
                  key={eachType.employmentTypeId}
                  updateEmploymentIdsList={this.updateEmploymentIdsList}
                />
              ))}
            </ul>
            <hr className='hr-line' />

            {/* hr-line-2 */}
            <ul className='salary-range-options-container'>
              <h1 className='filters-heading'>Salary Range</h1>
              {salaryRangesList.map(eachRange => (
                <EachSalaryRange
                  salaryRangeDetails={eachRange}
                  key={eachRange.salaryRangeId}
                  updatePackagePerAnnum={this.updatePackagePerAnnum}
                />
              ))}
            </ul>
          </div>
          <div className='jobs-container'>
            <div className='search-container'>
              <input
                type='search'
                className='search-job-input-field'
                placeholder='Search'
                value={search}
                onChange={this.updateSearch}
              />
              <div className='search-icon-container'>
                <button
                  type='button'
                  data-testid='searchButton'
                  className='search-icon-btn'
                  onClick={this.getJobs}
                >
                  <FaSearch className='search-icon' />
                </button>
              </div>
            </div>

            <div className='jobs'>{this.renderJobsComponent()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
