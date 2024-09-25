import { useState } from "react";
import { Movie } from "../../App";
import { Button } from "@mui/material";

const AddMovie = ({ addMovie } : { addMovie : Function }) => {

    const [movie, setMovie] = useState<Movie>({title: undefined, createdBy: undefined});

    // Actualiza los datos de la pelicula
    function changeHandler<K extends keyof Movie> (key: K, value: any) {
        let auxMovie = { ...movie };
        auxMovie[key] = value;
        setMovie(auxMovie)
    }

    async function submitHandler() {
        await addMovie(movie);
        setMovie({});
    }

    return (
        <div style={styles.formContainer}>
        <label style={styles.label}>Película</label>
        <input
          type="text"
          placeholder="Nueva película"
          value={movie.title}
          onChange={(e) => changeHandler('title', e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>Recomendada por</label>
        <select 
          value={movie.createdBy} 
          onChange={(e) => changeHandler('createdBy', e.target.value)} 
          style={styles.input}
        >
          <option value={undefined}></option>
          <option value="Yami">Yami</option>
          <option value="Nacho">Nacho</option>
        </select>
        <Button 
            style={{ marginTop: '10px' }}
            onClick={submitHandler} 
            variant="contained"
            color="success"
            disabled={movie.title === undefined || movie.title === '' || movie.createdBy === undefined }
        >
          Agregar
        </Button>
      </div>
    );
}

export default AddMovie;

// Estilos en línea
const styles: { [key: string]: React.CSSProperties } = {
    container: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      padding: "20px",
      minHeight: "100vh",
    },
    label: {
        fontSize: '.8rem',
        color: 'grey',
        textAlign: 'start',
        width: '100%',
        paddingLeft: '30px',
        marginTop: '5px'
    },
    title: {
      color: "#333",
      fontSize: "28px",
      marginBottom: "20px",
    },
    formContainer: {
      marginBottom: "30px",
      display: "flex",
      flexFlow: "column",
      alignItems: 'center'
    },
    input: {
      padding: "10px",
      margin: "5px",
      fontSize: "14px",
      width: "90%",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxSizing: "border-box"
    },
    addButton: {
      padding: "10px 20px",
      backgroundColor: "#28a745",
      color: "#fff",
      fontSize: "14px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "5px",
      marginTop: "10px"
    },   
};