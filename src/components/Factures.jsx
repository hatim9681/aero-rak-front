import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
function Factures() {
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("resilied");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalMontant, setTotalMontant] = useState("");

  const [formData, setFormData] = useState({
    numero: "",
    fournisseur: "",
    dateDebut: "",
    dateFin: "",
    montantTtc: null,
    status: null, // Default to 'Active'
    categorie: {
      id: null, // Initialize with appropriate value or null
    },
    observation: "",
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

  // Handle opening the edit popup

  //tabs
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  //affichage marche
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8080/factures/all")
      .then((response) => {
        setData(response.data);
        const facturesWithStatusFalse = response.data.filter(
          (facture) => !facture.status
        );
        const totalMontant = facturesWithStatusFalse.reduce(
          (sum, facture) => sum + facture.montant_ttc,
          0
        );
        setTotalMontant(totalMontant);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const isArchiveTab = selectedTab === "active";

  const handlePayClick = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irreversible ,\n Êtes-vous sûr de vouloir régler ce paiement ?",
      icon: "question",
      showCancelButton: true,

      cancelButtonText: "Non, Annuler",
      confirmButtonText: "Oui, Régler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://127.0.0.1:8080/factures/pay/${id}`, {
            // You can pass data in the request body if needed
          })
          .then((response) => {
            // Handle the success response here
            console.log("Payment successful:", response.data);
            Swal.fire({
              title: "Facture réglée",
              icon: "success",
            });
            fetchData();
          })
          .catch((error) => {
            // Handle any errors that occurred during the PUT request
            console.error("Error making payment:", error);
          });
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  //delete marche
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette facture sera supprimée',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Non, Annuler',
      confirmButtonText: 'Oui, Supprimer!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8080/factures/delete/${id}`)
          .then(() => {
            setData((prevData) => prevData.filter((item) => item.id !== id));
            showToastMessage('Facture Bien Supprimé');
          })
          .catch((error) => {
            console.error('Error deleting data:', error);
          });
      }
    });
  };
  const showToastMessage = (message) => {
    toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
};
  // filtre par numero ou categorie
  const filteredData = data.filter((item) => {
    if (
      (selectedTab === "active" && item.status) ||
      (selectedTab === "resilied" && !item.status)
    ) {
      if (searchTerm.trim() === "") {
        return true;
      } else {
        return (item.numero
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()));
      }
    }
    return false;
  });
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
            <h3 className="font-weight-bold ">Paiement des Factures</h3>
            <input
              type="text"
              placeholder="Recherche par Numero"
              className="form-control col-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontSize: "16px",
                height: "35px",
                width: "300px",
              }}
            />
          </div>
          <div className="card-body">
            {/* data */}
            <ul className="nav nav-tabs">
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
                  Facture Non Réglé
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
                  Factures Archivés
                </button>
              </li>
              <button
                className="ml-auto btn btn-warning "
                style={{
                  fontSize: "16px", 
                  fontWeight: "bold", 
                  pointerEvents: "none",
                }}
              >
                Montant Total Non Réglé : {totalMontant} MAD
              </button>
            </ul>

            <div>
              <div style={{ flex: "1", margin: "10px" }}></div>
              <div style={{ flex: "1", margin: "10px" }}></div>{" "}
            </div>
            <div class="tab-content" id="myTabContent">
              <table className="table" style={{ textAlign: "center" }}>
                <thead className="table-primary">
                  <tr>
                    <th>Payement</th>
                    <th>N° Facture</th>
                    <th>Date Reception</th>
                    <th>Date Facture</th>
                    <th>Date Arrivee BO</th>
                    <th>Delai</th>
                    <th>Nature Prestation</th>
                    <th>Periode de Facturation</th>
                    <th>Fournisseur / Prestataire</th>
                    <th>Produit / Service</th>
                    <th>Montant TTC</th>
                    <th>Observations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      {!isArchiveTab && (
                        <td>
                          {" "}
                          <button
                            className=" btn btn-success"
                            onClick={() => handlePayClick(item.id)}
                          >
                            <i class="bx bx-credit-card"></i> Payer
                          </button>
                        </td>
                      )}
                      {isArchiveTab && (
    <td>
        <button
            className="btn btn-danger"
            onClick={() => handlePayClick(item.id)}
        >
            <i className="bx bx-credit-card"></i> Unpayer
        </button>
    </td>
)}
                      <th>{item.numero}</th>
                      <td>{item.date_reception}</td>
                      <td>{item.date_fac}</td>
                      <td>{item.date_arrive}</td>
                      <td>
                        {(() => {
                          const today = new Date();
                          const dateReception = new Date(item.date_reception);

                          const timeDifference = today - dateReception;

                          const daysDifference = Math.floor(
                            timeDifference / (1000 * 60 * 60 * 24)
                          );

                          return daysDifference;
                        })()}{" "}
                        J
                      </td>
                      <td>{item.nature}</td>
                      <td>
                        DU {item.periode_debut}
                        <br></br> AU {item.periode_fin}
                      </td>
                      <td>{item.fournisseur}</td>
                      <td>{item.service}</td>
                      <td>{item.montant_ttc}</td>
                      <td>{item.observation}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id)}
                          style={{pointerEvents: user.role !== 'Admin' ? 'none' : 'auto' }}
                        >
                          <i class="bx bx-trash "></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>{" "}
        </div>{" "}
      </div>
    </>
  );
}
export default Factures;
