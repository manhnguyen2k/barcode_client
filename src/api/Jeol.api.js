import client from "../config/axios.config";


const JeolGenator = async(datareq)=>{
    try {
        const data = await client.post('barcode/jeol/genetor', datareq)
        return data
    } catch (error) {
        console.error(error)
    }
   

}

const JeolRead = async (code)=>{
    try {
        const data = await client.get(`barcode/jeol/read?code=${code}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
export {JeolGenator, JeolRead}