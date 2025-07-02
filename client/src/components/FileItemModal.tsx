import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FileType } from '../utils/FileType'
import '../styles/class-modal.css'

interface addFileItemProps {
  setToggleAddItemForm: React.Dispatch<React.SetStateAction<boolean>>
}

const FileItemModal = ({setToggleAddItemForm}: addFileItemProps) => {

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [fileName, setFileName] = useState<string>('');
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  }

  const handleAddFileItem = (event: any) => {
    event.preventDefault()
    
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="close-container">
          <span 
            className="close"
            onClick={() => 
              {setToggleAddItemForm(false)}}
          >
            &times;
          </span>
        </div>
        <h1 className='modal-title'>Add New File System Item</h1>
        <form onSubmit={handleAddFileItem} className='modal-form'>
          <div className='modal-input-container'>
            <label>File Name</label>
            <input required />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className='modal-input-half-container'>
              <label>File Type</label>
              <select
                required
                name='fileType'
                value={fileType}
                onChange={(event) => {setFileType(event.target.value)}}
              >
                <option disabled value="">Select Type...</option>
                <option value="File">File</option>
                <option value="Folder">Folder</option>
              </select>
            </div>
            <div className='modal-input-half-container'>
                <label>Upload File</label>
                <input type='file' id='upload-file-btn' style={{display: 'none'}} onChange={handleFileChange}/>
                <label className='upload-file-btn' htmlFor='upload-file-btn'>
                  {fileName ? 
                    <span>Chosen File</span> : 
                    <div>
                      <span>Choose File</span> <FontAwesomeIcon icon={faArrowDown}/>
                    </div>
                  }
                </label>
                {fileName && (
                  <p style={{fontSize: '12px'}}>Selected File: {fileName}</p>
                )}
            </div>
          </div>
          <button className='modal-form-submit-btn'>Submit</button>
          {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
        </form>
      </div>
    </div>
  )
}

export default FileItemModal