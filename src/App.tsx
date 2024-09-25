// src/App.tsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Modal from "./components/Modal/Modal";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddMovie from "./components/AddMovie/AddMovie";
import { IoMdArrowDown } from "@react-icons/all-files/io/IoMdArrowDown";
import { FaVoteYea } from "@react-icons/all-files/fa/FaVoteYea";
import { FaTrashAlt } from "@react-icons/all-files/fa/FaTrashAlt";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Calification from "./components/Calification/Calification";
import { Button, IconButton, Rating } from "@mui/material";
import popcorn from "./assets/popcorn.png";

// Definir el tipo de Movie
export interface Movie {
  id?: string;
  title?: string;
  createdBy?: "Nacho" | "Yami";
  calification?: number
}

const App: React.FC = () => {

  const [movies, setMovies] = useState<Movie[]>([]);
  
  // Random movie pick
  const [sorted, setSorted] = useState<Movie | null>(null);
  const [showPicked, setShowPicked] = useState<boolean>(false);

  // Picked movie to rate
  const [picked, setPicked] = useState<string | null>(null);
  const [showVote, setShowVote] = useState<boolean>(false);

  // Loader
  const [loading, setLoading] = useState<boolean>(false);

  const moviesCollectionRef = collection(db, "movies");

  // Divide las peliculas segun su calificación
  const ratedMovies = movies.filter(movie => movie.calification !== undefined);
  const notRatedMovies = movies.filter(movie => movie.calification === undefined);

  // Obtener las películas desde Firebase
  const getMovies = async () => {
    setLoading(true);
    const data = await getDocs(moviesCollectionRef);
    setMovies(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Movie)));
    setLoading(false);
  };

  // Agregar una película
  const addMovie = async (movie: Movie) => {
    await addDoc(moviesCollectionRef, movie);
    getMovies();
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
      setSorted(movies[randomIndex]);
      setShowPicked(true); // Mostrar el modal
    }
  };

  // Votar pelicula
  const voteMovie = async (id: string, rating: number) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { calification: rating });
    getMovies();
    setShowVote(false);
    setPicked(null);
  }

  // Obtiene el rating de las recomendaciones por el que sugirió la película
  const getRating = (createdBy : 'Nacho' | 'Yami') : string => {
    var moviesByPerson = ratedMovies
      .filter(movie => movie.createdBy === createdBy)
      .map(movie => movie.calification!);

      const sum = moviesByPerson.reduce((accumulator, value) => accumulator + value, 0);
      return (sum / moviesByPerson.length).toFixed(1);
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <img src={popcorn} style={{ width: '20px', height: '20px', marginRight: '10px'}}></img>
        Lista de Pelis
        <img src={popcorn} style={{ width: '20px', height: '20px', marginLeft: '10px'}}></img>
      </h1>
      <Accordion>
        <AccordionSummary
          expandIcon={<IoMdArrowDown/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            Nueva Película
        </AccordionSummary>
        <AccordionDetails>
          <AddMovie addMovie={addMovie}/>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<IoMdArrowDown/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            Elegir Película
        </AccordionSummary>
        <AccordionDetails>
          { loading ? (
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
          ) : notRatedMovies.length === 0 ? 'No hay películas que mostrar' : (
            <>
              <ul style={styles.movieList}>
                {
                  notRatedMovies.map((movie) => (
                    <li key={movie.id} style={styles.movieItem}>
                      <p style={styles.movieText}>
                        {movie.title}
                      </p>
                      <div style={styles.movieActions}>
                        <IconButton onClick={() => {
                            setShowVote(true)
                            setPicked(movie.id!)
                          }}
                        >
                          <FaVoteYea color="#3c5a93" size={16}/>
                        </IconButton>
                        <IconButton onClick={() => deleteMovie(movie.id!)}>
                          <FaTrashAlt color="#e92121" size={16} />
                        </IconButton> 
                      </div>
                    </li>
                  ))
                }
              </ul>
              <Button 
                onClick={randomMovie} 
                style={{ marginTop: '10px' }}
                variant="contained"
                color="warning"
              >
                Sortear
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary
          expandIcon={<IoMdArrowDown/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Votadas
        </AccordionSummary>
        <AccordionDetails>
          {  loading ? (
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
          ) :  ratedMovies.length === 0 ? 'No hay películas que mostrar' : (
            <div>
              <p style={styles.ratings}>Recomendaciones de Yami: { getRating('Yami') } </p>
              <p style={styles.ratings}>Recomendaciones de Nacho: { getRating('Nacho') }</p>
              <ul style={styles.movieList}>
                {
                  ratedMovies.map((movie) => (
                    <li key={movie.id} style={styles.ratedItem}>
                      <p style={styles.movieText}>
                        {movie.title}
                      </p>
                      <div style={{ display: 'flex', columnGap: '10px'}}>
                        <Rating
                          size="small"
                          max={10} 
                          value={movie.calification!}
                          precision={0.1}
                          getLabelText={(value : number) => value.toString()}
                        />
                        { movie.calification! }
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      {
        showPicked && sorted && (
          <Modal
            title="¡Película Sorteada! 🍿"
            content={<p style={styles.modalText}>{sorted.title!}</p>}
            onClose={() => setShowPicked(false) }
          />
        )
      }

      {
        showVote && picked && (
          <Modal
            title="Calificación de la peli! 🍿"
            content={
              <Calification 
                voteMovie={voteMovie}
                id={picked!}
              />
            }
            onClose={() => setShowVote(false)}
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
  movieList: {
    listStyleType: "none",
    padding: 0,
    width: "100%",
    margin: "auto"
  },
  ratedItem: {
    backgroundColor: "#fff",
    margin: "5px 0",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    flexFlow: 'column',
    alignItems: "center",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
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
    textAlign: "start"
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
  ratings: {
    fontSize: '.8rem'
  }
};

export default App;
