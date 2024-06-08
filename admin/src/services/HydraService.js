import axios from './BaseService';

const HYDRA_URL = `${process.env.REACT_APP_API_URL}/hydra/`;

export async function getDashboard() {
    
    const response = await axios.get(HYDRA_URL + 'dashboard');
    return response.data;
}