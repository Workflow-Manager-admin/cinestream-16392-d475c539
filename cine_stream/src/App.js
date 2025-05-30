import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function CineStreamApp() {
  // Mock movie catalog for demonstration; in production, fetch from API/backend
  const movieCatalog = [
    {
      id: 1,
      title: 'Meiyazagan',
      year: 2021,
      genre: 'Drama',
      actors: ['Actor A', 'Actor B'],
      poster: 'https://m.media-amazon.com/images/I/51kq8ZcYbGL._AC_UF894,1000_QL80_.jpg',
      banner: 'https://m.media-amazon.com/images/I/61uoWXudRML._AC_UF894,1000_QL80_.jpg',
      description: 'A moving story of resilience and hope.',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      featured: true,
    },
    {
      id: 2,
      title: 'Anbe Sivam',
      year: 2003,
      genre: 'Comedy, Drama',
      actors: ['Kamal Haasan', 'Madhavan'],
      poster: 'https://upload.wikimedia.org/wikipedia/en/7/76/Anbe_Sivam_poster.jpg',
      banner: 'https://english.cdn.zeenews.com/sites/default/files/2022/06/16/1052927-anbe-sivam.jpg',
      description: 'A classic tale about love, humanity, and compassion.',
      video: 'https://www.w3schools.com/html/movie.mp4',
      featured: true,
    },
    {
      id: 3,
      title: 'The Colorful World',
      year: 2023,
      genre: 'Adventure',
      actors: ['Actor X', 'Actor Y'],
      poster: 'https://www.filmibeat.com/ph-big/2019/05/petta_155870272380.jpg',
      banner: '',
      description: 'Journey across continents and colors.',
      video: '',
      featured: false,
    },
    {
      id: 4,
      title: 'Silent Night',
      year: 2022,
      genre: 'Thriller',
      actors: ['Actor M', 'Actress Z'],
      poster: 'https://m.media-amazon.com/images/I/81BEsqrcISL._AC_SY879_.jpg',
      banner: '',
      description: 'A chilling thriller that keeps you guessing.',
      video: '',
      featured: false,
    },
    // ...add more movies as desired
  ];

  // Local input state for the search bar (what the user types)
  const [inputValue, setInputValue] = useState('');
  // Actual "query" used for filtering and display; changed only on search button
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // PUBLIC_INTERFACE
  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  // PUBLIC_INTERFACE
  function handleSearchClick(e) {
    e.preventDefault();
    // Update the query state to the current input value when user clicks "Search"
    setQuery(inputValue.trim());
  }

  function openMovieModal(movie) {
    setSelectedMovie(movie);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  const featuredMovie = movieCatalog.find(m => m.featured) || movieCatalog[0];

  // Efficient filtering: check title, all genres (split by comma), and actor names for matches.
  const filteredMovies = React.useMemo(() => {
    if (!query.trim()) return movieCatalog;
    const lQuery = query.toLowerCase();
    return movieCatalog.filter(movie => {
      // Check title
      if (movie.title && movie.title.toLowerCase().includes(lQuery)) return true;

      // Check each genre (movie.genre may be "Comedy, Drama", so split by comma and check each)
      if (movie.genre && movie.genre.split(',').some(g => g.trim().toLowerCase().includes(lQuery))) return true;

      // Check actors
      if (movie.actors && movie.actors.some(a => a.toLowerCase().includes(lQuery))) return true;

      return false;
    });
  }, [query, movieCatalog]);

  // Responsive classes and color variables
  const colors = {
    primary: '#000000',
    secondary: '#fcfcfc',
    accent: '#ff0033',
  };

  return (
    <div className="app" style={{ background: colors.primary, color: colors.secondary }}>
      {/* Header */}
      <nav
        className="navbar"
        style={{
          backgroundColor: colors.primary,
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
        }}
      >
        <div className="container" style={{ maxWidth: 1400 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="logo" style={{ color: colors.secondary, fontWeight: 'bold', fontSize: 24 }}>
              <span style={{ color: colors.accent, fontWeight: 'bold', fontSize: 28 }}>🎬</span>
              CineStream
            </div>
            <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              <a href="#home" style={{ color: colors.secondary, textDecoration: 'none', fontWeight: 500 }}>Home</a>
              <a href="#catalog" style={{ color: colors.secondary, textDecoration: 'none', fontWeight: 500 }}>Catalog</a>
              <a href="#contact" style={{ color: colors.secondary, textDecoration: 'none', fontWeight: 500 }}>Contact</a>
            </nav>
          </div>
        </div>
      </nav>

      {/* Search bar at the top, just below the navbar */}
      <div
        className="searchbar-bar-top"
        style={{
          width: '100%',
          background: colors.primary,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '15px 0 10px', // compact but spacious
          marginTop: 64, // account for fixed nav height
          boxSizing: 'border-box',
          zIndex: 99
        }}
      >
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Search by title, genre, or actor..."
            style={{
              width: 340,
              maxWidth: '100%',
              padding: '11px 20px',
              fontSize: 17,
              borderRadius: 8,
              border: '1px solid #252525',
              background: '#181818',
              color: colors.secondary,
              outline: 'none',
              boxShadow: '0 1px 8px 0 #00000033',
              marginRight: 0,
              transition: 'border 0.2s',
              fontWeight: 500
            }}
            aria-label="Search movies"
          />
        </div>
      </div>

      {/* Hero / Featured Movie Banner */}
      <header
        className="featured-banner"
        style={{
          background: featuredMovie && featuredMovie.banner
            ? `linear-gradient(90deg, #000 60%, transparent 100%), url(${featuredMovie.banner}) center/cover`
            : colors.primary,
          color: colors.secondary,
          minHeight: 320,
          marginTop: 0, // No top margin since search bar now pushes down content
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, padding: '48px 24px' }}>
          {featuredMovie && (
            <div style={{ maxWidth: 500 }}>
              <div style={{ color: colors.accent, fontWeight: 700, fontSize: 14, letterSpacing: 2, marginBottom: 10 }}>
                FEATURED
              </div>
              <h1 style={{ fontSize: 38, margin: 0, fontWeight: 700 }}>
                {featuredMovie.title} {' '}
                <span style={{ fontWeight: 400, fontSize: 22, color: colors.secondary, opacity: 0.8 }}>
                  ({featuredMovie.year})
                </span>
              </h1>
              <div style={{ color: '#fcfcfc', margin: '18px 0 10px', fontSize: 16 }}>
                {featuredMovie.genre}
              </div>
              <div style={{ color: '#cfcfcf', fontSize: 15, marginBottom: 18 }}>
                {featuredMovie.description}
              </div>
              <button
                className="btn"
                onClick={() => openMovieModal(featuredMovie)}
                style={{
                  background: colors.accent,
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontSize: 15,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 8,
                }}
              >
                ▶ Watch Now
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main section */}
      <main className="main-content" style={{
        width: '100%',
        flex: '1',
        marginTop: 0,
        minHeight: 400,
        paddingBottom: 50,
        background: colors.primary
      }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          {/* Movie Grid */}
          <section id="catalog">
            <div
              className="movie-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
                gap: 32,
                paddingBottom: 50,
              }}
            >
              {filteredMovies.length === 0 && (
                <div style={{ color: '#b2b2b2', fontSize: 18, gridColumn: '1/-1', textAlign: 'center', padding: 70 }}>
                  No movies found.
                </div>
              )}
              {filteredMovies.map(movie => (
                <div
                  key={movie.id}
                  tabIndex={0}
                  className="movie-card"
                  onClick={() => openMovieModal(movie)}
                  style={{
                    background: '#101010',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 3px 14px 0 #00000030',
                    cursor: 'pointer',
                    border: `1px solid #191919`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    minHeight: 320,
                    transition: 'transform 0.18s',
                  }}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openMovieModal(movie)}
                >
                  <div style={{ width: '100%', minHeight: 230, overflow: 'hidden', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={movie.poster}
                      alt={movie.title + ' poster'}
                      style={{
                        width: '100%',
                        objectFit: 'cover',
                        height: 230,
                        filter: 'brightness(0.90)',
                        transition: 'transform 0.2s',
                        display: 'block'
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '14px 12px 8px', minHeight: 64 }}>
                    <h2 style={{
                      fontSize: 17,
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: 3,
                      color: colors.secondary,
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {movie.title}
                    </h2>
                    <div style={{ color: colors.accent, fontWeight: 400, fontSize: 14 }}>{movie.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Movie Detail Modal */}
        {modalOpen && selectedMovie &&
          <MovieModal movie={selectedMovie} onClose={closeModal} accent={colors.accent} />
        }
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#111',
          color: '#aaa',
          textAlign: 'center',
          fontSize: 15,
          padding: '30px 0 15px',
          marginTop: 30,
          borderTop: '1px solid rgba(255,255,255,0.07)'
        }}
      >
        <div className="container" style={{ maxWidth: 1000 }}>
          <div>
            © {new Date().getFullYear()} CineStream. All rights reserved.&nbsp;|&nbsp;
            <a href="mailto:info@cinestream.com" style={{ color: colors.accent, textDecoration: 'none' }}>
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Movie Modal component for displaying movie details and video player
// PUBLIC_INTERFACE
function MovieModal({ movie, onClose, accent }) {
  // Traps focus for accessibility, closes on backdrop or escape
  React.useEffect(() => {
    function onKey(evt) {
      if (evt.key === "Escape") onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        zIndex: 2000,
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.76)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: '#171717',
          color: '#fcfcfc',
          borderRadius: 14,
          boxShadow: '0 6px 32px 0 #00000099',
          minWidth: 320,
          maxWidth: 540,
          width: '90vw',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()} // Prevent propagating to backdrop
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 17,
            color: '#b3b3b3',
            background: 'transparent',
            border: 'none',
            fontSize: 27,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        <div style={{ padding: '26px 24px 24px' }}>
          <h2 style={{margin: '0 0 16px', fontSize: 27, color: accent}}>{movie.title}
            <span style={{ color: '#aaa', fontSize: 15, marginLeft: 9 }}>({movie.year})</span>
          </h2>
          <div style={{marginBottom: 11, color: '#aaa', fontWeight: 400}}>
            <b>Genre: </b>{movie.genre || 'N/A'}
          </div>
          <div style={{marginBottom: 11, color: '#aaa'}}>{movie.description}</div>
          <div style={{marginBottom: 11, color: '#b8b8b8', fontSize: 14}}>
            <b>Starring:</b> {movie.actors ? movie.actors.join(', ') : 'Unknown'}
          </div>
          {movie.video ? (
            <div style={{
              marginTop: 16,
              background: '#000',
              borderRadius: 6,
              overflow: 'hidden',
              width: '100%',
            }}>
              <video controls style={{ width: '100%', maxHeight: 340, background: '#000' }}>
                <source src={movie.video} type="video/mp4" />
                Sorry, your browser does not support embedded video.
              </video>
            </div>
          ) : (
            <div style={{ marginTop: 9, color: '#d33', fontWeight: 500 }}>
              No streaming available for this title.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CineStreamApp;
