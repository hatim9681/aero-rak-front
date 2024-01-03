import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Dashboard() {
  const [prestdata, setPrestData] = useState([]);
  const [facdata, setFacData] = useState([]);
  const [alertdata, setAlertData] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [marchedata, setMarcheData] = useState([]);
  const fetchprestData = () => {
    axios
      .get("http://127.0.0.1:8080/prestataires/all")
      .then((response) => {
        setPrestData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchfacData = () => {
    axios
      .get("http://127.0.0.1:8080/factures/all")
      .then((response) => {
        setFacData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchalerte = () => {
    axios
      .get("http://127.0.0.1:8080/factures/all")
      .then((response) => {
        setAlertData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchUserData = () => {
    axios
      .get("http://127.0.0.1:8080/utilisateurs/all")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchMaData = () => {
    axios
      .get("http://127.0.0.1:8080/marches/all")
      .then((response) => {
        setMarcheData(response.data);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  function filterAlerte(item) {
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
  function filterFacturesMa(item) {
    return item.nature == "Marché" && item.status == false;
  }
  function filterFacturesPr(item) {
    return item.nature != "Marché" && item.status == false;
  }
  function filterMarche(item) {
    return item.status != false;
  }
  
  const alertsCount = alertdata.filter(filterAlerte).length;
  const facMacount = facdata.filter(filterFacturesMa).length;
  const facPrcount = facdata.filter(filterFacturesPr).length;
  const marchecount = marchedata.filter(filterMarche).length;
  const userCount = userdata.length;
  const prestcount = prestdata.length;
  useEffect(() => {
    fetchprestData();
    fetchfacData();
    fetchalerte();
    fetchUserData();
    fetchMaData();
  }, []);
  
  return (
    <>
      <link
        href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
        rel="stylesheet"
        id="bootstrap-css"
      />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      ></link>
      <link href="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous"
      />
      <div style={{ margin: "30px" }}>
        <div
          className="container"
          style={{
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <div className="row">
            <div className="col-xl-6">
              <div className="card bg-success order-card">
                <div className="card-block">
                  <h2 className="mb-20">Prestataires</h2>
                  <h2 className="text-right">
                    <i className="fa fa-truck f-left" />
                    <span>{prestcount}</span>
                  </h2>
                  <p className="m-b-0">Prestataires Actifs</p>
                </div>
              </div>
            </div>
            <div className=" col-xl-6">
              <div className="card bg-success order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Factures Prestataires</h2>
                  <h2 className="text-right">
                    <i className="fa fa-money f-left" />
                    <span>{facPrcount}</span>
                  </h2>
                  <p className="m-b-0">Factures Non Payé</p>
                </div>
              </div>
            </div>
            <div className=" col-xl-3">
              <div className="card bg-primary order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Marchés</h2>
                  <h2 className="text-right">
                    <i className="fa fa-cart-plus f-left" />
                    <span>{marchecount}</span>
                  </h2>
                  <p className="m-b-3">
                    Marchés Actifs<span className="f-right"></span>
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-xl-3">
              <div className="card bg-primary order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Factures Marchés</h2>
                  <h2 className="text-right">
                    <i className="fa fa-money f-left" />
                    <span>{facMacount}</span>
                  </h2>
                  <p className="m-b-0">Factures Non Payé</p>
                </div>
              </div>
            </div>
            <div className=" col-xl-3">
              <div className="card bg-warning order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Alertes</h2>
                  <h2 className="text-right">
                    <i className="fa fa-exclamation-triangle f-left" />
                    <span>{alertsCount}</span>
                  </h2>
                  <p className="m-b-0">
                    Alertes de Paiement<span className="f-right"></span>
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-xl-3">
              <div className="card bg-dark order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Utilisateurs</h2>
                  <h2 className="text-right">
                    <i className="fa fa-users f-left" />
                    <span>{userCount}</span>
                  </h2>
                  <p className="m-b-0">
                    Utilisateurs Inscrits<span className="f-right"></span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="card bg-danger order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Bon de Commandes</h2>
                  <h2 className="text-right">
                    <i className="fa fa-suitcase f-left" />
                    <span>???</span>
                  </h2>
                  <p className="m-b-0">
                    Bon de Commande Actifs<span className="f-right"></span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="card bg-danger order-card">
                <div className="card-block">
                  <h2 className="m-b-20">Factures Bon de Commandes</h2>
                  <h2 className="text-right">
                    <i className="fa fa-money f-left" />
                    <span>???</span>
                  </h2>
                  <p className="m-b-0">Factures Non Payé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
