import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AddPayement({ isOpen, onClose, selectedRecord, fetchData }) {
    const [formData, setFormData] = useState({
        banque: "",
        asf: "",
        rib: "",
        cnss: "",
        decomptes: "",
        rapport: "",
        slo: "",
        penalites: "",
        marche: {
          id: selectedRecord.id,
        },
      });
      

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8080/payements/save", formData)
      .then((response) => {
        console.log("submitted form:", response);
        showToastMessage("Infos Paiement bien ajouté")
        fetchData(selectedRecord.id);
        onClose();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  if (!isOpen || !selectedRecord) return null;
  const showToastMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)",color: "black" }}
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
          <div className="modal-header"  >
            <h3 className="modal-title">Enregistrer un Nouveau Paiement </h3>
            
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Banque</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Banque"
                    value={formData.banque}
                    onChange={(e) =>
                      setFormData({ ...formData, banque: e.target.value })
                    }required
                  />
                </div>
                <div className="form-group col-6">
                  <label>ASF</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="RIB"
                    value={formData.asf}
                    onChange={(e) =>
                      setFormData({ ...formData, asf: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-12">
                  <label>RIB</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="RIB"

                    value={formData.rib}
                    onChange={(e) =>
                      setFormData({ ...formData, rib: e.target.value })
                    }required
                  />
                </div>
                
              </div>
              <div className="form-row">
              <div className="form-group col-4">
                  <label>CNSS</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CNSS"
                    value={formData.cnss}
                    onChange={(e) =>
                      setFormData({ ...formData, cnss: e.target.value })
                    }
                  />
                </div><div className="form-group col-4">
                  <label>Decomptes</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Decomptes"
                    value={formData.decomptes}
                    onChange={(e) =>
                      setFormData({ ...formData, decomptes: e.target.value })
                    }
                  />
                </div>
                <div className="form-group col-4">
                  <label>Rapport</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rapport"
                    value={formData.rapport}
                    onChange={(e) =>
                      setFormData({ ...formData, rapport: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>SLO</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="SLO"

                    value={formData.slo}
                    onChange={(e) =>
                      setFormData({ ...formData, slo: e.target.value })
                    }
                  />
                </div>
                <div className="form-group col-6">
                  <label>Penalités</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Penalités"

                    value={formData.penalites}
                    onChange={(e) =>
                      setFormData({ ...formData, penalites: e.target.value })
                    }
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddPayement;
