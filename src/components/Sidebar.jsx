import React, { useState, useEffect } from "react";
import axios from "axios";
import ondaLogo from "../images/onda.png";
import { Link, Outlet, Navigate } from "react-router-dom";
import { red } from "@mui/material/colors";

function Sidebar() {
  const [data, setData] = useState([]);
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    let sidebar = document.querySelector(".sidebar");
    if (window.innerWidth < 768) {
      sidebar.classList.add("close");
    } else {
      sidebar.classList.remove("close");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    return daysDifference >= threshold && item.status === false;
  }

  const filteredData = data.filter(filterFactures);
  const alertsCount = filteredData.length ;

  const storedUserData = localStorage.getItem("user");
  if (storedUserData) {
    const user = JSON.parse(storedUserData);
  } else {
    console.log("No user data found in local storage");
    return <Navigate to="/" />;
  }
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <>
      {/* Boxiocns CDN Link */}
      <link
        href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha384-KyZXEAg3QhqLMpG8r+Jt2P4S0FYgJw1Mve0T7W+TXFueA8NE5d3n12F6p2fF5i4l6"
        crossorigin="anonymous"
      />
      <div className="sidebar">
        <div className="logo-details">
          <i className="bx bxs-plane-take-off "></i>
          <span className="logo_name">O.N.D.A</span>
        </div>
        <div style={{ border: "2px solid black" }}></div>
        <ul className="nav-links">
          <li>
            <Link
              to="/sidebar"
              onClick={() => (window.location.href = "/sidebar")}
            >
              <i className="bx bx-grid-alt" />
              <span className="link_name">Tableau de Bord</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <a className="link_name" href="#">
                  Tableau de Bord
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link
              to="/sidebar/factures" /* onClick={() => window.location.href = '/sidebar/factures'}*/
            >
              <i class="bx bx-notepad"></i>

              <span className="link_name">Factures</span>
            </Link>

            <ul class="sub-menu">
              <li>
                <a class="link_name" href="#">
                  Factures
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link
              to="/sidebar/marches" /*onClick={() => window.location.href = '/sidebar/marches'} */
            >
              <i className="bx bx-collection" />
              <span className="link_name">Marchés</span>
            </Link>

            <ul class="sub-menu">
              <li>
                <a class="link_name" href="#">
                  Marchés
                </a>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/sidebar/prestataires" /*</li>onClick={() => window.location.href = '/sidebar/prestataires'}*/
            >
              <i class="bx bx-edit-alt"></i>
              <span className="link_name">Charges Fixes</span>
            </Link>
            <ul class="sub-menu">
              <li>
                <a class="link_name" href="#">
                  Charges Fixes
                </a>
              </li>
            </ul>
          </li>
          <li hidden>
            <Link
              to="/sidebar/bdc" /* onClick={() => window.location.href = '/sidebar/bdc'}*/
            >
              <i className="bx bx-shopping-bag" />
              <span className="link_name">BDC</span>
            </Link>
            <ul class="sub-menu">
              <li>
                <a class="link_name" href="#">
                  BDC
                </a>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/sidebar/alertes"
              onClick={() => (window.location.href = "/sidebar/alertes")}
            >
              <i class="bx bx-error" />
              <span className="link_name">
                Alertes
                {alertsCount > 0 && (
                  <span className="notification-badge">{alertsCount}</span>
                )}
              </span>
            </Link>
            <ul class="sub-menu">
              <li>
                <a class="link_name" href="#">
                  Alertes
                </a>
              </li>
            </ul>
          </li>
          {JSON.parse(storedUserData).role === "Admin" && (
            <li>
              <Link to="/sidebar/users">
                <i className="bx bx-user"></i>
                <span className="link_name">Utilisateurs</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <a className="link_name" href="#">
                    Utilisateurs
                  </a>
                </li>
              </ul>
            </li>
          )}
          <li>
            <Link
              to="/sidebar/settings" /* onClick={() => window.location.href = '/sidebar/settings'}*/
            >
              <i className="bx bx-cog" />
              <span className="link_name">Paramètre</span>
            </Link>
            <ul class="sub-menu blank">
              <li>
                <a class="link_name" href="#">
                  Paramètre
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div class="profile-details">
              <Link to="/" onClick={handleLogout}>
                <div
                  class="profile-content"
                  style={{ paddingLeft: "25px" }}
                ></div>
                <div class="name-job">
                  <div class="profile_name" style={{ fontSize: "15px" }}>
                    {JSON.parse(storedUserData).nomComplet}
                  </div>
                  <div class="job">{JSON.parse(storedUserData).role}</div>
                  <div class="job" style={{ fontSize: "15px", color: "red" }}>
                    Se Deconnecter
                  </div>
                </div>
                <i
                  style={{ fontSize: "25px", color: "red" }}
                  class="bx bx-log-out"
                ></i>
              </Link>
            </div>

            <ul class="sub-menu">
              <li>
                <a class="link_name" href="#">
                  Factures
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <section className="home-section">
        <div
          className="home-content"
          style={{
            display: "flex",
            position: "sticky",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", left: "0" }}>
            <i
              className="bx bx-menu"
              onClick={() => {
                let sidebar = document.querySelector(".sidebar");
                sidebar.classList.toggle("close");
              }}
            ></i>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={ondaLogo}
              alt="Logo Image"
              width="100"
              style={{ margin: "0 10px" }}
            />
            {windowWidth >= 768 && (
              <span className="text">Office National des Aéroports</span>
            )}
          </div>
        </div>

        <div style={{ flex: "1", border: "2px solid black" }}></div>

        <Outlet />
      </section>
    </>
  );
}

export default Sidebar;
