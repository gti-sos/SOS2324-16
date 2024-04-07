<script>
    import Header from "./Header.svelte";
</script>

<Header/>
<h1>Grupo 16</h1>
<hr>
<slot></slot>  
<hr>
<style>
    * {
      font-family: 'Georgia', sans-serif; /* Fuente */
      margin: 0; /* Eliminar margen predeterminado */
      padding: 5px; /* Espaciado interno */
    }
  
    h1 {
      text-align: center; /* Centrar el texto horizontalmente */
    }
</style>