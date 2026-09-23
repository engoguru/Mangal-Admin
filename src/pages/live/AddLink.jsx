import { useDispatch, useSelector } from "react-redux";
import {toast} from "react-hot-toast";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput";
import { createLinkThunk, getSinLiveThunk, resetState } from "../../features/liveLink/livelinkSlice";


let Schema = yup.object().shape({
  link: yup.string().required("Link is Required"),
});

const AddLink = () => {


      const dispatch = useDispatch();
      const location = useLocation();
      const getLinkid = location.pathname.split("/")[3];
      const navigate = useNavigate();

      const newLinks = useSelector((state) => state?.liveLink);

    const {
      isSuccess,
      isError,
      isLoading,
      doneLive,
      liveLink,
    } = newLinks;

    useEffect(() => {
      if (getLinkid !== undefined) {
        dispatch(getSinLiveThunk(getLinkid));
      } else {
        dispatch(resetState());
      }
    }, [getLinkid]);

    useEffect(() => {
      if (isSuccess && doneLive) {
        toast.success("Data Added Successfullly!");
      }
      if (isError) {
        toast.error("Something Went Wrong!");
      }
    }, [isSuccess, isError, isLoading]);

    
    // formik validation
    const formik = useFormik({
      initialValues: {
        link: liveLink?.link || "",
      },
      validationSchema: Schema,
      onSubmit: (values) => {
          dispatch(createLinkThunk(values));
          formik.resetForm();
          setTimeout(() => {
            dispatch(resetState());
          }, 300);
      },
    });

    return (
        <>
          {/* <div>
          <h3 className="mb-4 title">
            {getLinkid !== undefined ? "Edit" : "Add"} link
          </h3>
          <div>
            <form
              action=""
              onSubmit={formik.handleSubmit}
              className="d-flex gap-3 flex-column"
            >


              <CustomInput
                type="text"
                label="Enter Link"
                name="link"
                onCh={formik.handleChange("link")}
                val={formik.values.link}
                onBl={formik.handleBlur("link")}
              />

              <div className="error">
                {formik.touched.link && formik.errors.link}
              </div>
              

              <button
                type="submit"
                className="btn btn-success border-0 rounded-3 my-1 w-100"
              >
                {getLinkid !== undefined ? "Edit" : "Add"} link
              </button>
            </form>
          </div>
        </div> */}



        <div className="container-fluid px-4">
  <div className="row justify-content-center">
    <div className="col-lg-8 col-xl-6">
      <div className="card shadow-sm border-0 rounded-4">

        <div className="card-header bg-white border-bottom py-3">
          <h3 className="mb-0 fw-bold text-dark">
            {getLinkid ? "Edit Link" : "Add New Link"}
          </h3>
          <small className="text-muted">
            {getLinkid
              ? "Update the existing link."
              : "Create a new link for the application."}
          </small>
        </div>

        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Link URL
              </label>

              <CustomInput
                type="text"
                label="https://example.com"
                name="link"
                onCh={formik.handleChange("link")}
                onBl={formik.handleBlur("link")}
                val={formik.values.link}
              />

              {formik.touched.link && formik.errors.link && (
                <small className="text-danger">
                  {formik.errors.link}
                </small>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light border px-4"
                onClick={() => formik.resetForm()}
              >
                Reset
              </button>

              <button
                type="submit"
                className="btn btn-success px-5"
              >
                {getLinkid ? "Update Link" : "Save Link"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</div>
        </>

    )
}

export default AddLink;