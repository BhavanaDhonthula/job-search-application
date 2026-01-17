import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaRegStar, FaShoppingBag, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const EachSkill = props => {
  const {skillDetails} = props

  const updateSkillDetails = {
    name: skillDetails.name,
    imageUrl: skillDetails.image_url,
  }

  const {name, imageUrl} = updateSkillDetails

  return (
    <li className="skill-card">
      <img alt={name} className="skill-img" src={imageUrl} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

const EachSimilarJobItem = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails
  return (
    <li className="each-similar-job-container">
      <div className="similar-logo-title-container">
        <div className="job-item-logo-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="job-details-company-logo"
          />
        </div>
        <div className="similar-job-title-rating-container">
          <h1 className="similar-job-title">{title}</h1>
          <p className="job-details-rating">
            <FaRegStar className="job-details-icons job-details-rating-star" />
            {rating}
          </p>
        </div>
      </div>

      <div className="job-details-description-container">
        <div className="description-visit-btn-container">
          <h1 className="job-details-heading">Description</h1>
        </div>
        <p className="job-details-description">{jobDescription}</p>
      </div>
      <div className="similar-job-location-emp-type-package-container">
        <div className="location-emp-type-container">
          <p className="location">
            <MdLocationOn className="job-details-icons" />
            {location}
          </p>
          <p className="emp-type">
            <FaShoppingBag className="job-details-icons" />
            {employmentType}
          </p>
        </div>
      </div>
    </li>
  )
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedJobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        title: data.job_details.title,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnunm: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }

      const updatedSimilarJobsData = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobDetails: updatedJobDetailsData,
        similarJobs: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsContainer = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      rating,
      title,
      location,
      employmentType,
      packagePerAnnunm,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    const updatedLifeAtCompanyDetails = lifeAtCompany
      ? {
          description: lifeAtCompany.description,
          imageUrl: lifeAtCompany.image_url,
        }
      : {}

    const {description, imageUrl} = updatedLifeAtCompanyDetails

    return (
      <>
        <div className="job-item-details-container">
          <div className="job-item-logo-title-container">
            <div className="job-item-logo-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="job-details-company-logo"
              />
            </div>
            <div className="job-details-title-rating-container">
              <h1 className="job-details-title">{title}</h1>
              <p className="job-details-rating">
                <FaRegStar className="job-details-icons job-details-rating-star" />
                {rating}
              </p>
            </div>
          </div>

          <div className="job-details-location-emp-type-package-container">
            <div className="location-emp-type-container">
              <p className="location">
                <MdLocationOn className="job-details-icons" />
                {location}
              </p>
              <p className="emp-type">
                <FaShoppingBag className="job-details-icons" />
                {employmentType}
              </p>
            </div>
            <div className="job-details-package-container">
              <p className="job-details-package">{packagePerAnnunm}</p>
            </div>
          </div>
          <hr className="hr-line" />

          <div className="job-details-description-container">
            <div className="description-visit-btn-container">
              <h1 className="job-details-heading">Description</h1>
              <button type="button" className="visit-btn">
                <a
                  href={companyWebsiteUrl}
                  className="company-website-url-link"
                >
                  Visit
                  <FaExternalLinkAlt className="visit-icon" />
                </a>
              </button>
            </div>
            <p className="job-details-description">{jobDescription}</p>
          </div>

          <h1 className="job-details-heading">Skills</h1>

          <ul className="job-details-skills-container">
            {skills.map(eachSkill => (
              <EachSkill skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>

          <div className="life-at-company-details-container">
            <h1 className="job-details-heading">Life at Company</h1>
            <div className="life-at-company-description-img-container">
              <p className="life-at-company-description">{description}</p>
              <img
                src={imageUrl}
                alt="life at company"
                className="life-at-company-img"
              />
            </div>
          </div>
        </div>

        <div className="similar-jobs-container">
          <h1 className="job-details-heading">Similar Jobs</h1>

          <ul className="similar-jobs">
            {similarJobs?.map(eachSimilarJob => (
              <EachSimilarJobItem
                similarJobDetails={eachSimilarJob}
                key={eachSimilarJob.id}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsFailureView = () => (
    <div className="job-item-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-caption">
        We cannot seem to find the page you are looking for.
      </p>

      <button
        type="button"
        className="retry-btn"
        onClick={this.getJobItemDetails}
        data-testid="retryButton"
      >
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-bg-container">
          {this.renderJobDetailsContainer()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
