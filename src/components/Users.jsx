import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import { Link, Outlet, Navigate } from "react-router-dom";
function Users() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    nomComplet: "",
    role: "",
    email: "",
    motdePasse: "",
    confirmPassword: "",
    dateNaissance: "",
  });

  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8080/utilisateurs/all")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // add popup
  const handleAddMarket = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.motdePasse !== formData.confirmPassword) {
      // Passwords don't match, set the error message
      setPasswordsMatchError("Les mots de passe ne correspondent pas");
      return;
    }

    axios
      .get(`http://127.0.0.1:8080/utilisateurs/check-email/${formData.email}`)
      .then((emailResponse) => {
        if (emailResponse.data) {
          // Email already exists, handle the error
          setEmailError("Cette adresse email existe déjà");
        } else {
          // Email does not exist, proceed with form submission
          // Hash the password
          const hashedPassword = CryptoJS.SHA256(formData.motdePasse).toString(
            CryptoJS.enc.Hex
          );
          const updatedFormData = {
            ...formData,
            motdePasse: hashedPassword,
          };
          axios
            .post("http://127.0.0.1:8080/utilisateurs/save", updatedFormData) // Replace with your actual API endpoint URL
            .then((response) => {
              console.log("submitted form:");
              fetchData();

              setPasswordsMatchError("");
              setEmailError("");
              handleCloseModal();
              setFormData({
                nomComplet: "",
                role: "",
                email: "",
                motdePasse: "",
                confirmPassword: "",
                telephone: "",
                dateNaissance: "",
              });
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error);

        setEmailError("Erreur lors de la vérification de l'email");
      });
  };

  //delete marche
  const handleDelete = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!shouldDelete) {
      return;
    }
    axios
      .delete(`http://127.0.0.1:8080/utilisateurs/delete/${id}`)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  //sort date at motent

  // filtre par numero
  const filteredData = data.filter((item) => {
    if (searchTerm.trim() === "") {
      return true;
    } else {
      return item.nomComplet
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
    }
  });
  // Sort the data based on the sorting column and direction
  const storedUserData = localStorage.getItem("user");
  if (JSON.parse(storedUserData).role !== "Admin") {
    // Parse the JSON string to get the JavaScript object
    return <Navigate to="/" />;
  }
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
            <h3 className="font-weight-bold ">Gestion des Utilisateurs</h3>
            <input
              type="text"
              placeholder="Recherche par Nom"
              className="form-control col-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <a
              href="#"
              style={{ color: "white", textDecoration: "none" }}
              onClick={handleAddMarket}
            >
              <h4>
                {" "}
                <i className="bx bx-plus-medical font-weight-bold"></i> Inscrire
                un Utilisateur
              </h4>
            </a>
          </div>
          <div className="card-body">
            {/* Modal */}
            <div
              className={`modal fade ${showModal ? "show" : ""}`}
              style={{
                display: showModal ? "block" : "none",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="modal-dialog modal-lg"
                style={{
                  display: "fixed",
                  justifyContent: "center",
                  width: "70%",
                  height: "50%",
                  marginTop: "150PX",
                }}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title">Nouvelle Inscription</h3>
                    <button
                      type="button"
                      className="close"
                      onClick={handleCloseModal}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Nom Complet <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                          
                          <input
                            className="form-control"
                            placeholder="Nom Complet"
                            value={formData.nomComplet}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nomComplet: e.target.value,
                              })
                            }
                            required
                          ></input>
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="category">Rôle <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                          
                          <select
                            className="form-control form-control-lg"
                            value={formData.role}
                            onChange={(e) =>
                              setFormData({ ...formData, role: e.target.value })
                            }
                            required
                          >
                            <option value="">Select a Rôle</option>
                            <option value="Admin">Admin</option>
                            <option value="Opérateur">
                              Opérateur de saisie
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Adresse Mail <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                        
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Adresse Mail"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                        {emailError && (
                          <p style={{ color: "red" }}>{emailError}</p>
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Mot de Passe <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Mot de Passe"
                            value={formData.motdePasse}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                motdePasse: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Confirmation Mot de Passe <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                          <input
                            type="password"
                            className={`form-control ${
                              passwordsMatchError ? "is-invalid" : ""
                            }`}
                            placeholder="Confirmez Mot de Passe"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          {passwordsMatchError && (
                            <div
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {passwordsMatchError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Telephone <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Telephone"
                            value={formData.telephone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                telephone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Date de Naissance <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                          <input
                            type="date"
                            className="form-control"
                            value={formData.dateNaissance}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dateNaissance: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="submit"
                          className="btn btn-success form-control col-3"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ flex: "1", margin: "10px" }}></div>{" "}
            </div>
            <div class="tab-content" id="myTabContent">
              <table className="table" style={{ textAlign: "center" }}>
                <thead className="table-primary">
                  <tr>
                    <th>Nom Complet</th>
                    <th>Rôle</th>
                    <th>Email</th>
                    <th>Telephone</th>

                    <th>Date de Naissance</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nomComplet}</td>
                      <td>{item.role}</td>
                      <td>{item.email}</td>
                      <td>{item.telephone}</td>
                      <td>
                        {new Date(item.dateNaissance).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i class="bx bx-trash "></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Users;
