module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8080,
    URL: process.env.BASE_URL || 'http://localhost:8080',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://asdasd:pZeCBhNfCqSj8Fh8@cluster0.yefmk.mongodb.net/test?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'bacon'
}