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

  // Helper: simplified match for recommendations by overlap in genre/actor/keyword
  function getRecommendedMovies(queryString, filteredMovies, allMovies) {
    if (!queryString.trim() || filteredMovies.length === 0) return [];
    const lQuery = queryString.toLowerCase();

    function intersect(arr1, arr2) {
      return arr1.some(x => arr2.includes(x));
    }

    // Collect genres & all actors from filteredMovies
    const filteredGenres = new Set();
    const filteredActors = new Set();
    filteredMovies.forEach(movie => {
      if (movie.genre) movie.genre.split(',').forEach(g => filteredGenres.add(g.trim().toLowerCase()));
      if (movie.actors) movie.actors.forEach(a => filteredActors.add(a.toLowerCase()));
    });

    // Find movies not in filteredMovies, but "close" by genre/actor/keyword
    return allMovies.filter(movie => {
      if (filteredMovies.some(f => f.id === movie.id)) return false; // Exclude already-shown
      let score = 0;
      // Genre overlap
      if (movie.genre) {
        const movieGenres = movie.genre.split(',').map(g => g.trim().toLowerCase());
        if (movieGenres.some(g => filteredGenres.has(g))) score += 2;
      }
      // Actor overlap
      if (movie.actors) {
        const movieActors = movie.actors.map(a => a.toLowerCase());
        if (movieActors.some(a => filteredActors.has(a))) score += 2;
      }
      // Similarity by word overlap in title
      if (movie.title && queryString) {
        const movieWords = movie.title.toLowerCase().split(/\s+/);
        const queryWords = lQuery.split(/\s+/);
        if (movieWords.some(word => queryWords.includes(word))) score += 1;
      }
      // Fuzzy search: keyword present in description
      if (movie.description && movie.description.toLowerCase().includes(lQuery)) score += 1;
      return score > 0;
    });
  }
  // Memoize recommendations for efficiency
  const recommendedMovies = React.useMemo(
    () => getRecommendedMovies(query, filteredMovies, movieCatalog),
    [query, filteredMovies, movieCatalog]
  );

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
        <div
          className="container"
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          <form
            style={{ display: 'flex', width: '100%', maxWidth: 480, gap: 0 }}
            onSubmit={handleSearchClick}
            role="search"
            aria-label="Movie Search"
          >
            <input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search by title, genre, or actor..."
              style={{
                width: 340,
                maxWidth: '100%',
                padding: '11px 20px',
                fontSize: 17,
                borderRadius: inputValue ? "8px 0 0 8px" : 8,
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
              autoFocus={false}
            />
            <button
              className="btn"
              type="submit"
              style={{
                borderRadius: '0 8px 8px 0',
                border: '1px solid #252525',
                borderLeft: 'none',
                background: colors.accent,
                color: '#fff',
                padding: '11px 25px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                minWidth: 80,
              }}
              aria-label="Search Button"
            >
              Search
            </button>
          </form>
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
          {/* Movie Grid + Recommendations: Only show the full grid if not searching;
              When a search is active, only display filtered movies (search matches) and their recommendations. */}
          <section id="catalog">
            {/* When no search is active, show ALL movies (default landing grid) */}
            {(!query.trim()) && (
              <div
                className="movie-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
                  gap: 32,
                  paddingBottom: 50,
                }}
              >
                {movieCatalog.length === 0 && (
                  <div style={{ color: '#b2b2b2', fontSize: 18, gridColumn: '1/-1', textAlign: 'center', padding: 70 }}>
                    No movies found.
                  </div>
                )}
                {movieCatalog.map(movie => (
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
            )}
            {/* When search is active, only show searched (filtered) movies and recommendations */}
            {(!!query.trim()) && (
              <>
                <div
                  className="movie-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
                    gap: 32,
                    paddingBottom: 30,
                  }}
                >
                  {filteredMovies.length === 0 && (
                    <div style={{ color: '#b2b2b2', fontSize: 18, gridColumn: '1/-1', textAlign: 'center', padding: 50 }}>
                      No movies found for your search.
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
                {/* Show recommended movies for this search */}
                {recommendedMovies.length > 0 && (
                  <section
                    className="recommended-section"
                    style={{
                      marginTop: 24,
                      padding: '18px 0 8px',
                      borderRadius: 12,
                      background: '#14141a',
                      border: `1.5px solid ${colors.accent}`,
                      boxShadow: '0 4px 16px 0 #00000020',
                    }}
                    aria-label="Recommended Movies"
                  >
                    <div style={{ paddingBottom: 10, paddingLeft: 11 }}>
                      <h3
                        style={{
                          color: colors.accent,
                          fontWeight: 700,
                          fontSize: 22,
                          margin: 0,
                          letterSpacing: 1
                        }}>
                        Recommended
                      </h3>
                      <div style={{
                        marginTop: 4,
                        color: '#fff',
                        fontWeight: 400,
                        fontSize: 15,
                        opacity: 0.76
                      }}>
                        Similar movies you might enjoy based on your search.
                      </div>
                    </div>
                    <div
                      className="movie-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit,minmax(168px,1fr))',
                        gap: 22,
                        padding: '6px 0 12px 0'
                      }}
                    >
                      {recommendedMovies.map(movie => (
                        <div
                          key={movie.id}
                          tabIndex={0}
                          className="movie-card"
                          onClick={() => openMovieModal(movie)}
                          style={{
                            background: '#18181f',
                            borderRadius: 10,
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px 0 #0000002a',
                            cursor: 'pointer',
                            border: `1px solid #222236`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            minHeight: 250,
                            transition: 'transform 0.18s',
                          }}
                          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openMovieModal(movie)}
                        >
                          <div style={{ width: '100%', minHeight: 120, overflow: 'hidden', background: '#23232a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={movie.poster}
                              alt={movie.title + ' poster'}
                              style={{
                                width: '100%',
                                objectFit: 'cover',
                                height: 120,
                                filter: 'brightness(0.92)',
                                transition: 'transform 0.2s',
                                display: 'block'
                              }}
                              loading="lazy"
                            />
                          </div>
                          <div style={{ padding: '9px 10px 6px', minHeight: 48 }}>
                            <h4 style={{
                              fontSize: 15,
                              fontWeight: 600,
                              margin: 0,
                              marginBottom: 2,
                              color: colors.secondary,
                              lineHeight: 1.13,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {movie.title}
                            </h4>
                            <div style={{ color: colors.accent, fontWeight: 400, fontSize: 13 }}>{movie.genre}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
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
