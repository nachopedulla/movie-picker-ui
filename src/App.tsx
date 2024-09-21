// src/App.tsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Modal from "./Modal";

// Definir el tipo de Movie
interface Movie {
  id: string;
  title: string;
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<string>("");
  const [picked, setPicked] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const moviesCollectionRef = collection(db, "movies");

  // Obtener las películas desde Firebase
  const getMovies = async () => {
    const data = await getDocs(moviesCollectionRef);
    setMovies(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Movie)));
  };

  // Agregar una película
  const addMovie = async () => {
    if (newMovie) {
      await addDoc(moviesCollectionRef, { title: newMovie });
      setNewMovie("");
      getMovies();
    }
  };

  // Eliminar una película
  const deleteMovie = async (id: string) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovies();
  };

  // Sortear una película aleatoriamente
  const randomMovie = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setPicked(movies[randomIndex]);
      setShowModal(true); // Mostrar el modal
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎬 Lista de Películas 🎥</h1>
      <div style={styles.formContainer}>
        <input
          type="text"
          placeholder="Nueva película"
          value={newMovie}
          onChange={(e) => setNewMovie(e.target.value)}
          style={styles.input}
        />
        <button onClick={addMovie} style={styles.addButton}>
          Agregar
        </button>
      </div>
      <ul style={styles.movieList}>
        {movies.map((movie) => (
          <li key={movie.id} style={styles.movieItem}>
            <span style={styles.movieText}>
              {movie.title}
            </span>
            <div style={styles.movieActions}>
              <button
                onClick={() => deleteMovie(movie.id)}
                style={styles.deleteButton}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={randomMovie} style={styles.randomButton}>
        Sortear
      </button>

      {
        showModal && picked && (
          <Modal
            title="¡Película Sorteada! 🍿"
            content={picked.title}
            onClose={() => setShowModal(false)}
          />
        )
      }
    </div>
  );
};

// Estilos en línea
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    minHeight: "100vh",
  },
  title: {
    color: "#333",
    fontSize: "28px",
    marginBottom: "20px",
  },
  formContainer: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
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
  },
  movieList: {
    listStyleType: "none",
    padding: 0,
    width: "90%",
    margin: "auto"
  },
  movieItem: {
    backgroundColor: "#fff",
    margin: "5px 0",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  movieText: {
    fontSize: "14px",
  },
  movieActions: {
    display: "flex",
    gap: "10px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  voteButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  randomButton: {
    padding: "10px 20px",
    backgroundColor: "rgb(255 119 7)",
    color: "#fff",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default App;
