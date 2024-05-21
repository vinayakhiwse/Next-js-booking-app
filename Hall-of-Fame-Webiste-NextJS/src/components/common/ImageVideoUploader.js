import useTranslation from "@/hooks/useTranslation";
import React, { useState } from "react";

const ImageVideoUploader = ({ imageTitle = "", isRequired = false }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const { t } = useTranslation();
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      for (let index = 0; index < files.length; index++) {
        const fileurl = URL.createObjectURL(files[index]);
        setSelectedImages((oldArr) => [...oldArr, fileurl]);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <div>
      <div className="input-style">
        <label className="d-block">
          {imageTitle} {isRequired && <span className="text-danger">*</span>}
        </label>
      </div>
      <div className="upload-sec d-flex align-items-center flex-wrap">
        {/* image upload */}
        <div className="qust-filed mr-2">
          <div className="form-control py-2 d-flex align-items-center justify-content-center">
            <input
              onClick={() => {
                document.getElementById(
                  `choose-file-${selectedImages.length}`
                ).value = null;
              }}
              multiple
              type="file"
              id={`choose-file-${selectedImages.length}`}
              className="input-file d-none"
              required={selectedImages.length === 0}
              accept="video/*,image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor={`choose-file-${selectedImages.length}`}
              className="btn-tertiary js-labelFile d-flex align-items-center flex-column"
            >
              <i className="icon fa fa-plus-circle plus-icon"></i>
              <span className="js-fileName heading">
                {t("Add Image/Video")}
              </span>
            </label>
            <img
              src="/asset/loading.gif"
              id="loader"
              alt=""
              className="img-fluid loader"
              width="30"
              height="30"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div id="multiple" className="two-img w-100 d-flex mb-1 row m-0">
          {selectedImages?.map((src, index) => (
            <div className="more-view-image mb-1" key={index}>
              <div
                className={`uploads d-flex align-items-center justify-content-center ${
                  src === 1 ? "border-default" : ""
                }`}
              >
                <img src={src} className="img-fluid img" alt="" />
              </div>
              <div
                className={`d-flex align-items-center justify-content-center de placeholder-remove delete-image-js`}
                onClick={() => removeImage(index)}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageVideoUploader;
