import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function FacturationMA({ isOpen, onClose, selectedRecord, fetchData }) {
  const [formData, setFormData] = useState({
    numero: "",
    date_fac: "",
    date_arrive: "",
    date_reception: "",
    nature: "Marché",
    periode_debut: "",
    periode_fin: "",
    fournisseur: selectedRecord.fournisseur,
    service: "Produit",
    montant_ttc: null,
    marche: {
      id: selectedRecord.id,
    },
   
    observation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8080/factures/save", formData)
      .then((response) => {
        console.log("submitted form:", response);
        showToastMessage("Facture bien enregistré");
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
            <h3 className="modal-title">Facturation du Marché N {selectedRecord.numero}</h3>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>N° Facture <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="numero"
                    placeholder="N° Facture"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label>Montant Facture TTC <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="numero"
                    placeholder="Montant Facture TTC"
                    value={formData.montant_ttc}
                    onChange={(e) =>
                      setFormData({ ...formData, montant_ttc: e.target.value })
                    }
                    required
                    step="any"
                  />
                </div>
              </div>
              <div className="form-row">
              <div className="form-group col-12">
                  <label>Date Reception <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_reception"
                    value={formData.date_reception}
                    onChange={(e) =>
                      setFormData({ ...formData, date_reception: e.target.value })
                    }
                    required
                  />
                </div>
              
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Date Facture <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="date"
                    className="form-control"
                    name="numero"
                    value={formData.date_fac}
                    onChange={(e) =>
                      setFormData({ ...formData, date_fac: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label>Date Arrivé BO <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_arrive"
                    value={formData.date_arrive}
                    onChange={(e) =>
                      setFormData({ ...formData, date_arrive: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Debut Periode de Facturation <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="date"
                    className="form-control"
                    name="periode_debut"
                    value={formData.periode_debut}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        periode_debut: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label>Fin Periode de Facturation <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span></label>
                  <input
                    type="date"
                    className="form-control"
                    name="periode_fin"
                    value={formData.periode_fin}
                    onChange={(e) =>
                      setFormData({ ...formData, periode_fin: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observations</label>
                <textarea
                  className="form-control"
                  name="Observations"
                  rows="3"
                  placeholder="Observations"
                  value={formData.observation}
                  onChange={(e) =>
                    setFormData({ ...formData, observation: e.target.value })
                  }
                ></textarea>
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
    </div>
  );
}

export default FacturationMA;
