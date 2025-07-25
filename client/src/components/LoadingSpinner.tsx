import '../styles/loadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner-circle" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default LoadingSpinner