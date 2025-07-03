import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FileType } from '../utils/FileType'
import fileSystemApi from '../api/fileSystemApi'
import useAuth from '../hooks/useAuth'
import useClassroom from '../hooks/useClassroom'
import '../styles/class-modal.css'

interface addFileItemProps {
  setToggleAddItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrItemChildren: React.Dispatch<React.SetStateAction<any>>;
}

const FileItemModal = ({setToggleAddItemForm, setCurrItemChildren}: addFileItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [newFileName, setNewFileName] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [actualFileName, setActualFileName] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const { userId } = useAuth()
  const { currClass, currFileItem } = useClassroom()

  /**
   * This function handles the change of value in the file input tag,
   * setting the file object in the file tag and its actual name for 
   * display.
   * 
   * @param event - Used to access the file stored.
   */
  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file)
      setActualFileName(file.name)
    }
  }

  /**
   * This function uses all the states that were updated based off the
   * form and sends them through the fileSystemApi to make the POST request
   * that creates the FileSystemItem and adds it to the bucket, sends another
   * GET request to refresh the list.
   * 
   * @param event - Prevents default behavior of page reloading after
   * form submission.
   */
  const handleAddFileItem = async (event: any) => {
    event.preventDefault()
    if (fileType) {
      let formFileType: FileType
      if (fileType === "Folder") { formFileType = FileType.Folder }
      else { formFileType = FileType.File}
      const newFileSystemItem = await fileSystemApi.uploadFileSystemItem(
        userId,
        currClass.id,
        file,
        newFileName,
        formFileType,
        currFileItem.id
      )
      if (newFileSystemItem) {
        const [allChildren, status, message] = await fileSystemApi.getAllChidrenFromItemId(
          userId,
          currClass.id,
          currFileItem.id,
        )
        status ? setCurrItemChildren(allChildren) : setErrorMessage(message)
      }
    }
    setToggleAddItemForm(false)
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
            <input
              required
              value={newFileName}
              onChange={(event) => {setNewFileName(event.target.value)}}
            />
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
                <input 
                  required={fileType==="File"} 
                  type='file' id='upload-file-btn' 
                  style={{display: 'none'}} 
                  onChange={handleFileChange}
                />
                <label className='upload-file-btn' htmlFor='upload-file-btn'>
                  {actualFileName ? 
                    <span>Chosen File</span> : 
                    <div>
                      <span>Choose File</span> <FontAwesomeIcon icon={faArrowDown}/>
                    </div>
                  }
                </label>
                {actualFileName && (
                  <p style={{fontSize: '12px'}}>Selected File: {actualFileName}</p>
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