// src/components/Modal.tsx
import React from "react";
import { IoIosClose } from "@react-icons/all-files/io/IoIosClose";

// Definir los tipos de las propiedades del Modal
interface ModalProps {
  title: string;
  content: React.ReactElement;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, onClose }) => {
  return (
    <div 
      style={styles.modalOverlay} 
    >
      <div style={styles.modalContent}>
        <IoIosClose 
          size={40} 
          color="grey" 
          style={{ position: 'absolute', right: '30px' }}
          onClick={onClose}
        />
        <h2 style={styles.modalTitle}>{title}</h2>
        {content}
      </div>
    </div>
  );
};

// Estilos del Modal en línea
const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
  },
  modalTitle: {
    fontSize: "24px",
    margin: "40px 0px 15px 0px",
  },
  modalText: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Modal;