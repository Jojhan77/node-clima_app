const fs = require('fs');
const axios = require('axios').default;

class Busquedas{
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
     
        }
    }

    async ciudad( lugar = ''){
       try{
            //peticion http
           const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
          
            });

            const resp = await instance.get();

            return resp.data.features.map( luga =>({
               id: luga.id,
               nombre: luga.place_name,
               lng: luga.center[0],
               lat: luga.center[1],
            }));

       }catch(error){
           return[];
       }
    }


    async climaLugar(lat, lon){
        try {
            //instance axios
            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            //respuesta
            const resp = await instance.get();
            const {weather, main} = resp.data;

            //mapeo desc, min, max, temp
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }


        } catch (error) {
            console.log(error);
            
        }
    }

    agregarHistorial (lugar =''){
        //prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {

        if( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );

        this.historial = data.historial;


    }

   
}


module.exports = Busquedas;