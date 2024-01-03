import React, { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function EditPopup({ isOpen, onClose, selectedRecord, fetchData }) {
  const [editedData, setEditedData] = useState({
    numero: "",
    fournisseur: "",
    prestation: "",
    montant_ttc: null,
    tva: null,
    dateDebut: "",
    dateFin: "",
    sitePaiement: "",
    attribution: "",
    ref_notif: "",
    num_caution_def: "",
    mt_caution_def: null,
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
    categorie: { id: "" },
  });
  const [categories, setCategories] = useState([]);
  const showToastMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  useEffect(() => {
    setEditedData({
      numero: selectedRecord?.numero,
      fournisseur: selectedRecord?.fournisseur,
      dateDebut: selectedRecord?.dateDebut,
      dateFin: selectedRecord?.dateFin,
      montant_ttc: selectedRecord?.montant_ttc,
      categorie: selectedRecord?.categorie
        ? { id: selectedRecord.categorie.id }
        : { id: "" },
      observation: selectedRecord?.observation,
      prestation: selectedRecord?.prestation,
      tva: selectedRecord?.tva,
      sitePaiement: selectedRecord?.sitePaiement,
      attribution: selectedRecord?.attribution,
      ref_notif: selectedRecord?.ref_notif,
      num_caution_def: selectedRecord?.num_caution_def,
      mt_caution_def: selectedRecord?.mt_caution_def,
      num_act_eng: selectedRecord?.num_act_eng,
      ref_os_debut: selectedRecord?.ref_os_debut,
      date_os_debut: selectedRecord?.date_os_debut,
      ref_os_arret: selectedRecord?.ref_os_arret,
      date_os_arret: selectedRecord?.date_os_arret,
      ref_os_reprise: selectedRecord?.ref_os_reprise,
      date_os_reprise: selectedRecord?.date_os_reprise,
      ref_os_aug: selectedRecord?.ref_os_aug,
      date_os_aug: selectedRecord?.date_os_aug,
      pv_reception: selectedRecord?.pv_reception,
      main_levee: selectedRecord?.main_levee,
    });
  }, [selectedRecord]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setEditedData({
      ...editedData,
      categorie: { id: value },
    });
  };
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/categories/all")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updated = {
      numero: editedData.numero,
      fournisseur: editedData.fournisseur,
      dateDebut: editedData.dateDebut,
      dateFin: editedData.dateFin,
      montant_ttc: parseFloat(editedData.montant_ttc),
      categorie: {
        id: editedData.categorie.id, // make sure to access the ID property
      },
      observation: editedData.observation,
      prestation: editedData.prestation,
      tva: parseFloat(editedData.tva),
      sitePaiement: editedData.sitePaiement,
      attribution: editedData.attribution,
      ref_notif: editedData.ref_notif,
      num_caution_def: editedData.num_caution_def,
      mt_caution_def: parseFloat(editedData.mt_caution_def),
      num_act_eng: editedData.num_act_eng,
      ref_os_debut: editedData.ref_os_debut,
      date_os_debut: editedData.date_os_debut,
      ref_os_arret: editedData.ref_os_arret,
      date_os_arret: editedData.date_os_arret,
      ref_os_reprise: editedData.ref_os_reprise,
      date_os_reprise: editedData.date_os_reprise,
      ref_os_aug: editedData.ref_os_aug,
      date_os_aug: editedData.date_os_aug,
      pv_reception: editedData.pv_reception,
      main_levee: editedData.main_levee,
    };
    console.log(updated);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/marches/edit/${selectedRecord.id}`,
        updated
      );
      fetchData();
      if (response.status === 200) {
        onClose();
        showToastMessage("Marché Bien Modifié");
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
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "black",
      }}
    >
      <div
        className="modal-dialog modal-lg "
        style={{
          display: "fixed",
          justifyContent: "center",
          width: "70%",
          height: "50%",
          marginTop: "150PX",
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">
              Modification du Marché N° {selectedRecord.numero}
            </h3>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleEdit}>
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
                    name="numero"
                    placeholder="N° Marché"
                    value={editedData?.numero}
                    onChange={handleInputChange}
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
                    name="fournisseur"
                    placeholder="Fournisseur"
                    value={editedData?.fournisseur}
                    onChange={handleInputChange}
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
                    name="prestation"
                    placeholder="Prestation"
                    value={editedData?.prestation}
                    onChange={handleInputChange}
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
                    name="attribution"
                    value={editedData?.attribution}
                    onChange={handleInputChange}
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
                    name="montant_ttc"
                    value={editedData?.montant_ttc}
                    onChange={handleInputChange}
                    required
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
                    name="tva"
                    value={editedData?.tva}
                    onChange={handleInputChange}
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
                    value={editedData.categorie.id || ""} // Use editedData?.categorie.id for the selected value
                    onChange={handleCategoryChange}
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
                    name="dateDebut"
                    className="form-control"
                    placeholder="Date Debut"
                    value={editedData?.dateDebut}
                    onChange={handleInputChange}
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
                    name="dateFin"
                    className="form-control"
                    placeholder="Date Fin"
                    value={editedData?.dateFin}
                    onChange={handleInputChange}
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
                    name="sitePaiement"
                    className="form-control"
                    placeholder="Site de Paiement"
                    value={editedData?.sitePaiement}
                    onChange={handleInputChange}
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
                    name="ref_notif"
                    className="form-control"
                    placeholder="Reference"
                    value={editedData?.ref_notif}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>
                    Num act d'engagement{" "}
                    <span className="asterisk" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="num_act_eng"
                    className="form-control"
                    placeholder="Reference"
                    value={editedData?.num_act_eng}
                    onChange={handleInputChange}
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
                    name="num_caution_def"
                    className="form-control"
                    placeholder="Reference"
                    value={editedData?.num_caution_def}
                    onChange={handleInputChange}
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
                    name="mt_caution_def"
                    type="number"
                    className="form-control"
                    placeholder="Montant Caution Définitif"
                    value={editedData?.mt_caution_def}
                    onChange={handleInputChange}
                    required
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
                    name="ref_os_debut"
                    type="text"
                    className="form-control"
                    placeholder="Réference"
                    value={editedData?.ref_os_debut}
                    onChange={handleInputChange}
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
                    name="date_os_debut"
                    type="date"
                    className="form-control"
                    placeholder="Date Début OS"
                    value={editedData?.date_os_debut}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>Réf Arrêt OS</label>
                  <input
                    name="ref_os_arret"
                    type="text"
                    className="form-control"
                    placeholder="Réference"
                    value={editedData?.ref_os_arret}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>Date Arrêt OS</label>
                  <input
                    name="date_os_arret"
                    type="date"
                    className="form-control"
                    placeholder="Date Arrêt OS"
                    value={editedData?.date_os_arret}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-sm-12 col-md-3">
                  <label>Reprise OS</label>
                  <input
                    name="ref_os_reprise"
                    type="text"
                    className="form-control"
                    placeholder="Réference"
                    value={editedData?.ref_os_reprise}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>Date Reprise OS</label>
                  <input
                    name="date_os_reprise"
                    type="date"
                    className="form-control"
                    placeholder="Date Reprise OS"
                    value={editedData?.date_os_reprise}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>Augmentation OS</label>
                  <input
                    name="ref_os_aug"
                    type="text"
                    className="form-control"
                    placeholder="Réference"
                    value={editedData?.ref_os_aug}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>Date Augmentation OS</label>
                  <input
                    name="date_os_aug"
                    type="date"
                    className="form-control"
                    placeholder="Date Arrêt OS"
                    value={editedData?.date_os_aug}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-sm-12 col-md-3">
                  <label>Main Levée</label>
                  <input
                    name="main_levee"
                    type="text"
                    className="form-control"
                    placeholder="Réference"
                    value={editedData?.main_levee}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-sm-12 col-md-3">
                  <label>PV de Récéption</label>
                  <input
                    name="pv_reception"
                    type="text"
                    className="form-control"
                    placeholder="Réference"
                    value={editedData?.pv_reception}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group col-sm-12 col-md-6">
                  <label>Observations</label>
                  <input
                    name="observation"
                    className="form-control"
                    placeholder="Observations"
                    value={editedData?.observation}
                    onChange={handleInputChange}
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
      <ToastContainer />
    </div>
  );
}

export default EditPopup;
