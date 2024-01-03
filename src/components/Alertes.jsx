import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
function Alertes() {
  const [data, setData] = useState([]);

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
            fetchData();
            Swal.fire({
              title: "Facture réglée",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            // Handle any errors that occurred during the PUT request
            console.error("Error making payment:", error);
          });
      }
    });
  };
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8080/factures/all")
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
  function filterFactures(item) {
    const today = new Date();
    const dateReception = new Date(item.date_reception);
    const timeDifference = today - dateReception;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const isMarche = item.nature === "Marché";

    // Determine the threshold value based on item.nature
    const threshold = isMarche ? 25 : 15;
    // Check if the facture has a delay of 20 or more days, is not archived, and status is false
    return daysDifference > threshold && item.status === false;
  }

  // Use the filter method to create a filteredData array
  const filteredData = data.filter(filterFactures);
  const alertsCount = filteredData.length;
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossorigin="anonymous"
      ></link>
      <link
        href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <div style={{ margin: "10px" }}>
        <div className="card card-header-actions ">
          <div className="card-header custom-header d-flex justify-content-between align-items-center">
            <h3>
              Alertes de Paiement <i class="bx bx-error" />
            </h3>
          </div>
          <div className="card-body">
            {filteredData.map((item) => {
              const today = new Date();
              const dateReception = new Date(item.date_reception);
              const timeDifference = today - dateReception;
              const daysDifference = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
              );
              let headerClass;
              let headerText;

              if (item.nature === "Marché") {
                headerClass = daysDifference >= 35 ? "bg-danger" : "bg-warning";
                headerText =
                  daysDifference >= 35 ? "Attention !!" : "Avertissement !!";
              } else {
                headerClass = daysDifference >= 20 ? "bg-danger" : "bg-warning";
                headerText =
                  daysDifference >= 20 ? "Attention !!" : "Avertissement !!";
              }

              return (
                <div key={item.id}>
                  <div className={`card-header ${headerClass} text-white`}>
                    {headerText}
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">
                        <strong>Delai Paiement : </strong>
                        {daysDifference} Jours
                      </h5>
                      <p className="card-text">
                        La facture  <strong>N°{item.numero}</strong> de{" "}
                        <strong> {item.nature} </strong> doit être payée
                        pour un montant de{" "}
                        <strong> {item.montant_ttc} MAD</strong>
                      </p>
                      <button
                        className="btn btn-success"
                        onClick={() => handlePayClick(item.id)}
                      >
                        <i class="bx bx-credit-card"></i> Régler Maintenant
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default Alertes;
