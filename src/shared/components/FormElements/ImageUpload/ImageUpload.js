import React, { useRef, useState, useEffect } from 'react';

import Button from '../Button/Button';

import './ImageUpload.css';

const ImageUpload = props => {
    // manage the file inside image with useState
    const [file, setFile] = useState()

    const [previewURL, setPreviewURL] = useState()

    const [isValid, setIsValid] = useState(false)

    // to access built in file picker
    const filePickerRef = useRef();

    // register new useEffect function to deal with the preview
    // the useState changes when the user selects a file
    // so now we want to do something on top of a state change
    // which is a good case for useEffect
    // this useEffect function should trigger
    // whenever the file changes
    // so the dependency passed is the file
    useEffect(() => {
        // first we check if the file is not defined
        if (!file) {
            // if it is not defined, we return
            return
        }

        // if we have a valid file, we can generate an image preview URL
        // with an api that is built into the browser (and JS), the file reader
        // the file reader helps us read files, parse files, and we can use it to convert the
        // binary data of the file into a readable outputable(probably not a word) image
        const fileReader = new FileReader()

        // calling on onload function helps us whenever the file reader
        // loads a new file or is done parsing 
        fileReader.onload = () => {

            // we don't get the parsed file as an argument
            // so we have to extract it as .fileReader.result
            setPreviewURL(fileReader.result)
        }

        // have to call .readAsDataURL() to work with the api
        // but it doesn't work with a call back
        // and doesn't give a promise
        // so before we call it, we need to register the onload function
        fileReader.readAsDataURL(file)

    }, [file])


    // when user chooses a image, onChange is triggered
    const pickedHandler = event => {
        // console.log(event.target);

        let pickedFile;

        let fileIsValid = isValid

        // the .files property is a default js property on the event target 
        // property that holds the files the user selected
        // works as long as you use a native file picker- which we are
        // also want to be sure the files selected are exactly 1

        if (event.target.files && event.target.files.length === 1) {

            // if these requirements are met, we extract the picked file
            // the first index position- should be the only one
            pickedFile = event.target.files[0]

            // then we can set the file to the picked file/ extracted file
            setFile(pickedFile)

            // then set is valid to true- this doesn't immediately update the value state
            setIsValid(true)

            // so we need to manually validate the file
            fileIsValid = true;

            // return


        } else {
            // otherwise, we picked something wrong
            setIsValid(false)

            // similar to the safe code block- if the file is not valid
            // we need to manually validate it
            fileIsValid = false
        }
        
        // Error message received: props.onInput is not a function
        props.onInput(props.id, pickedFile, fileIsValid)

    };

    // triggered when we click the button, so we can utilize the element even tho we can't see it
    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        // form-control is from Input.css
        // believe this works globally
        // but if it does ... why do I need to import CSS files in the first place (Google it)
        <div className="form-control">

            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }} // hiding this element so user will use button
                type="file" // this is a default
                accept=".jpg,.png,.jpeg" // default attribute
                onChange={pickedHandler}
            />

            {/* .center will help with image preview and image picker button positioning*/}
            <div className={`image-upload ${props.center && 'center'}`}>

                <div className="image-upload__preview">
                    {/* output preview URL if we have one  and  only output the image if that's the case*/}
                    {previewURL && <img src={previewURL} alt="Preview" />}
                    {/* if we don't have a preview URL,  */}
                    {!previewURL && <p>Please pick an image. </p>}
                </div>

                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {/* Error message in case something picked is invalid*/}
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;