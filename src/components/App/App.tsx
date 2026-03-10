import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import SearchBar from '../SearchBar/SearchBar'
import { fetchMovies } from '../../services/movieService'
import type { Movie } from '../../types/movie'
import styles from './App.module.css'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const handleSearch = async (query: string) => {
    setMovies([])
    setSelectedMovie(null)
    setIsError(false)
    setIsLoading(true)

    try {
      const results = await fetchMovies(query)

      if (results.length === 0) {
        toast.error('No movies found for your request.')
      }

      setMovies(results)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}
      {isError && !isLoading && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default App
