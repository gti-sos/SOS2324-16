function parseaFechasPRR(f){
  const partesFecha = f.split("/"); // Dividir la cadena en partes usando "/"
  const dia = parseInt(partesFecha[0], 10); // Convertir el mes a un número entero (base 10)
  const mes = parseInt(partesFecha[1], 10); // Convertir el día a un número entero (base 10)
  const anyo = parseInt(partesFecha[2], 10);

  const fecha = new Date(anyo, mes - 1, dia); // Nota: Restamos 1 del mes, ya que los meses en JavaScript van de 0 a 11

  return fecha;
}

let array = [
  {
    "team": "ARG",
    "plabel": "Lock",
    "age": 27,
    "height": 198,
    "weight": 112,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("05/12/1991"),
    "last": "Alemanno",
    "first": "Matias Ignacio",
    "caps": 57
  },
  {
    "team": "ARG",
    "plabel": "Full Back",
    "age": 24,
    "height": 191,
    "weight": 91,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("16/01/1995"),
    "last": "Boffelli",
    "first": "Emiliano",
    "caps": 25
  },
  {
    "team": "ARG",
    "plabel": "Back Row",
    "age": 26,
    "height": 187,
    "weight": 109,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("03/09/1993"),
    "last": "Bruni Pleininger",
    "first": "Rodrigo",
    "caps": 3
  },
  {
    "team": "ARG",
    "plabel": "Full Back",
    "age": 21,
    "height": 181,
    "weight": 82,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("30/03/1998"),
    "last": "Carreras",
    "first": "Santiago",
    "caps": 1
  },
  {
    "team": "ARG",
    "plabel": "Hooker",
    "age": 34,
    "height": 182,
    "weight": 106,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("15/03/1985"),
    "last": "Creevy",
    "first": "Agustín",
    "caps": 85
  },
  {
    "team": "ARG",
    "plabel": "Scrum Half",
    "age": 30,
    "height": 175,
    "weight": 79,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("12/06/1989"),
    "last": "Cubelli",
    "first": "Tomas Maria",
    "caps": 72
  },
  {
    "team": "ARG",
    "plabel": "Centre",
    "age": 28,
    "height": 183,
    "weight": 93,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("24/02/1991"),
    "last": "De La Fuente",
    "first": "Jeronimo",
    "caps": 50
  },
  {
    "team": "ARG",
    "plabel": "Wing",
    "age": 22,
    "height": 178,
    "weight": 80,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("22/04/1997"),
    "last": "Delguy",
    "first": "Bautista",
    "caps": 11
  },
  {
    "team": "ARG",
    "plabel": "Scrum Half",
    "age": 26,
    "height": 179,
    "weight": 85,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("15/04/1993"),
    "last": "Ezcurra",
    "first": "Felipe",
    "caps": 5
  },
  {
    "team": "ARG",
    "plabel": "Prop",
    "age": 31,
    "height": 190,
    "weight": 115,
    "bplace": "Argentina",
    "bdate": parseaFechasPRR("25/03/1988"),
    "last": "Figallo",
    "first": "Juan Guillermo",
    "caps": 30
  }
];

module.exports.array = array;

module.exports.mediaPesoPorPais = function(array, pais){
  array.filter(x => x.bplace == pais);
  let acum=0;
  array.forEach( (e)=> acum+=e.weight );
  return "La media del peso entre los 10 jugadores en la cabecera principal del csv : " + acum/array.length;
}
