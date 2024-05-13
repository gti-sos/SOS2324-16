<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let info = [];

    onMount(async () => {
        info = await getData();
    });

    async function getData(){
        const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'ca542eb6dbmsha5edf4ea0fd0f32p146eb2jsn67517c3e59d5',
                'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    function getStarRating(rating) {
        const roundedRating = Math.round(rating); 
        const star = '★'; 
        const emptyStar = '☆'; 
        const stars = star.repeat(roundedRating) + emptyStar.repeat(10 - roundedRating); 
        return stars;
    }
    
   
</script>

<div class="movies-container">
    {#each info as movie}
        <div class="movie-card">
            <img src={movie.image} alt={movie.title} class="movie-image" />
            <div class="movie-details">
                <h2>{movie.title}</h2>
                <p>{movie.description}</p>
                <p>Rating: {getStarRating(movie.rating)} {movie.rating}</p>
            </div>
        </div>
    {/each}
</div>
  
<style>
    .movies-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 30px;
        justify-items: center; 
    }

    .movie-card {
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        width: 100%;
        transition: transform 0.3s ease; 
        max-width: 250px;
    }

    .movie-card:hover {
        transform: scale(1.05); 
    }

    .movie-image {
        width: 100%;
        height: auto;
    }

    .movie-details {
        padding: 20px;
    }

    h2 {
        margin-top: 0;
        margin-bottom: 10px; 
    }
</style>