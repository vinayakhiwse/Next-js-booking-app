import useTranslation from "@/hooks/useTranslation";
import React, { useState, useRef, useEffect } from "react";

// Replace any PHP variables used in the code with their corresponding React props
const ImageUploader = ({ imageTitle, isProfile, inputName, value, formik }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();
  const inputFileRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("imageFile", file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      formik.setFieldValue("imageUrl", imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage("");
    formik.setFieldValue("imageUrl", "");
    formik.setFieldValue("imageFile", "");
    inputFileRef.current.value = null;
  };

  useEffect(() => {
    setSelectedImage(value);
  }, [value]);

  return (
    <div className="uploder-ss-m mb-23 col-12 mb-23 p-0">
      <div className="input-style">
        <label className="d-block">
          {imageTitle} <span className="text-danger">*</span>
        </label>
      </div>
      <div className="upload-sec d-flex align-items-center flex-wrap">
        <div className="qust-filed mr-2">
          <div className="form-control py-2 d-flex align-items-center justify-content-center">
            <input
              type="file"
              id={`choose-file-${inputName}`}
              className="input-file d-none"
              accept="image/*"
              onChange={handleFileChange}
              ref={inputFileRef}
            />
            <label
              htmlFor={`choose-file-${inputName}`}
              className="btn-tertiary js-labelFile d-flex align-items-center flex-column"
            >
              {isProfile ? (
                <>
                  <img src={selectedImage} alt="user-pic" id="imagePreviewed" />
                  <span className="js-fileName heading Poppins-Regular">
                    <i className="fas fa-pencil-alt"></i>
                    {t("Edit Image")}
                  </span>
                </>
              ) : (
                <>
                  <i className="fas fa-pencil-alt"></i>
                  <span className="js-fileName heading Poppins-Regular">
                    {!selectedImage
                      ? `${t("Add Image")}`
                      : `${t("Edit Image")}`}
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {!isProfile && (
          <div
            className={`more-view-image ${selectedImage ? "" : "d-none"}`}
            id={`selected-div-${inputName}`}
          >
            <div className="uploads d-flex align-items-center justify-content-center">
              {selectedImage && (
                <img
                  src={selectedImage}
                  className="img-fluid img"
                  alt=""
                  id={`selected-image-${inputName}`}
                />
              )}
            </div>
            {selectedImage && (
              <div
                className="placeholder-remove d-flex align-items-center justify-content-center"
                id={`delete-icon-${inputName}`}
                onClick={handleRemoveImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11.001"
                  height="11.003"
                  viewBox="0 0 11.001 11.003"
                >
                  <path
                    id="Forma_1"
                    data-name="Forma 1"
                    d="M1028.345,545.163l-3.333,3.335,3.333,3.334a1.27,1.27,0,1,1-1.795,1.8l-3.334-3.335-3.334,3.335a1.27,1.27,0,0,1-1.795-1.8l3.333-3.334-3.333-3.335a1.269,1.269,0,0,1,1.795-1.8l3.334,3.335,3.334-3.335a1.269,1.269,0,0,1,1.8,1.8Z"
                    transform="translate(-1017.715 -542.996)"
                    fill="#fff"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          hidden
          className="user-image selected-image"
          name={inputName}
          id={`selected-image-url-${inputName}`}
        />
      </div>
      <div className="image_error input-style mt-1"></div>
    </div>
  );
};

export default ImageUploader;
