import React, { useRef } from 'react';

import Button from '../Button/Button';

import './ImageUpload.css';

const ImageUpload = props => {

    // to access built in file picker
    const filePickerRef = useRef();

    // when user chooses a image, onChange is triggered
    const pickedHandler = event => {
        console.log(event.target);
    };

// triggered when we click the button, so we can utilize the element even tho we can't see it
    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        // form-control is from Input.css
        <div className="form-control"> 

            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }} // hiding this element so user will use button
                type="file" // this is a default
                accept=".jpg,.png,.jpeg" // default attribute
                onChange={pickedHandler}
            />

            {/* will help with image preview and image picker button positioning*/}
            <div className={`image-upload ${props.center && 'center'}`}> 

                {/* image preview */}
                <div className="image-upload__preview">
                    <img src="" alt="Preview" />
                </div>

                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
        </div>
    );
};

export default ImageUpload;