import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import EditPopup from "./EditpopupMarche";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
function Marches() {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("numero"); // Default sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const [formData, setFormData] = useState({
    numero: "",
    fournisseur: "",
    prestation: "",
    montant_ttc: 0,
    tva: 0,
    dateDebut: "",
    dateFin: "",
    sitePaiement: "",
    attribution: "",
    ref_notif: "",
    num_caution_def: "",
    mt_caution_def: 0,
    num_act_eng: "",
    ref_os_debut: "",
    date_os_debut: "",
    ref_os_arret: "",
    date_os_arret: "",
    ref_os_reprise: "",
    date_os_reprise: "",
    ref_os_aug: "",
    date_os_aug: "",
    pv_reception: "",
    main_levee: "",
    observation: "",
    categorie: {
      id: null,
    },
  });

  const handleDateDebutChange = (e) => {
    const selectedDateDebut = e.target.value;
    setFormData({
      ...formData,
      dateDebut: selectedDateDebut,
    });

    // Set the minimum date for Date Fin input
    document.getElementById("dateFin").min = selectedDateDebut;
  };

  const handleDeadline = (id) => {
    axios
      .put(`http://127.0.0.1:8080/marches/deadline/${id}`, {
        // You can pass data in the request body if needed
      })
      .then((response) => {
        // Handle the success response here
        console.log("Payment successful:", response.data);

        fetchData();
      })
      .catch((error) => {
        // Handle any errors that occurred during the PUT request
        console.error("Error making payment:", error);
      });
  };

  // Handle opening the edit popup
  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditPopupOpen(true);
  };

  // add popup
  const handleAddMarket = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8080/marches/save", formData)
      .then((response) => {
        console.log("submitted form:", response);
        showToastMessage("Marché Bien Ajouté");
        setFormData({
          numero: "",
          fournisseur: "",
          prestation: "",
          montant_ttc: 0,
          tva: 0,
          dateDebut: "",
          dateFin: "",
          sitePaiement: "",
          attribution: "",
          ref_notif: "",
          num_caution_def: "",
          mt_caution_def: 0,
          num_act_eng: "",
          ref_os_debut: "",
          date_os_debut: "",
          ref_os_arret: "",
          date_os_arret: "",
          ref_os_reprise: "",
          date_os_reprise: "",
          ref_os_aug: "",
          date_os_aug: "",
          pv_reception: "",
          main_levee: "",
          observation: "",
          categorie: {
            id: "",
          },
        });
        fetchData();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  //tabs
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  const fetchCateg = () => {
    axios
      .get("http://127.0.0.1:8080/categories/all")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  //affichage marche
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8080/marches/all")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchCateg();
  }, []);

  //delete marche
  const showToastMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Tous les factures associées à ce marché seront supprimées",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Non, Annuler",
      confirmButtonText: "Oui, Supprimer!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8080/marches/delete/${id}`)
          .then(() => {
            showToastMessage("Marché Bien Supprimé");
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
          });
      }
    });
  };
  //sort date at motent
  const handleSort = (column) => {
    if (column === sortColumn) {
      // Toggle sort direction if the same column is clicked again
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set the new sorting column and default to ascending direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // filtre par numero ou categorie
  const filteredData = data.filter((item) => {
    if (
      selectedTab === "all" ||
      (selectedTab === "active" && item.categorie.name === "Fonctionnement") ||
      (selectedTab === "resilied" && item.categorie.name !== "Fonctionnement")
    ) {
      if (searchTerm.trim() === "") {
        return true;
      } else {
        return (
          item.numero.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          item.categorie.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()) ||
          item.fournisseur
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );
      }
    }
    return false;
  });
  // Sort the data based on the sorting column and direction
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      // Handle other data types here, or treat them as equal
      return 0;
    }
  });

  const getSortIcon = (column) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return "";
  };
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  sortedData.forEach((item) => {
    handleDeadline(item.id);
  });
  const handleViewClick = (record) => {
    setSelectedRecord(record);
    setIsViewPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsViewPopupOpen(false);
  };
  const user = JSON.parse(localStorage.getItem("user"));
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
            <h3 className="font-weight-bold ">Gestion des Marchés</h3>
            <input
              type="text"
              placeholder="Recherche par Numero ou par Devise/MAD ou par Fournisseur"
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
              <h4>
                {" "}
                <i className="bx bx-plus-medical font-weight-bold"></i> Ajouter
                un Marché
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
                  height: "90%",
                  marginTop: "30PX",
                }}
              >
                <div className="modal-content" style={{ overflowY: "auto" }}>
                  <div className="modal-header">
                    <h3 className="modal-title">Ajouter un Nouveau Marché</h3>
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
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            N° Marché{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="N° Marché"
                            value={formData.numero}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                numero: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Fournisseur{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Fournisseur"
                            value={formData.fournisseur}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fournisseur: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Prestation{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Prestation"
                            value={formData.prestation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                prestation: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Attribué à{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Attribué à"
                            value={formData.attribution}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                attribution: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group  col-sm-6 col-md-2">
                          <label>
                            Montant TTC{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Montant TTC"
                            value={formData.montant_ttc}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                montant_ttc: e.target.value,
                              })
                            }
                            required
                            step="any"
                          />
                        </div>
                        <div className="form-group col-sm-6 col-md-1">
                          <label>
                            TVA en %{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="TVA"
                            value={formData.tva}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tva: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label htmlFor="category">
                            Category{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <select
                            className="form-control form-control-lg"
                            value={formData.categorie.id} // Use formData.categorie.id for the selected value
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                categorie: { id: e.target.value },
                              })
                            }
                            required
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Date Debut{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Date Debut"
                            value={formData.dateDebut}
                            onChange={handleDateDebutChange}
                            required
                          />
                        </div>
                        <div className="form-group  col-sm-12  col-md-3">
                          <label>
                            Date Fin{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            id="dateFin"
                            className="form-control"
                            placeholder="Date Fin"
                            value={formData.dateFin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dateFin: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-sm-12 col-md-2">
                          <label>
                            Site de Paiement{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Site de Paiement"
                            value={formData.sitePaiement}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sitePaiement: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-2">
                          <label>
                            Lettre de Notification{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Reference"
                            value={formData.ref_notif}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ref_notif: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Num Acte d'engagement{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Reference"
                            value={formData.num_act_eng}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                num_act_eng: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-2">
                          <label>
                            {" "}
                            Caution Définitif{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Reference"
                            value={formData.num_caution_def}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                num_caution_def: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Montant Caution Définitif{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Montant Caution Définitif"
                            value={formData.mt_caution_def}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mt_caution_def: e.target.value,
                              })
                            }
                            required
                            step="any"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Début OS{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Réference"
                            value={formData.ref_os_debut}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ref_os_debut: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>
                            Date Début OS{" "}
                            <span className="asterisk" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Date Début OS"
                            value={formData.date_os_debut}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                date_os_debut: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Réf Arrêt OS</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Réference"
                            value={formData.ref_os_arret}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ref_os_arret: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Date Arrêt OS</label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Date Arrêt OS"
                            value={formData.date_os_arret}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                date_os_arret: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Reprise OS</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Réference"
                            value={formData.ref_os_reprise}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ref_os_reprise: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Date Reprise OS</label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Date Reprise OS"
                            value={formData.date_os_reprise}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                date_os_reprise: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Augmentation OS</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Réference"
                            value={formData.ref_os_aug}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ref_os_aug: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Date Augmentation OS</label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Date Arrêt OS"
                            value={formData.date_os_aug}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                date_os_aug: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-sm-12 col-md-3">
                          <label>Main Levée</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Réference"
                            value={formData.main_levee}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                main_levee: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-3">
                          <label>PV de Récéption</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Réference"
                            value={formData.pv_reception}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pv_reception: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group col-sm-12 col-md-6">
                          <label>Observations</label>
                          <input
                            className="form-control"
                            placeholder="Observations"
                            value={formData.observation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                observation: e.target.value,
                              })
                            }
                          ></input>
                        </div>
                      </div>
                      <div className="form-row"></div>
                      <div className="modal-footer">
                        <button
                          type="submit"
                          className="form-control  col-sm-12 col-md-3 btn btn-success"
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
                  Tous les marchés
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedTab === "resilied" ? "active" : ""
                  }`}
                  type="button"
                  aria-selected={selectedTab === "resilied" ? "true" : "false"}
                  onClick={() => handleTabClick("resilied")}
                  style={{
                    fontSize: "16px",
                    color: selectedTab === "resilied" ? "royalblue" : "black",
                    fontWeight: "bold",
                    outline: "none",
                  }}
                >
                  Marchés de Maintenance
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedTab === "active" ? "active" : ""
                  }`}
                  type="button"
                  aria-selected={selectedTab === "active" ? "true" : "false"}
                  onClick={() => handleTabClick("active")}
                  style={{
                    fontSize: "16px",
                    color: selectedTab === "active" ? "royalblue" : "black",
                    fontWeight: "bold",
                    outline: "none",
                  }}
                >
                  Marchés de Fonctionnement
                </button>
              </li>
            </ul>

            <div>
              <div style={{ flex: "1", margin: "15px" }}></div>{" "}
            </div>
            <div class="tab-content" id="myTabContent">
              <table
                className="table  table-hover "
                style={{ textAlign: "center" }}
              >
                <thead
                  className="table-primary table-bordered"
                  style={{ position: "sticky", top: "0" }}
                >
                  <tr>
                    <th className="table-columns"> Numero</th>
                    <th>Status</th>
                    <th>Fournisseur</th>
                    <th>Prestation</th>
                    <th onClick={() => handleSort("montantTtc")}>
                      <i class="bx bx-move-vertical"></i>
                      Montant TTC {getSortIcon("montantTtc")}
                    </th>
                    <th>Montant HT</th>
                    <th> TVA en % </th>
                    <th onClick={() => handleSort("dateDebut")}>
                      <i class="bx bx-move-vertical"></i>
                      Date Debut {getSortIcon("dateDebut")}
                    </th>
                    <th onClick={() => handleSort("dateFin")}>
                      <i class="bx bx-move-vertical"></i>
                      Date Fin {getSortIcon("dateFin")}
                    </th>

                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  {sortedData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/sidebar/detailsMA/${item.id}`}>
                          {item.numero}
                        </Link>
                      </td>

                      <td>
                        <span
                          className={`status-dot ${
                            item.status ? "active-dot" : "echu-dot"
                          }`}
                        >
                          {item.status ? "Active" : "Echu"}
                        </span>
                      </td>
                      <td>{item.fournisseur}</td>
                      <td>{item.prestation}</td>
                      <td>{item.montant_ttc}</td>
                      <td>
                        {parseFloat(item.montant_ttc) -
                          parseFloat(item.montant_ttc) *
                            (parseFloat(item.tva) / 100)}
                      </td>
                      <td>{item.tva} </td>
                      <td>
                        {item.dateDebut
                          ? new Date(item.dateDebut).toLocaleDateString(
                              "fr-FR",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          : "N/A"}
                      </td>
                      <td>
                        {item.dateFin
                          ? new Date(item.dateFin).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td>
                        <button
                          className="btn btn-dark mr-1"
                          style={{
                            pointerEvents:
                              user.role !== "Admin" ? "none" : "auto",
                          }}
                          onClick={() => handleEditClick(item)}
                        >
                          <i class="bx bxs-edit "></i>
                        </button>
                        <EditPopup
                          isOpen={isEditPopupOpen}
                          onClose={() => setIsEditPopupOpen(false)}
                          selectedRecord={selectedRecord}
                          fetchData={fetchData}
                        />
                        <button
                          className={`btn btn-danger `}
                          onClick={() => handleDelete(item.id)}
                          style={{
                            pointerEvents:
                              user.role !== "Admin" ? "none" : "auto",
                          }}
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
export default Marches;
