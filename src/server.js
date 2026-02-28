const dotenv = require('dotenv')
const app = require('./app')
const connectDB = require('./config/db')
const User = require('./models/User')
const Service = require('./models/Service')

// Load environment variables as early as possible
dotenv.config()

// Debug log to verify that MONGO_URI is defined (without leaking credentials)
try {
  const u = new URL(process.env.MONGO_URI)
  // eslint-disable-next-line no-console
  console.log(`MONGO_URI host: ${u.hostname}`)
} catch {
  // eslint-disable-next-line no-console
  console.log('MONGO_URI host: <invalid or missing>')
}

const PORT = process.env.PORT || 5000

async function seedInitialData() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@solunbarber.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'

  const adminCount = await User.countDocuments({ role: 'admin' })
  if (adminCount === 0) {
    const admin = await User.create({
      name: 'Solun Admin',
      email: adminEmail,
      phone: '0000000000',
      password: adminPassword,
      role: 'admin',
    })
    // eslint-disable-next-line no-console
    console.log('Created initial admin user:', admin.email)
  }

  const serviceCount = await Service.countDocuments()
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        name: 'Signature Skin Fade',
        price: 35,
        duration: '45 min',
        description:
          'High precision fade with detailed blending, tailored to your head shape and style.',
      },
      {
        name: 'Classic Cut & Style',
        price: 30,
        duration: '40 min',
        description:
          'Clean scissor and clipper work finished with premium styling products.',
      },
      {
        name: 'Beard Sculpt & Detail',
        price: 25,
        duration: '30 min',
        description:
          'Full beard shaping, razor line-up, and nourishing hot towel treatment.',
      },
    ])
    // eslint-disable-next-line no-console
    console.log('Seeded initial barber services')
  }
}

const startServer = async () => {
  const connected = await connectDB()

  if (!connected) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB. Server not started.')
    process.exit(1)
  }

  await seedInitialData()

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`)
    // eslint-disable-next-line no-console
    console.log(
      `Admin login: ${process.env.ADMIN_EMAIL || 'admin@solunbarber.com'} / ${
        process.env.ADMIN_PASSWORD || 'Admin@123'
      }`,
    )
  })
}

startServer()

