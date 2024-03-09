function parseaFechasPSS(f){
    
    const partesFecha = f.split("/"); // Dividir la cadena en partes usando "/"
    const dia = parseInt(partesFecha[0], 10); // Convertir el mes a un número entero (base 10)
    const mes = parseInt(partesFecha[1], 10); // Convertir el día a un número entero (base 10)
    const anyo = parseInt(partesFecha[2], 10);

    const fecha = new Date(anyo, mes - 1, dia); // Nota: Restamos 1 del mes, ya que los meses en JavaScript van de 0 a 11

    return fecha;
}

let jugadores=[
    {short_name: "L. Messi", long_name: "Lionel Andrés Messi Cuccittini", age: 27, dob: parseaFechasPSS("24/06/1987"), height_cm: 169, weight_kg: 67, nationality: "Argentina", club: "FC Barcelona", preferred_foot: "Left", team_position: "CF"},
    {short_name: "Cristiano Ronaldo", long_name: "Cristiano Ronaldo dos Santos Aveiro", age: 29, dob: parseaFechasPSS("05/02/1985"),	height_cm: 185, weight_kg: 80, nationality: "Portugal", club: "Real Madrid", preferred_foot: "Right", team_position: "LW"}, 		
    {short_name: "A. Robben", long_name: "Arjen Robben", age: 30,	dob: parseaFechasPSS("23/01/1984"), height_cm: 180, weight_kg: 80, nationality: "Netherlands", club: "FC Bayern München", preferred_foot: "Left", team_position: "SUB"}, 
    {short_name: "Z. Ibrahimoviç",	long_name: "Zlatan Ibrahimoviç", age: 32,	dob: parseaFechasPSS("03/10/1981"), height_cm: 195, weight_kg: 95, nationality: "Sweden", club: "Paris Saint-Germain", preferred_foot: "Right", team_position: "ST"}, 				
    {short_name: "M. Neuer", long_name: "Manuel Neuer", age: 28, dob: parseaFechasPSS("27/03/1986"), height_cm: 193, weight_kg: 92, nationality: "Germany", club: "FC Bayern München", preferred_foot: "Right", team_position: "GK"},
    {short_name: "L. Suárez", long_name: "Luis Alberto Suárez Díaz", age: 27,	dob: parseaFechasPSS("24/01/1987"),	height_cm: 181, weight_kg: 81, nationality: "Uruguay", club: "FC Barcelona", preferred_foot: "Right", team_position: "RES"},
    {short_name: "E. Hazard", long_name: "Eden Hazard", age: 23, dob: parseaFechasPSS("07/01/1991"), height_cm: 173, weight_kg: 74, nationality: "Belgium", club: "Chelsea", preferred_foot: "Right", team_position: "LM"},		
    {short_name: "R. van Persie", long_name: "Robin van Persie", age: 30, dob: parseaFechasPSS("06/08/1983"), height_cm: 187, weight_kg: 71, nationality: "Netherlands", club: "Manchester United", preferred_foot: "Left", team_position: "RS"},
    {short_name: "B. Schweinsteiger", long_name: "Bastian Schweinsteiger", age: 29,	dob: parseaFechasPSS("01/08/1984"), height_cm: 183, weight_kg: 79, nationality: "Germany", club: "FC Bayern München", preferred_foot: "Right", team_position: "SUB"},
    {short_name: "F. Ribéry", long_name: "Franck Bilal Ribéry", age: 31,	dob: parseaFechasPSS("07/04/1983"),	height_cm: 170, weight_kg: 72, nationality: "France", club: "FC Bayern München", preferred_foot: "Right", team_position: "SUB"}
];

module.exports.jugadores = jugadores;