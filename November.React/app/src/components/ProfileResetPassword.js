import React, { Component, useState } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import * as moment from "moment";
import { Formik } from "formik";
import Auth from "../services/auth";

function ProfileResetPassword(props) {
  let [passwordError, setPasswordError] = useState();
  function submitPassword(values) {
    Auth.resetPassword(values.old_password, values.new_password).then(res => {
      console.log(res.data);
      if (res.data == "password updated") {
        Auth.logout();
        localStorage.removeItem("apiKey");
        localStorage.removeItem("profile");
        localStorage.removeItem("gamelibrary");
        window.location = "/";
      } else {
        setPasswordError(res.data);
      }
    });
  }

  return (
    <div className="">
      <Formik
        initialValues={{
          again_password: "",
          new_password: "",
          old_password: ""
        }}
        validate={values => {
          const errors = {};
          if (
            !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i.test(
              values.again_password
            ) &&
            values.again_password
          ) {
            errors.again_password = `Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase`;
          } else if (values.again_password == values.old_password) {
            errors.again_password = "New password can not be same old";
          }
          if (
            values.new_password &&
            values.new_password !== values.again_password
          ) {
            errors.new_password = `Password does not match`;
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // When button submits form and form is in the process of submitting, submit button is disabled
          submitPassword(values);
          // Simulate submitting to database, shows us values submitted, resets form
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors
        }) => (
          <Form>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationFormik01">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  value={values.old_password}
                  type="password"
                  name="old_password"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationFormik01">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  values={values.again_password}
                  onChange={handleChange}
                  isInvalid={!!errors.again_password}
                  type="password"
                  name="again_password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.again_password}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationFormik01">
                <Form.Label>New Password Again</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  value={values.new_password}
                  type="password"
                  name="new_password"
                  onChange={handleChange}
                  isInvalid={!!errors.new_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.new_password}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Button
              disabled={
                errors.new_password ||
                errors.again_password ||
                !values.old_password ||
                !values.again_password ||
                !values.new_password
              }
              onClick={() => submitPassword(values)}
              type="button"
            >
              Update Password
            </Button>
            {passwordError}
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default ProfileResetPassword;
