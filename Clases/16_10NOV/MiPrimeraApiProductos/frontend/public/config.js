const isLocalFrontend = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.MITIENDA_API_URL = isLocalFrontend
	? 'http://localhost:5051'
	: 'https://desarrollobasadoenplataformas-puce.onrender.com';