import client from "../config/axios.config";
const FrunoGenator = async(datareq)=>{
    try {
        const data = await client.post('barcode/genator', datareq)
        return data
    } catch (error) {
        console.error(error)
    }
   

}
const FrunoRead = async (code)=>{
    try {
        const data = await client.get(`barcode/read?code=${code}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
export {FrunoGenator, FrunoRead}