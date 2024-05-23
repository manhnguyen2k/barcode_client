import client from "../config/axios.config"
const LoginApi = async(username,passwd)=>{
    try {
        const requestData = {
            username: username,
            passwd: passwd
            // Thêm các trường khác nếu cần
          };
        const login = await client.post('auth/login', requestData)
        return login
    } catch (error) {
        console.error(error)
    }
}
export {LoginApi}