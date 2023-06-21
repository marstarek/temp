import axios from 'axios';
import router from '../Routes/Routes';

export const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_DATABASE_URL,
});

axiosInstance.interceptors.request.use(
	function (config: any) {
		if (config.url !== '/login') {
			const token = localStorage.getItem('userToken');
			config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : '';
		}
		return config;
	},
	(error: any) => {
		return Promise.reject(error);
	},
);
axiosInstance.interceptors.response.use(
	(res: any) => {
		if (res.status === 200) {
			return res;
		}
	},
	async (err: any) => {
		if (err.response) {
			if (err.response.status === 423) {
				setTimeout(() => {
					router.navigate('/my-profile', { state: 1 });
				}, 2000);
			}
			// Access Token was expired
			if (err.response.status === 401 && window.location.pathname !== '/login') {
				setTimeout(() => {
					window.location.href = '/login';
					localStorage.clear();
				}, 2000);
				return Promise.reject(err);
			}
			if (err.response.status === 422) {
				for (const key in err.response.data.errors) {
					const element = err.response.data.errors[key];
					for (const errMessage of element) {
						console.log('ele', errMessage);
					}
				}
			}
			// if (err.response.status === 403) {
			// }

			// if (err.response.status === 500) {
			// }
			// if (err.response.status === 404) {
			// }
		}
		return Promise.reject(err);
	},
);

export default axiosInstance;
