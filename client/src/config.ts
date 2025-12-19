const config = {
    API_URL: typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? "http://localhost:5000/api"
        : "/api",
};

export default config;
