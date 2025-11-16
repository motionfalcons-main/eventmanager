// Simple seed script to populate sample events and tickets
// Usage: NODE_ENV=production DATABASE_URL=... node server/scripts/seed.js
require('dotenv').config({ path: './.env' })
const { Op } = require('sequelize')
const sequelize = require('../utils/database')
const Event = require('../models/Event')
const Ticket = require('../models/Ticket')

function daysFromNow(n) {
  return Math.floor(Date.now() / 1000) + n * 24 * 60 * 60
}

async function main() {
  console.log('Seeding database with sample events...')
  await sequelize.authenticate()
  // Ensure tables exist
  await sequelize.sync()

  const samples = [
    {
      title: 'Today Demo Meetup',
      category: 'Community',
      location: 'Berlin',
      description: 'Quick demo meetup seeded to always show up under Today.',
      eventType: 'free',
      ticketQuantity: 0,
      ticketPrice: 0,
      startDate: daysFromNow(0), // today
      endDate: daysFromNow(0),
      imageURL: 'eventImages/sample-today.jpg',
    },
    {
      title: 'Tech Innovators Summit',
      category: 'Technology',
      location: 'Berlin',
      description: 'Join leading innovators to discuss the future of AI, cloud, and edge computing.',
      eventType: 'paid',
      ticketQuantity: 200,
      ticketPrice: 99,
      startDate: daysFromNow(7),
      endDate: daysFromNow(8),
      imageURL: 'eventImages/sample-tech.jpg',
    },
    {
      title: 'Berlin Music Fest',
      category: 'Music',
      location: 'Berlin',
      description: 'A weekend of live performances from top artists across Europe.',
      eventType: 'paid',
      ticketQuantity: 500,
      ticketPrice: 59,
      startDate: daysFromNow(14),
      endDate: daysFromNow(15),
      imageURL: 'eventImages/sample-music.jpg',
    },
    {
      title: 'Paris Art Expo',
      category: 'Art',
      location: 'Paris',
      description: 'Explore modern art from emerging and established artists.',
      eventType: 'free',
      ticketQuantity: 0,
      ticketPrice: 0,
      startDate: daysFromNow(10),
      endDate: daysFromNow(11),
      imageURL: 'eventImages/sample-art.jpg',
    },
    {
      title: 'Lisbon Startup Meetup',
      category: 'Business',
      location: 'Lisbon',
      description: 'Network with founders, investors, and operators building the next wave of startups.',
      eventType: 'free',
      ticketQuantity: 0,
      ticketPrice: 0,
      startDate: daysFromNow(5),
      endDate: daysFromNow(5),
      imageURL: 'eventImages/sample-business.jpg',
    },
    {
      title: 'Rome Food Carnival',
      category: 'Food',
      location: 'Rome',
      description: 'Taste the best of Mediterranean cuisine with live cooking shows.',
      eventType: 'paid',
      ticketQuantity: 300,
      ticketPrice: 25,
      startDate: daysFromNow(20),
      endDate: daysFromNow(21),
      imageURL: 'eventImages/sample-food.jpg',
    },
    {
      title: 'Madrid Football Fan Zone',
      category: 'Sports',
      location: 'Madrid',
      description: 'Match screenings, games, and meetups for football fans.',
      eventType: 'paid',
      ticketQuantity: 400,
      ticketPrice: 15,
      startDate: daysFromNow(9),
      endDate: daysFromNow(9),
      imageURL: 'eventImages/sample-sports.jpg',
    },
    {
      title: 'Amsterdam Tech Night',
      category: 'Technology',
      location: 'Amsterdam',
      description: 'Evening lightning talks and networking with local devs.',
      eventType: 'free',
      ticketQuantity: 0,
      ticketPrice: 0,
      startDate: daysFromNow(12),
      endDate: daysFromNow(12),
      imageURL: 'eventImages/sample-meetup.jpg',
    },
  ]

  for (const s of samples) {
    const exists = await Event.findOne({ where: { title: s.title } })
    if (exists) {
      console.log(`Skipping existing event: ${s.title}`)
      continue
    }
    const ev = await Event.create(s)
    // Attach a ticket record when paid
    if (s.eventType === 'paid') {
      await Ticket.create({
        title: `${s.title} General Admission`,
        ticketQuantity: s.ticketQuantity,
        ticketPrice: s.ticketPrice,
        eventId: ev.id,
      })
    }
    console.log(`Created event: ${s.title}`)
  }

  console.log('Seed complete.')
  await sequelize.close()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})


