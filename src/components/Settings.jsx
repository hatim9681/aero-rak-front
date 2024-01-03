import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import "../App.css";
import { ToastContainer, toast } from 'react-toastify';
// Add these lines to your main index.js or App.js file
import 'react-toastify/dist/ReactToastify.css';

function Settings() {
  const [password, setPassword] = useState("");
  const [passwordsMatchError, setPasswordsMatchError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordsError, setPasswordsError] = useState("");

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [editedData, setEditedData] = useState({
    nomComplet: "",
    role: "",
    dateNaissance: "",
    motdePasse: "",
    telephone: "",
    email: "",
  });
  const storedUserData = localStorage.getItem("user");
  const user = JSON.parse(storedUserData);
  const userId = user.user_id;
  const showToastMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };
  const UserDetails = () => {
    axios
      .get(`http://127.0.0.1:8080/utilisateurs/${userId}`)
      .then((response) => {
        setEditedData({
          nomComplet: response.data.nomComplet,
          role: response.data.role,
          email: response.data.email,
          dateNaissance: response.data.dateNaissance,
          telephone: response.data.telephone,
          motdePasse: response.data.motdePasse,
        });
      })

      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };
const handleSave = async (event) => {
  event.preventDefault();

  const hashedOldPassword = CryptoJS.SHA256(password).toString(
    CryptoJS.enc.Hex
  );
  if (hashedOldPassword !== editedData.motdePasse) {
    setPasswordError("Mot de Passe incorrect");
  } else {
    const updatedData = {
      nomComplet: editedData.nomComplet,
      role: editedData.role,
      email: editedData.email,
      dateNaissance: editedData.dateNaissance,
      telephone: editedData.telephone,
      motdePasse: editedData.motdePasse,
    };
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/utilisateurs/edit/${userId}`,
        updatedData
      );

      if (response.status === 200) {
        console.log("Changes saved successfully:");
        showToastMessage('Vos informations ont été bien modifiées');

        setPasswordError(""); 
        setPassword("");
        const updatedUser = { ...user, nomComplet: updatedData.nomComplet };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        console.error(
          "Edit request failed with status code:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error editing record:", error);
    }
  }
};

const editPassword = (e) => {
  e.preventDefault();
  const hashedOldPassword = CryptoJS.SHA256(oldpassword).toString(
    CryptoJS.enc.Hex
  );

  if (hashedOldPassword !== editedData.motdePasse) {
    // Passwords don't match, set the error message
    setPasswordsError("Mot de passe incorrect");
  } else if (newpassword !== confirmpassword) {
    setPasswordsMatchError("Les mots de passe ne correspondent pas");
  } else {
    const hashedNewPassword = CryptoJS.SHA256(newpassword).toString(
      CryptoJS.enc.Hex
    );

    const updatedEditedData = {
      ...editedData,
      motdePasse: hashedNewPassword, // Corrected variable name
    };

    axios
      .put(
        `http://127.0.0.1:8080/utilisateurs/edit/${userId}`,
        updatedEditedData
      ) // Use backticks for string interpolation
      .then((response) => {
        console.log("Submitted form:");
        showToastMessage('Mot de passe bien modifié');
        setPasswordsError("");
        setPasswordsMatchError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  }
};

 
  useEffect(() => {
    UserDetails();
  }, []);
  return (
    <>
      <link
        href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link href="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous"
      />
      <div style={{ margin: "10px" }}>
        <div className="card card-header-actions ">
          <div className="card-header custom-header d-flex justify-content-between align-items-center">
            <h3 className="font-weight-bold ">Modfification de Profil</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <form
                  className="form-horizontal form-bordered"
                  onSubmit={handleSave}
                >
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h1 className="panel-title">Informations Personnelles</h1>
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Nom Complet{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            className="form-control"
                            name="nomComplet"
                            placeholder="Type your name..."
                            value={editedData.nomComplet}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Adresse Mail{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Type your email..."
                            value={editedData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Date de Naissance{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="date"
                            name="dateNaissance"
                            className="form-control"
                            value={editedData.dateNaissance}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Telephone{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            className="form-control"
                            name="telephone"
                            placeholder="Type your comment..."
                            value={editedData.telephone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Mot de Passe{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={password}
                            placeholder="Tapez votre mot de passe pour modifier vos informations"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          {passwordError && (
                            <p style={{ color: "red" }}>{passwordError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="panel-footer">
                      <div className="row">
                        <div className="col-12 text-right">
                          <button
                            type="submit"
                            className=" form-control  col-2 btn btn-success"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <form
                  name="basicForm"
                  className="form-horizontal"
                  onSubmit={editPassword}
                >
                  <div className="panel panel-default" noValidate="">
                    <div className="panel-heading">
                      <h1 className="panel-title">Mot de Passe</h1>
                    </div>
                    <div
                      ng-repeat="work in user.work_experiences"
                      className="panel-body"
                    >
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Ancien Mot de Passe{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="password"
                            name="oldpassword"
                            value={oldpassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="form-control"
                            placeholder="Ancien Mot de Passe"
                            required
                          />
                          {passwordsError && (
                            <p style={{ color: "red" }}>{passwordsError}</p>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Nouveau Mot de Passe{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="password"
                            name="newpassword"
                            value={newpassword}
                            className="form-control"
                            placeholder="Nouveau Mot de Passe"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-4 control-label">
                          Confirmation Mot de Passe{" "}
                          <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="password"
                            name="confirmpassword"
                            value={confirmpassword}
                            className="form-control"
                            placeholder="Confirmez Nouveau Mot de Passe "
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          {passwordsMatchError && (
                            <p style={{ color: "red" }}>
                              {passwordsMatchError}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="panel-footer">
                      <div className="row">
                        <div className="col-12 text-right">
                          <button className="form-control  col-2  btn btn-success">
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Settings;
