import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import { fetchMovies } from '../../services/movieService';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setMovies([]);
      const movieList = await fetchMovies(query);
      if (!movieList.length) {
        toast.error('No movies found for your request.');
        return;
      }
      setMovies(movieList);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMovie(null);
  };

  const handleModal = (movie: Movie) => {
    setMovie(movie);
    openModal();
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && <MovieGrid onSelect={handleModal} movies={movies} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && movie && <MovieModal onClose={closeModal} movie={movie} />}
    </div>
  );
}
