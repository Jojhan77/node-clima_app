require('dotenv').config()

const { pausa, inquirerMenu, leerInput, listarLugares } = require("./helpers/inquierer");
const Busquedas = require("./models/busquedas");



const main = async ( ) =>{
    console.clear();
    let opt = '';
    const  busquedas = new Busquedas();

    await pausa();

    do{
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
               
                //Buscar lugares
                const lugares = await busquedas.ciudad(lugar);
                
                //Seleccionar el lugar
                const id = await listarLugares(lugares);

                if (id ==='0') continue;
                const lugarSel = lugares.find( l => l.id === id);
                
                //guardar DB
                busquedas.agregarHistorial(lugarSel.nombre);
               

                //clima
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

                
                //resultados
                console.log('\nInformacion de la ciudad\n'.rainbow);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:',clima.temp );
                console.log('Minima:',clima.min );
                console.log('Maxima:',clima.max );
                console.log('Como esta el clima:',clima.desc );

            break;
        
            case '2':
                busquedas.historial.forEach((lug, i)=>{
                    const idx = `${i+1}.`;
                    console.log(`${idx} ${lug}`);
                })
            break;

               
        

        }
        if(opt !==0) await pausa();

    }while( opt != '0');

}

main();