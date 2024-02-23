let jugadores=[
    {short_name: "L. Messi", long_name: "Lionel Andrés Messi Cuccittini", age: 27, dob: "24/06/1987", height_cm: 169, weight_kg: 67, nationality: "Argentina", club: "FC Barcelona", preferred_foot: "Left", team_position: "CF"},
    {short_name: "Cristiano Ronaldo", long_name: "Cristiano Ronaldo dos Santos Aveiro", age: 29, dob: "05/02/1985",	height_cm: 185, weight_kg: 80, nationality: "Portugal", club: "Real Madrid", preferred_foot: "Right", team_position: "LW"}, 		
    {short_name: "A. Robben", long_name: "Arjen Robben", age: 30,	dob: "23/01/1984", height_cm: 180, weight_kg: 80, nationality: "Netherlands", club: "FC Bayern München", preferred_foot: "Left", team_position: "SUB"}, 
    {short_name: "Z. Ibrahimoviç",	long_name: "Zlatan Ibrahimoviç", age: 32,	dob: "03/10/1981", height_cm: 195, weight_kg: 95, nationality: "Sweden", club: "Paris Saint-Germain", preferred_foot: "Right", team_position: "ST"}, 				
    {short_name: "M. Neuer", long_name: "Manuel Neuer", age: 28, dob: "27/03/1986", height_cm: 193, weight_kg: 92, nationality: "Germany", club: "FC Bayern München", preferred_foot: "Right", team_position: "GK"},
    {short_name: "L. Suárez", long_name: "Luis Alberto Suárez Díaz", age: 27,	dob: "24/01/1987",	height_cm: 181, weight_kg: 81, nationality: "Uruguay", club: "FC Barcelona", preferred_foot: "Right", team_position: "RES"},
    {short_name: "E. Hazard", long_name: "Eden Hazard", age: 23, dob: "07/01/1991", height_cm: 173, weight_kg: 74, nationality: "Belgium", club: "Chelsea", preferred_foot: "Right", team_position: "LM"},		
    {short_name: "R. van Persie", long_name: "Robin van Persie", age: 30, dob: "06/08/1983", height_cm: 187, weight_kg: 71, nationality: "Netherlands", club: "Manchester United", preferred_foot: "Left", team_position: "RS"},
    {short_name: "B. Schweinsteiger", long_name: "Bastian Schweinsteiger", age: 29,	dob: "01/08/1984", height_cm: 183, weight_kg: 79, nationality: "Germany", club: "FC Bayern München", preferred_foot: "Right", team_position: "SUB"},
    {short_name: "F. Ribéry", long_name: "Franck Bilal Ribéry", age: 31,	dob: "07/04/1983",	height_cm: 170, weight_kg: 72, nationality: "France", club: "FC Bayern München", preferred_foot: "Right", team_position: "SUB"}
];

function calcularMediaEdadPorNacionalidad(jugadores, nacionalidad){
    const jugadoresPorNacionalidad = jugadores.filter(x => x.nationality == nacionalidad)

    let totalEdad = 0;
    jugadoresPorNacionalidad.forEach(jugador => totalEdad += jugador.age)

    const mediaEdad = totalEdad / jugadoresPorNacionalidad.length
    return mediaEdad
}

const nacionalidad = "Netherlands"
console.log(`La media de edad de los jugadores de ${nacionalidad} es: ` + calcularMediaEdadPorNacionalidad(jugadores, nacionalidad))

function calcularMediaEdadPorNacionalidades(jugadores){
    let nacionalidades = []
    res = []
    i = 0
    jugadores.forEach(jugador => {
        let nacionalidad = nacionalidades.filter(x => x === jugador.nationality)
        if(nacionalidad.length <= 0){
            let pos = nacionalidades.length
            nacionalidades[pos] = jugador.nationality
            res[i] = "La media de edad de los jugadores de " + jugador.nationality + " es de: " + calcularMediaEdadPorNacionalidad(jugadores, jugador.nationality)
            i++
        }
    })
    return res;
}

let element = document.createElement("h1");

let mensaje = "";

calcularMediaEdadPorNacionalidades(jugadores).forEach((e)=>mensaje+=e+"<br>");

element.innerHTML = mensaje;

document.body.appendChild(element);