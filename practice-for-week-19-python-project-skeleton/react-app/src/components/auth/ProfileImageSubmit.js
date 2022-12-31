import React from "react";
import { FileUploader } from "react-drag-drop-files";

const ALLOWED_TYPES = ["pdf", "png", "jpg", "jpeg", "gif"]

const ProfileImageSubmit = () => {
    return (
        <FileUploader
            label='Something Groovy'
            types={ALLOWED_TYPES}
            children={
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
            }
        />
    )
}

export default ProfileImageSubmit