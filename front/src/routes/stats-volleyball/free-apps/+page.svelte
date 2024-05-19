<script>

    import { onMount } from 'svelte';

    let apps=[];

    onMount(async () => {
        apps= await getDataAPIExternaApps();
    });

    async function getDataAPIExternaApps(){
        const url = 'https://store-apps.p.rapidapi.com/search?q=notes&region=us&language=en';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'ae855ceae1msh2840b2c00787f80p198e0bjsnbf6b6ed1fe06',
                'X-RapidAPI-Host': 'store-apps.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result.data["apps"]);
            return result.data["apps"];
        } catch (error) {
            console.error(error);
        }

    }

</script>

<h1>Las aplicaciones gratuitas más utilizadas son: </h1>
<ul>
    {#each apps as app}
        <li class="comida-item"> 

            <h4> {app["app_name"]} con {app["num_downloads"]} descargas</h4>

        </li>

    {/each}

</ul>