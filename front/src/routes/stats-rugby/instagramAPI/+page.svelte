<script>
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    
    let userData = [];
    let username = '';

    let DATAAPI = `/PRR/proxy`;
    if(dev){
        DATAAPI = `http://localhost:10000/PRR/proxy`;
    }
    

    async function getUserData(username) {
        try {
            const response = await fetch(DATAAPI+'/'+username);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error(error);
        }
    }
    
    onMount(async () => {

    });

    async function handleSearch() {
        const newData = await getUserData(username);
        userData = newData;
        console.log(userData);
    }


</script>

<div class="profile-widget">
    <div class="search-form">
        <input type="text" bind:value={username} placeholder="Introduce un nombre de usuario de Instagram" />
        <button on:click={handleSearch}>Buscar</button>
    </div>
    {#if userData.id}
        <div class="profile-picture-container">
            <img src={userData.profile_pic_url_hd} alt="Foto de perfil" class="profile-picture" />
        </div>
        <div class="profile-info">
            <h2>{userData.full_name}</h2>
            <p>@{userData.username}</p>
            <p>{userData.biography}</p>
            <p>Seguidores: {userData.follower_count}</p>
            <p>Seguidos: {userData.following_count}</p>
        </div>
    {:else}
        <p>Introduce un nombre de usuario de Instagram y haz clic en Buscar</p>
    {/if}
</div>

<style>
    .profile-widget {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column; 
        gap: 20px;
        margin: 20px;
        text-align: center;
    }

    .search-form {
        margin-bottom: 20px;
    }

    .search-form input {
        padding: 5px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .search-form button {
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .profile-info {
        text-align: center;
    }

    h2 {
        margin: 0;
        font-size: 1.5rem; 
    }

    .profile-picture-container {
        width: 150px; 
        height: 150px; 
        overflow: hidden;
        border-radius: 50%;
        transition: transform 0.3s ease; 
    }

    .profile-picture {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .profile-picture-container:hover {
        transform: scale(1.1); 
    }

    .profile-picture-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); 
        opacity: 0;
        transition: opacity 0.3s ease; 
    }

    .profile-picture-container:hover::before {
        opacity: 1;
    }

    .profile-info p {
        margin: 5px 0;
        font-size: 1rem; 
        color: #666;
    }
</style>