const mongoose = require('mongoose')

// Optional: keep Mongoose from logging strictQuery warnings
mongoose.set('strictQuery', true)

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI

    if (!uri || typeof uri !== 'string') {
      throw new Error(
        "MONGO_URI is not defined or is not a valid string. Check your .env file.",
      )
    }

    // Debug log (do NOT log real credentials in production)
    // Shows only the protocol/host part to avoid leaking secrets
    try {
      const safeUri = new URL(uri)
      // eslint-disable-next-line no-console
      console.log(
        `Attempting MongoDB connection to: ${safeUri.protocol}//${safeUri.hostname}`,
      )
    } catch {
      // eslint-disable-next-line no-console
      console.log('Attempting MongoDB connection to provided MONGO_URI')
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of hanging forever
    })

    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    // More detailed error logging, especially for DNS / network issues
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error.message)

    if (error.code === 'ECONNREFUSED') {
      // eslint-disable-next-line no-console
      console.error(
        'ECONNREFUSED: Unable to reach MongoDB host. Check your internet connection, Atlas IP whitelist, and cluster status.',
      )
    }

    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      // eslint-disable-next-line no-console
      console.error(
        'DNS error: MongoDB host could not be resolved. Verify your MONGO_URI and DNS/network configuration.',
      )
    }

    // eslint-disable-next-line no-console
    console.error('Full MongoDB error stack:', error)

    // Do not crash the entire Node process – allow the HTTP server to start
    // so that you can still hit health endpoints while fixing MongoDB.
    // Signal failure so the caller can decide whether to exit
    return false
  }
}

module.exports = connectDB

