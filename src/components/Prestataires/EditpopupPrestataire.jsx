import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function EditPrestataire({ isOpen, onClose, selectedRecord, fetchData }) {
  const [editedData, setEditedData] = useState({
    nom: "",
    service: "",
    commentaire: "",
  });

  useEffect(() => {
    setEditedData({
      nom: selectedRecord?.nom,
      service: selectedRecord?.service,
      commentaire: selectedRecord?.commentaire,
    });
  }, [selectedRecord]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const showToastMessage = (message) => {
    toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
};

  const handleEdit = async (event) => {
    event.preventDefault();
    const uptated = {
      nom: editedData.nom,
      service: editedData.service,
      commentaire: editedData.commentaire,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/prestataires/edit/${selectedRecord.id}`,
        uptated
      );
      fetchData();
      showToastMessage("Prestataire Bien Modifié  ");
      if (response.status === 200) {
        onClose();
        console.log("Record edited successfully");
      } else {
        console.error("Edit request failed with status code:", response.status);
      }
    } catch (error) {
      console.error("Error editing record:", error);
    }
  };

  if (!isOpen || !selectedRecord) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
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
          <div className="modal-header">
            <h3 className="modal-title">
              Modification de {selectedRecord.nom}
            </h3>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleEdit}>
              <div className="form-row">
                <div className="form-group col-12">
                  <label>Nom Prestataire </label>
                  <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                  <input
                    type="text"
                    className="form-control"
                    name="nom"
                    placeholder="N° Marché"
                    value={editedData?.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-12">
                  <label>Service </label>
                  <span className="asterisk" style={{ color: "red" }}>
                            *
                          </span>
                  <select
                    className="form-control form-control-lg"
                    name="service"
                    value={editedData?.service}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choisir un Service</option>
                    <option value="Eau">Eau</option>
                    <option value="Electricité">Electricité</option>
                    <option value="Internet">Internet</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="commentaire">Description</label>
                <textarea
                  className="form-control"
                  id="commentaire"
                  name="commentaire"
                  rows="3"
                  placeholder="Description"
                  value={editedData?.commentaire}
                  onChange={handleInputChange}
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

export default EditPrestataire;
