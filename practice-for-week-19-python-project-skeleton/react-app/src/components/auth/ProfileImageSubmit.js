import React from "react";
import { FileUploader } from "react-drag-drop-files";

const ALLOWED_TYPES = ["pdf", "png", "jpg", "jpeg", "gif"]

const ProfileImageSubmit = ({ image, setImage, setPosition, position }) => {

  const handleChange = (file) => {
    setImage(file)
    console.log('after upload', image)
  }

  const ImagePreview = () => {
    if (image) return (
      <div className="sign-up-uploaded-image">
        <img src={URL.createObjectURL(image)}></img>
      </div>
    )
    return (
      <div className='sign-up-file-upload'>
        <div className="sign-up-file-upload-text">
          <p>Click here to upload a file</p>
          <p>or</p>
          <p>Drag and drop from your computer</p>
        </div>
        <p className="sign-up-file-extensions">* extensions allowed: {ALLOWED_TYPES.map((type, idx) => {
          if (idx === (ALLOWED_TYPES.length - 1)) {
            return `${type}.`
          }
          return `${type}, `
        }
        )}</p>
      </div>
    )
  }

  return (
    <div className="sign-up-image-page">
      <FileUploader
        label='Something Groovy'
        types={ALLOWED_TYPES}
        handleChange={handleChange}
        children={
          <div className="sign-up-image-upload">
            <ImagePreview />
          </div>
        }
      />
      <div className="image-submit-footer">
        <div className="image-submit-back">
          <p>Change Credentials</p>
          <button className="sign-up-back" onClick={() => setPosition(position - 1)}>
            <i class="fa-solid fa-caret-left"></i>Back
          </button>
        </div>
        <button className="sign-up-button">Submit</button>
      </div>
    </div>
  )
}

export default ProfileImageSubmit
