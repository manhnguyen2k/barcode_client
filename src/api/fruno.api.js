import client from "../config/axios.config";
const FrunoGenator_old = async(datareq)=>{
    try {
        const data = await client.post('barcode/genator/old', datareq)
        return data
    } catch (error) {
        console.error(error)
    }
   

}

const FrunoGenator_new = async(datareq)=>{
    try {
        const data = await client.post('barcode/genator/new', datareq)
        return data
    } catch (error) {
        console.error(error)
    }
   

}
const FrunoRead_old = async (code)=>{
    try {
        const data = await client.get(`barcode/read/old?code=${code}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
const FrunoRead_new = async (code)=>{
    try {
        const data = await client.get(`barcode/read/new?code=${code}`)
        return data
    } catch (error) {
        console.error(error)
    }
}
export {FrunoGenator_old,FrunoGenator_new, FrunoRead_old, FrunoRead_new}