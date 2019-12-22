import React, { useEffect, useState } from "react";
import { Button, Form, Col, InputGroup } from "react-bootstrap";
import { useHistory, useRouteMatch } from "react-router-dom";
import * as yup from "yup";
import { Formik } from "formik";
import User from "../../services/user";
import ProfileResetPassword from "../ProfileResetPassword";

function ProfileEdit() {
  let [profile, setProfile] = useState();

  useEffect(() => {
    console.log(profile);
    User.getProfile().then(res => {
      console.log(res);
      setProfile(res.data);
    });

    console.log("useEffect invoked");
  }, []);

  let history = useHistory();
  // let { url } = useRouteMatch();

  function submitProfile(body) {
    User.updateProfile(body).then(res => {
      if (res.data === "Success" && res.status === 200) {
        alert("Profile Updated!");
        history.push("/profile");
      }
    });
    console.log(body);
  }
  const schema = yup.object({
    name: yup.string().required(),
    username: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    email: yup
      .string()
      .email()
      .required(),
    phone: yup.string().required()
  });
  if (profile) {
    return (
      <div>
        <h4>Edit Profile</h4>
        <Formik
          validationSchema={schema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // When button submits form and form is in the process of submitting, submit button is disabled
            setSubmitting(true);
            submitProfile(values);
            // Simulate submitting to database, shows us values submitted, resets form
          }}
          initialValues={{
            name: profile.name,
            username: profile.username,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            zip: profile.zip
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
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik01">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isValid={!errors.name}
                    required={true}
                  />
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik02">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        @
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      aria-describedby="inputGroupPrepend"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      isValid={!errors.username}
                      required={true}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                    {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik03">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isValid={!errors.email}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik04">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    isValid={!errors.phone}
                  />
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik05">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    isValid={!errors.address}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik06">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    isInvalid={!!errors.city}
                    isValid={!errors.city}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik07">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="State"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    isInvalid={!!errors.state}
                    isValid={!errors.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6" controlId="validationFormik06">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Zip"
                    name="zip"
                    value={values.zip}
                    onChange={handleChange}
                    isInvalid={!!errors.zip}
                    isValid={!errors.zip}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zip}
                  </Form.Control.Feedback>

                  {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                </Form.Group>
              </Form.Row>
              <Button type="submit">Submit form</Button>
            </Form>
          )}
        </Formik>
        <div className="resetpassword">
          <h4>Reset Password</h4>
        </div>
        <ProfileResetPassword />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
export default ProfileEdit;
