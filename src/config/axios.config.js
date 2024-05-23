import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { setLoginStatus, setToken, setUid } from '../redux/actions/auth';

const client = axios.create({
    baseURL: 'https://barcodeserver-latest-b6nu.onrender.com/',
    headers: {
        'Content-Type': 'application/json',
        
    },
}   
);
client.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
  }

  // Lấy giá trị từ localStorage và gán cho x-user-id
  const userId = localStorage.getItem('uid');
  if (userId) {
      config.headers['x-user-id'] = userId;
  }

  return config;
});
client.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 500 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Check both status code and error message
            if (error.response.status === 500 && error.response.data.message && error.response.data.message.includes('jwt expired')) {
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    const response = await client.get(`auth/refresh-token?refreshToken=${refreshToken}`);
                  //  console.log(response)
                    if (response.data.code === 500) {
                        // Redirect to the login page
                        alert('Đã quá thời gian đăng nhập, Vui lòng đăng nhập lại!')
                       
                        
                        localStorage.clear()
                       
                        window.location.href = '/'; // Adjust the URL as needed
                        return; // Stop further execution
                    }
                    if (response.data.code === 200) {
                        // Redirect to the login page
                        const newToken = response.data.accessToken.newAccessToken;
                       
                            localStorage.setItem('token', newToken);
    
                            originalRequest.headers['authorization'] = `Bearer ${newToken}`;
                        
                    }
                    
                 
                  

                    // Retry the original request with the new token
                    return client(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh token', err);
                    // Handle token refresh failure (e.g., redirect to login)
                    return Promise.reject(error);
                }
            }
        }

        return Promise.reject(error);
    }
);
export default client;