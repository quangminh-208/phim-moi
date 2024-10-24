import { useState, useEffect, useCallback } from "react";
import BaseHeader from "../components/BaseHeader";
import BaseFooter from "../components/BaseFooter";
import BackToTop from "../components/BackToTop";
import Banner from "../components/Banner";
import MovieList from "../components/MovieList";
import TopMovieList from "../components/TopMovieList";
import LoadingLayer from "../components/LoadingLayer";
import { getMovies } from "../services/movieService";

function HomePage() {
    const [movies, setMovies] = useState({
        singleMovies: [],
        animeMovies: [],
        seriesMovies: [],
        topSingleMovies: [],
        topAnimeMovies: [],
        topSeriesMovies: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [singleMoviesData, animeMoviesData, seriesMoviesData] = await Promise.all([
                getMovies({ limit: 12, order: "modified:desc", "filters[type]": "single", "filters[year]": "2024" }),
                getMovies({ limit: 12, order: "modified:desc", "filters[type]": "hoathinh", "filters[year]": "2024" }),
                getMovies({ limit: 12, order: "modified:desc", "filters[type]": "series", "filters[year]": "2024" }),
            ]);

            const [topSingleMoviesData, topAnimeMoviesData, topSeriesMoviesData] = await Promise.all([
                getMovies({ limit: 6, order: "view:desc", "filters[type]": "single" }),
                getMovies({ limit: 6, order: "view:desc", "filters[type]": "hoathinh" }),
                getMovies({ limit: 6, order: "view:desc", "filters[type]": "series" }),
            ]);

            setMovies({
                singleMovies: singleMoviesData,
                animeMovies: animeMoviesData,
                seriesMovies: seriesMoviesData,
                topSingleMovies: topSingleMoviesData,
                topAnimeMovies: topAnimeMoviesData,
                topSeriesMovies: topSeriesMoviesData,
            });
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <BaseHeader />
            <Banner />
            <div className="container my-5">
                <div className="row">
                    <div className="col-8">
                        <MovieList title="Phim lẻ ra mắt" data={movies.singleMovies} isLoading={isLoading} />
                        <MovieList title="Phim hoạt hình ra mắt" data={movies.animeMovies} isLoading={isLoading} />
                        <MovieList title="Phim bộ mới ra mắt" data={movies.seriesMovies} isLoading={isLoading} />
                    </div>
                    <div className="col ps-5">
                        <TopMovieList title="Top Anime hay" data={movies.topAnimeMovies} isLoading={isLoading} />
                        <TopMovieList title="Top phim lẻ" data={movies.topSingleMovies} isLoading={isLoading} />
                        <TopMovieList title="Top phim bộ" data={movies.topSeriesMovies} isLoading={isLoading} />
                    </div>
                </div>
            </div>
            <BaseFooter />
            <BackToTop />
            {isLoading && <LoadingLayer />}
        </>
    );
}

export default HomePage;
