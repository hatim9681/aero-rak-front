import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditPopup from "./EditpopupMarche";
import FacturationMA from "./FacturationMarche";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import AddPayement from "./AddPayement";
function MarcheDetails() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [facdata, setfacData] = useState([]);
  const [payData, setpayData] = useState([]);
  const fetchData = () => {
    axios
      .get(`http://127.0.0.1:8080/marches/${id}`)
      .then((response) => {
        setData(response.data);
        console.log("ok" + data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchfacData = () => {
    axios
      .get(`http://127.0.0.1:8080/factures/marche/${id}`)
      .then((response) => {
        setfacData(response.data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleCloturer = (id) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const today = new Date().toLocaleDateString("fr-FR", options);
    Swal.fire({
      title: "Êtes-vous sûr de clotûrer ce Marché ?",
      text: `Ce marché sera clotûrer sous la date d'aujourd'hui : ${today}`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Non, Annuler",
      confirmButtonText: "Oui, Clotûrer!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://127.0.0.1:8080/marches/end/${id}`)
          .then((response) => {
            // Handle the success response here
            fetchData();
          })

          .catch((error) => {
            // Handle any errors that occurred during the PUT request
            console.error("Error making payment:", error);
          });
      }
    });
  };

  const fetchpayData = () => {
    axios
      .get(`http://127.0.0.1:8080/payements/marche/${id}`)
      .then((response) => {
        setpayData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const showToastMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous voulez vraiment supprimer ce payement",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Non, Annuler",
      confirmButtonText: "Oui, Supprimer!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8080/payements/delete/${id}`)
          .then(() => {
            showToastMessage("Payement Bien Supprimé");
            fetchpayData();
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
          });
      }
    });
  };
  useEffect(() => {
    fetchData();
    fetchfacData();
    fetchpayData();
  }, []);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditPopupOpen(true);
  };
  const [isFacturationMAPopupOpen, setIsFacturationMAPopupOpen] =
    useState(false);
  const handleFactrurationClick = (record) => {
    setSelectedRecord(record);
    setIsFacturationMAPopupOpen(true);
  };
  const [isPaymentMaPopupOpen, setIsPaymentMaPopupOpen] = useState(false);
  const handlePayementClick = (record) => {
    setSelectedRecord(record);
    setIsPaymentMaPopupOpen(true);
  };
  const dateDebut = new Date(data.dateDebut);
  const dateFin = new Date(data.dateFin);
  const diffTime = Math.abs(dateFin - dateDebut);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  const DataTable = ({ data }) => {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <strong>Fournisseur : </strong>
            </td>
            <td>{data.fournisseur || "N/A"}</td>
          </tr>

          <tr>
            <td>
              <strong>Prestation : </strong>
            </td>
            <td>{data.prestation || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Montant TTC : </strong>
            </td>
            <td>{data.montant_ttc || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>TVA : </strong>
            </td>
            <td>{data.tva || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Date Debut : </strong>
            </td>
            <td>
              {data.dateDebut
                ? new Date(data.dateDebut).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Date Fin : </strong>
            </td>
            <td>
              {data.dateFin
                ? new Date(data.dateFin).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </td>{" "}
          </tr>
          <tr>
            <td>
              <strong>Duree : </strong>
            </td>
            <td>{"< " + diffYears + " Ans (" + diffDays + " Jours)"}</td>
          </tr>
          <tr>
            <td>
              <strong>Site Paiement : </strong>
            </td>
            <td>{data.sitePaiement || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Attribué à : </strong>
            </td>
            <td>{data.attribution || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Notification : </strong>
            </td>
            <td>{data.ref_notif || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>N° Caution Definitif : </strong>
            </td>
            <td>{data.num_caution_def || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Mnt Caution Definitif : </strong>
            </td>
            <td>{data.mt_caution_def || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong> Act Engagement : </strong>
            </td>
            <td>{data.num_act_eng || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong> Réf OS Debut : </strong>
            </td>
            <td>{data.ref_os_debut || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Date OS Debut : </strong>
            </td>
            <td>
              {data.date_os_debut
                ? new Date(data.date_os_debut).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Réf OS Arret : </strong>
            </td>

            <td>{data.ref_os_arret || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Date OS Arret : </strong>
            </td>
            <td>
              {data.date_os_arret
                ? new Date(data.date_os_arret).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Réf OS Reprise : </strong>
            </td>
            <td>{data.ref_os_reprise || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Date OS Reprise : </strong>
            </td>
            <td>
              {data.date_os_reprise
                ? new Date(data.date_os_reprise).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Réf OS Augmentation : </strong>
            </td>
            <td>{data.ref_os_aug || "N/A"}</td>
          </tr>

          <td>
            <strong>Date OS Augmentation : </strong>
          </td>
          <td>
            {data.date_os_aug
              ? new Date(data.date_os_aug).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </td>

          <tr>
            <td>
              <strong>PV de Reception : </strong>
            </td>
            <td>{data.pv_reception || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Main Levee : </strong>
            </td>
            <td>{data.main_levee || "N/A"}</td>
          </tr>
          <tr>
            <td>
              <strong>Observations : </strong>
            </td>
            <td>{data.observation || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    );
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
      <div style={{ margin: "20px" }}>
        <div className="card card-header-actions ">
          <div className="card-header custom-header d-flex justify-content-between align-items-center">
            <h3 className="font-weight-bold ">
              Suivi du Marché N° {data.numero}
            </h3>
            <button
              className={`ml-auto btn ${
                data.status ? "btn-success" : "btn-danger"
              }`}
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                pointerEvents:
                  !data.status || user?.role !== "Admin" ? "none" : "auto",
              }}
              onClick={
                !data.status || user.role !== "Admin"
                  ? undefined
                  : () => handleCloturer(data.id)
              }
            >
              {!data.status ? "Marché Echu" : "Active : Clotûrer"}
            </button>
          </div>
          <div className="card-body">
            <div className="container-xl px-4 ">
              <hr className="mt-0 " />
              <div className="row">
                <div className="col-lg-3">
                  <div className="card">
                    <div className="card-header custom-header d-flex justify-content-between align-items-center">
                      <h6 className="font-weight-bold ">
                        {" "}
                        Informations du Marché
                      </h6>
                      <a
                        href="#"
                        style={{
                          color: "white",
                          textDecoration: "none",
                          pointerEvents:
                            user.role !== "Admin" ? "none" : "auto",
                        }}
                        onClick={() => handleEditClick(data)}
                      >
                        <i className="bx bx-pencil font-weight-bold"></i>{" "}
                        Modifier
                      </a>
                    </div>
                    <div className="card-body">
                      <div style={{ display: "flex" }}>
                        <div style={{ flex: 1 }}>
                          <DataTable data={data} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="card card-header-actions mb-4">
                    <div
                      className="card-header custom-header d-flex justify-content-between align-items-center"
                      style={{ height: "50%" }}
                    >
                      <h6 className="font-weight-bold ">Suivi des Paiements</h6>
                      <a
                        href="#"
                        style={{ color: "white", textDecoration: "none" }}
                        onClick={() => handlePayementClick(data)}
                      >
                        <i className="bx bx-plus-medical font-weight-bold"></i>{" "}
                        Ajouter
                      </a>
                    </div>
                    {isPaymentMaPopupOpen && (
                      <AddPayement
                        isOpen={isPaymentMaPopupOpen}
                        onClose={() => setIsPaymentMaPopupOpen(false)}
                        selectedRecord={selectedRecord}
                        fetchData={fetchpayData}
                      />
                    )}
                    <div className="card-body">
                      <table className="table">
                        <thead className="table-primary">
                          <tr>
                            <th>Banque</th>
                            <th>RIB</th>
                            <th>ASF</th>
                            <th>CNSS</th>
                            <th>Decomptes</th>
                            <th>Rapport</th>
                            <th>SLO</th>
                            <th>Penalites</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.banque}</td>
                              <td>{item.rib}</td>
                              <td>{item.asf}</td>
                              <td>{item.cnss}</td>
                              <td>{item.decomptes}</td>
                              <td>{item.rapport}</td>
                              <td>{item.slo}</td>
                              <td>{item.penalites}</td>
                              <td>
                                {" "}
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
                  </div>
                  <div className="card card-header-actions mb-4">
                    <div
                      className="card-header custom-header d-flex justify-content-between align-items-center"
                      style={{ height: "50%" }}
                    >
                      <h6 className="font-weight-bold ">Suivi des Factures</h6>

                      <a
                        href="#"
                        style={{ color: "white", textDecoration: "none" }}
                        onClick={() => handleFactrurationClick(data)}
                      >
                        <i className="bx bx-plus-medical font-weight-bold"></i>{" "}
                        Ajouter
                      </a>

                      {isFacturationMAPopupOpen && (
                        <FacturationMA
                          isOpen={isFacturationMAPopupOpen}
                          onClose={() => setIsFacturationMAPopupOpen(false)}
                          selectedRecord={selectedRecord}
                          fetchData={fetchfacData}
                        />
                      )}
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
                          {facdata.map((item, index) => (
                            <tr key={index}>
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

                              <td>{item.montant_ttc}</td>

                              <td>{item.observation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <EditPopup
                    isOpen={isEditPopupOpen}
                    onClose={() => setIsEditPopupOpen(false)}
                    selectedRecord={selectedRecord}
                    fetchData={fetchData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default MarcheDetails;
