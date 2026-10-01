

import React from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import { customerSignUp, resetState } from "../../features/auth/authSlice";
import CustomInput from "../../components/CustomInput";

const Schema = yup.object({
  username: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10 digit phone number")
    .required("Phone number is required"),
  role: yup.string().required("Please select a role"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AddUser = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    },
    validationSchema: Schema,
    onSubmit: (values, { resetForm }) => {
      dispatch(customerSignUp(values));
      resetForm();

      setTimeout(() => {
        dispatch(resetState());
      }, 300);
    },
  });

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Add New User</h3>
          <p className="text-muted mb-0">
            Create a new administrator account.
          </p>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">

              <div className="col-md-6 mb-4">
                <CustomInput
                  type="text"
                  label="Full Name"
                  name="username"
                  onCh={formik.handleChange}
                  onBl={formik.handleBlur}
                  val={formik.values.username}
                />
                <small className="text-danger">
                  {formik.touched.username && formik.errors.username}
                </small>
              </div>

              <div className="col-md-6 mb-4">
                <CustomInput
                  type="email"
                  label="Email Address"
                  name="email"
                  onCh={formik.handleChange}
                  onBl={formik.handleBlur}
                  val={formik.values.email}
                />
                <small className="text-danger">
                  {formik.touched.email && formik.errors.email}
                </small>
              </div>

              <div className="col-md-6 mb-4">
                <CustomInput
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  onCh={formik.handleChange}
                  onBl={formik.handleBlur}
                  val={formik.values.phone}
                />
                <small className="text-danger">
                  {formik.touched.phone && formik.errors.phone}
                </small>
              </div>

              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Select Role
                </label>

                <select
                  className={`form-select ${
                    formik.touched.role && formik.errors.role
                      ? "is-invalid"
                      : ""
                  }`}
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Choose Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="subadmin">Sub Admin</option>
                </select>

                <div className="invalid-feedback">
                  {formik.errors.role}
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <CustomInput
                  type="password"
                  label="Password"
                  name="password"
                  onCh={formik.handleChange}
                  onBl={formik.handleBlur}
                  val={formik.values.password}
                />
                <small className="text-danger">
                  {formik.touched.password && formik.errors.password}
                </small>
              </div>

            </div>

            <hr />

            <div className="d-flex justify-content-end gap-3 mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => formik.resetForm()}
              >
                Reset
              </button>

              <button
                type="submit"
                className="btn btn-success px-5"
              >
                <i className="fas fa-user-plus me-2"></i>
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;