import client from "../config/axios.config";
const BeckmanGenator = async(datareq)=>{
    try {
        const data = await client.post('barcode/beckman_genator', datareq)
        return data
    } catch (error) {
        console.error(error)
    }
   

}
const BeckmanRead = async (code)=>{
    try {
        const data = await client.get(`barcode/read_beckman?code=${code}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
export {BeckmanGenator, BeckmanRead}