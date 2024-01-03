import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import EditPrestataire from "./EditpopupPrestataire";
import FacturationPresta from "./FacturationPresta";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
function Prestataires() {
  const [data, setData] = useState([]);
  const [prestdata, setprestData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showSuiviFactures, setShowSuiviFactures] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    service: "",
    commentaire: "",
  });
  const showToastMessage = (message) => {
    toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
};
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isFacturationPrestPopupOpen, setIsFacturationPrestPopupOpen] =
    useState(false);
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8080/prestataires/all")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchpresData = (id) => {
    axios
      .get(`http://127.0.0.1:8080/factures/prest/${id}`)
      .then((response) => {
        setShowSuiviFactures(true);
        setprestData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleNomClick = (item) => {
    fetchpresData(item.id);
    setSelectedItem(item);
  };
  useEffect(() => {
    fetchData();
    fetchpresData();
  }, []);
  // Handle opening the  popup
  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditPopupOpen(true);
  };
  const handleFactrurationClick = (record) => {
    setSelectedRecord(record);
    setIsFacturationPrestPopupOpen(true);
  };

  // add popup
  const handleAddMarket = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
 ;
 const filteredData = data.filter((item) => {
  if (
    selectedTab === "all" ||
    (selectedTab === "Eau" && item.service === "Eau") ||
    (selectedTab === "Electricité" && item.service === "Electricité") || 
    (selectedTab === "Internet" && item.service === "Internet")
  ) {
    if (searchTerm.trim() === "") {
      return true;
    } else {
      return (
        item.nom.toLowerCase().includes(searchTerm.trim().toLowerCase()) 
          
      );
    }
  }
  return false;
});

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8080/prestataires/save", formData) // Replace with your actual API endpoint URL
      .then((response) => {
        console.log("submitted form:", response);
        fetchData();
        handleCloseModal();
        showToastMessage("Prestataire Bien Ajouté  ");
        setFormData({
          nom: "",
    service: "",
    commentaire: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  //tabs
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  //delete
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Tous les factures associées à ce prestataire seront supprimées',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Non, Annuler',
      confirmButtonText: 'Oui, Supprimer!',
     
      
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8080/prestataires/delete/${id}`)
          .then(() => {
            setData((prevData) => prevData.filter((item) => item.id !== id));
            setShowSuiviFactures(false);
            showToastMessage('Prestataire Bien Supprimé');
          })
          .catch((error) => {
            console.error('Error deleting data:', error);
          });
      } 
    });
  };

  const [selectedRecord, setSelectedRecord] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
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
       

        {/* Modal */}
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{
            display: showModal ? "block" : "none",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal-dialog modal-lg "
            style={{
              display: "block",
              marginTop: "150PX",
              alignItems: "center",
              justifyContent: "center",

              width: "400px",
              marginLeft: "auto",
            }}
          >
            <div className="modal-content">
              <div className="modal-header ">
                <h3 className="modal-title">Ajouter une Nouvelle Charge</h3>
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
                    <div className="form-group col-md-12">
                      <label>Nom Prestataire </label>
                      <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom Prestataire"
                        value={formData.nom}
                        onChange={(e) =>
                          setFormData({ ...formData, nom: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <label htmlFor="category">Service </label>
                      <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                      <select
                        className="form-control form-control-lg"
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        required
                      >
                        <option value="">Select a Service</option>
                        <option value="Eau">Eau</option>
                        <option value="Electricité">Electricité</option>
                        <option value="Internet">Internet</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="Commentaire">Commentaire</label>
                    
                    <textarea
                      className="form-control"
                      id="Commentaire"
                      rows="3"
                      placeholder="Commentaire"
                      value={formData.commentaire}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commentaire: e.target.value,
                        })
                      }
                    ></textarea>
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
        {/* popup ends here */}
        {/* data */}
        <div className="card card-header-actions ">
          <div className="card-header custom-header d-flex justify-content-between align-items-center">
            <h3 className="font-weight-bold ">Gestion des Charges Fixes</h3>
            <input
                  type="text"
                  placeholder="Recherche par Nom"
                  className="form-control col-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    fontSize: "12px",
                    height: "35px",
                    width: "300px",
                  }}
                />
            <a
              href="#"
              style={{ color: "white", textDecoration: "none" }}
              onClick={handleAddMarket}
            >
              <h4><i className="bx bx-plus-medical font-weight-bold"></i> Ajouter une Charge</h4>
            </a>
          </div>
          <div className="card-body">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedTab === "all" ? "active" : ""
                  }`}
                  type="button"
                  aria-selected={selectedTab === "all" ? "true" : "false"}
                  onClick={() => handleTabClick("all")}
                  style={{
                    fontSize: "16px",
                    color: selectedTab === "all" ? "royalblue" : "black",
                    fontWeight: "bold",
                    outline: "none",
                  }}
                >
                  Tous Les Charges Fixes
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedTab === "Eau" ? "active" : ""
                  }`}
                  type="button"
                  aria-selected={selectedTab === "Eau" ? "true" : "false"}
                  onClick={() => handleTabClick("Eau")}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: selectedTab === "Eau" ? "royalblue" : "black",

                    outline: "none",
                  }}
                >
                   Charges d'Eau
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedTab === "Electricité" ? "active" : ""
                  } `}
                  type="button"
                  aria-selected={
                    selectedTab === "Electricité" ? "true" : "false"
                  }
                  onClick={() => handleTabClick("Electricité")}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    outline: "none",
                    color:
                      selectedTab === "Electricité" ? "royalblue" : "black",
                  }}
                >
                   Charges d'Electricité
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedTab === "Internet" ? "active" : ""
                  } `}
                  type="button"
                  aria-selected={selectedTab === "Internet" ? "true" : "false"}
                  onClick={() => handleTabClick("Internet")}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    outline: "none",
                    color: selectedTab === "Internet" ? "royalblue" : "black",
                  }}
                >
                   Charges d'Internet
                </button>
              </li>
            </ul>

            <div style={{ margin: "10px" }}></div>

            <div>
              <div style={{ flex: "1", margin: "10px" }}></div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px",
                }}
              ></div>
              <div style={{ flex: "1", margin: "10px" }}></div>{" "}
            </div>
            <div class="tab-content" id="myTabContent">
              <table
                className="table   table-hover "
                style={{ textAlign: "center" }}
              >
                <thead className="table-primary table-bordered">
                  <tr>
                    <th className="actions-columns">Facture</th>
                    <th>Nom Prestataire</th>
                    <th>Service</th>
                    <th>Commentaire</th>

                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleFactrurationClick(item)}
                        >
                          <i class="bx bxs-edit"></i> Facturer
                        </button>
                        {isFacturationPrestPopupOpen && (
                          <FacturationPresta
                            isOpen={isFacturationPrestPopupOpen}
                            onClose={() =>
                              setIsFacturationPrestPopupOpen(false)
                            }
                            selectedRecord={selectedRecord}
                            fetchData={fetchpresData}
                          />
                        )}
                      </td>
                      <td>
                        <a href="#" onClick={() => handleNomClick(item)}>
                          {item.nom}
                        </a>
                      </td>
                      <td>{item.service}</td>
                      <td>{item.commentaire}</td>

                      <td>
                        <button
                          className="btn btn-dark mr-1"
                          onClick={() => handleEditClick(item)}
                          style={{ pointerEvents: user.role !== 'Admin' ? 'none' : 'auto' }}

                        >
                          <i class="bx bxs-edit "></i> Modifier
                        </button>
                        <EditPrestataire
                          isOpen={isEditPopupOpen}
                          onClose={() => setIsEditPopupOpen(false)}
                          selectedRecord={selectedRecord}
                          fetchData={fetchData}
                        />
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                          style={{ pointerEvents: user.role !== 'Admin' ? 'none' : 'auto' }}

                        >
                          <i class="bx bx-trash "></i> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {showSuiviFactures && (
            <div className="card card-header-actions ">
              <div className="card-header custom-header d-flex justify-content-between align-items-center">
                <h4 className="font-weight-bold "> Suivi des Factures de {selectedItem?.nom} </h4>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead className="table-primary">
                    <tr>
                      <th>N° Facture</th>
                      <th>Status</th>
                      <th>Date Reception</th>
                      <th>Date Facture</th>
                      <th>Date Arrivee BO</th>
                      <th>Periode </th>
                      <th>Montant TTC</th>

                      <th>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestdata.map((item) => (
                      <tr key={item.id}>
                        <td>{item.numero}</td>
                        <td>
                          {" "}
                          {item.status ? (
                            <span className="status-dot active-dot"></span>
                          ) : (
                            <span className="status-dot echu-dot"></span>
                          )}
                        </td>
                        <td>{item.date_reception}</td>
                        <td>{item.date_fac}</td>

                        <td>{item.date_arrive}</td>
                        <td>
                          DU {item.periode_debut} <br></br> AU{" "}
                          {item.periode_fin}{" "}
                        </td>
                        <td>{item.montant_ttc} MAD</td>
                        <td>{item.service}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
               
              </div>
            </div>
          )}
        
        </div>
        <ToastContainer />
      </div>
     
    </>
  );
}
export default Prestataires;
