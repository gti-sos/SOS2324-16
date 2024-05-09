function parseaFechasDMC(f){
    
    const partesFecha = f.split("/"); // Dividir la cadena en partes usando "/"
    const dia = parseInt(partesFecha[0], 10); // Convertir el mes a un número entero (base 10)
    const mes = parseInt(partesFecha[1], 10); // Convertir el día a un número entero (base 10)
    const anyo = parseInt(partesFecha[2], 10);

    const fecha = new Date(anyo, mes - 1, dia); // Nota: Restamos 1 del mes, ya que los meses en JavaScript van de 0 a 11

    return fecha;


}


let datosDMC=[
    {
        name:"Ting Zhu",
        ranking:3,
        nationality:"China",
        position:"Outside Hitter",
        birthdate:parseaFechasDMC("29/11/1994"),
        height:198,
        weight:78,
        dominant_hand:"Right",
        country_point:320.0,
        point:1190.0
    },
    {
        name:"Macris Carneiro",
        ranking:176,
        nationality:"Brazil",
        position:"Setter",
        birthdate:parseaFechasDMC("03/03/1989"),
        height:178,
        weight:68,
        dominant_hand:"Right",
        country_point:220.0,
        point:833.0
    },
    {
        name:"Gabriela Guimaraes",
        ranking:31,
        nationality:"Brazil",
        position:"Outside Hitter",
        birthdate:parseaFechasDMC("19/05/1994"),
        height:180,
        weight:65,
        dominant_hand:"Right",
        country_point:220.0,
        point:788.0
    },
    {
        name:"Tijana Boajkovia",
        ranking:28,
        nationality:"Serbia",
        position:"Opposite",
        birthdate:parseaFechasDMC("08/03/1997"),
        height:194,
        weight:84,
        dominant_hand:"Left",
        country_point:252.0,
        point:630.5
    },
    {
        name:"Paola Egonu",
        ranking:134,
        nationality:"Italy",
        position:"Opposite",
        birthdate:parseaFechasDMC("18/12/1998"),
        height:190,
        weight:70,
        dominant_hand:"Right",
        country_point:165.0,
        point:597.0
    },
    {
        name:"Bethania De La Cruz",
        ranking:23,
        nationality:"Dominican Republic",
        position:"Outside Hitter",
        birthdate:parseaFechasDMC("13/05/1987"),
        height:188,
        weight:68,
        dominant_hand:"Right",
        country_point:108.0,
        point:593.6
    },
    {
        name:"Kelsey Robinson",
        ranking:180,
        nationality:"USA",
        position:"Outside Hitter",
        birthdate:parseaFechasDMC("25/06/1992"),
        height:188,
        weight:75,
        dominant_hand:"Right",
        country_point:0.0,
        point:573.0
    },
    {
        name:"Mayu Ishikawa",
        ranking:1601,
        nationality:"Japan",
        position:"Outside Hitter",
        birthdate:parseaFechasDMC("14/05/2000"),
        height:173,
        weight:65,
        dominant_hand:"Right",
        country_point:190.0,
        point:553.25
    },
    {
        name:"Andrea Drews",
        ranking:621,
        nationality:"USA",
        position:"Opposite",
        birthdate:parseaFechasDMC("25/12/1993"),
        height:191,
        weight:77,
        dominant_hand:"Left",
        country_point:0.0,
        point:540.2
    },
    {
        name:"Brayelin Martínez",
        ranking:83,
        nationality:"Dominican Republic",
        position:"Outside Hitter",
        birthdate:parseaFechasDMC("11/09/1996"),
        height:201,
        weight:83,
        dominant_hand:"Right",
        country_point:108.0,
        point:538.1
    }
];

export default datosDMC;