const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.rating.deleteMany({})
  await prisma.swapRequest.deleteMany({})
  await prisma.availability.deleteMany({})
  await prisma.userSkill.deleteMany({})
  await prisma.skill.deleteMany({})
  await prisma.user.deleteMany({})

  // Create sample skills
  const skills = [
    { name: 'JavaScript', category: 'Technology', description: 'Programming language for web development' },
    { name: 'React', category: 'Technology', description: 'JavaScript library for building user interfaces' },
    { name: 'Node.js', category: 'Technology', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine' },
    { name: 'Python', category: 'Technology', description: 'High-level programming language' },
    { name: 'Graphic Design', category: 'Design', description: 'Visual communication through design' },
    { name: 'UI/UX Design', category: 'Design', description: 'User interface and experience design' },
    { name: 'Photography', category: 'Art', description: 'Art and technique of capturing images' },
    { name: 'Digital Marketing', category: 'Marketing', description: 'Marketing through digital channels' },
    { name: 'Content Writing', category: 'Marketing', description: 'Creating engaging written content' },
    { name: 'Guitar', category: 'Music', description: 'Playing guitar instrument' },
    { name: 'Piano', category: 'Music', description: 'Playing piano instrument' },
    { name: 'Spanish', category: 'Language', description: 'Spanish language learning' },
    { name: 'French', category: 'Language', description: 'French language learning' },
    { name: 'Cooking', category: 'Life Skills', description: 'Culinary arts and cooking techniques' },
    { name: 'Fitness Training', category: 'Health', description: 'Physical fitness and exercise guidance' },
    { name: 'Yoga', category: 'Health', description: 'Mind-body practice for wellness' },
    { name: 'Data Analysis', category: 'Technology', description: 'Analyzing and interpreting data' },
    { name: 'Machine Learning', category: 'Technology', description: 'AI and machine learning concepts' },
    { name: 'Video Editing', category: 'Media', description: 'Creating and editing video content' },
    { name: 'Public Speaking', category: 'Communication', description: 'Effective public speaking skills' }
  ]

  const createdSkills = await Promise.all(
    skills.map(skill => prisma.skill.create({ data: skill }))
  )

  // Create sample users
  const users = [
    {
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 12),
      name: 'John Doe',
      location: 'San Francisco, CA',
      isPublic: true
    },
    {
      email: 'jane.smith@example.com',
      password: await bcrypt.hash('password123', 12),
      name: 'Jane Smith',
      location: 'New York, NY',
      isPublic: true
    },
    {
      email: 'mike.johnson@example.com',
      password: await bcrypt.hash('password123', 12),
      name: 'Mike Johnson',
      location: 'Austin, TX',
      isPublic: true
    },
    {
      email: 'sarah.wilson@example.com',
      password: await bcrypt.hash('password123', 12),
      name: 'Sarah Wilson',
      location: 'Seattle, WA',
      isPublic: true
    },
    {
      email: 'david.brown@example.com',
      password: await bcrypt.hash('password123', 12),
      name: 'David Brown',
      location: 'Chicago, IL',
      isPublic: true
    }
  ]

  const createdUsers = await Promise.all(
    users.map(user => prisma.user.create({ data: user }))
  )

  // Create user skills
  const userSkills = [
    // John Doe - JavaScript developer
    { userId: createdUsers[0].id, skillId: createdSkills[0].id, type: 'OFFERED', level: 'EXPERT' },
    { userId: createdUsers[0].id, skillId: createdSkills[1].id, type: 'OFFERED', level: 'ADVANCED' },
    { userId: createdUsers[0].id, skillId: createdSkills[2].id, type: 'OFFERED', level: 'INTERMEDIATE' },
    { userId: createdUsers[0].id, skillId: createdSkills[4].id, type: 'WANTED', level: 'BEGINNER' },
    { userId: createdUsers[0].id, skillId: createdSkills[9].id, type: 'WANTED', level: 'INTERMEDIATE' },

    // Jane Smith - Designer
    { userId: createdUsers[1].id, skillId: createdSkills[4].id, type: 'OFFERED', level: 'EXPERT' },
    { userId: createdUsers[1].id, skillId: createdSkills[5].id, type: 'OFFERED', level: 'ADVANCED' },
    { userId: createdUsers[1].id, skillId: createdSkills[6].id, type: 'OFFERED', level: 'INTERMEDIATE' },
    { userId: createdUsers[1].id, skillId: createdSkills[0].id, type: 'WANTED', level: 'BEGINNER' },
    { userId: createdUsers[1].id, skillId: createdSkills[18].id, type: 'WANTED', level: 'INTERMEDIATE' },

    // Mike Johnson - Marketing specialist
    { userId: createdUsers[2].id, skillId: createdSkills[7].id, type: 'OFFERED', level: 'EXPERT' },
    { userId: createdUsers[2].id, skillId: createdSkills[8].id, type: 'OFFERED', level: 'ADVANCED' },
    { userId: createdUsers[2].id, skillId: createdSkills[19].id, type: 'OFFERED', level: 'ADVANCED' },
    { userId: createdUsers[2].id, skillId: createdSkills[3].id, type: 'WANTED', level: 'BEGINNER' },
    { userId: createdUsers[2].id, skillId: createdSkills[16].id, type: 'WANTED', level: 'INTERMEDIATE' },

    // Sarah Wilson - Language teacher
    { userId: createdUsers[3].id, skillId: createdSkills[11].id, type: 'OFFERED', level: 'EXPERT' },
    { userId: createdUsers[3].id, skillId: createdSkills[12].id, type: 'OFFERED', level: 'ADVANCED' },
    { userId: createdUsers[3].id, skillId: createdSkills[13].id, type: 'OFFERED', level: 'INTERMEDIATE' },
    { userId: createdUsers[3].id, skillId: createdSkills[10].id, type: 'WANTED', level: 'BEGINNER' },
    { userId: createdUsers[3].id, skillId: createdSkills[15].id, type: 'WANTED', level: 'INTERMEDIATE' },

    // David Brown - Fitness enthusiast
    { userId: createdUsers[4].id, skillId: createdSkills[14].id, type: 'OFFERED', level: 'EXPERT' },
    { userId: createdUsers[4].id, skillId: createdSkills[15].id, type: 'OFFERED', level: 'ADVANCED' },
    { userId: createdUsers[4].id, skillId: createdSkills[13].id, type: 'OFFERED', level: 'INTERMEDIATE' },
    { userId: createdUsers[4].id, skillId: createdSkills[17].id, type: 'WANTED', level: 'BEGINNER' },
    { userId: createdUsers[4].id, skillId: createdSkills[6].id, type: 'WANTED', level: 'INTERMEDIATE' },
  ]

  await Promise.all(
    userSkills.map(userSkill => prisma.userSkill.create({ data: userSkill }))
  )

  // Create sample availability
  const availability = [
    // John Doe availability
    { userId: createdUsers[0].id, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
    { userId: createdUsers[0].id, dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
    { userId: createdUsers[0].id, dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
    { userId: createdUsers[0].id, dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '16:00' },

    // Jane Smith availability
    { userId: createdUsers[1].id, dayOfWeek: 'MONDAY', startTime: '10:00', endTime: '18:00' },
    { userId: createdUsers[1].id, dayOfWeek: 'WEDNESDAY', startTime: '10:00', endTime: '18:00' },
    { userId: createdUsers[1].id, dayOfWeek: 'FRIDAY', startTime: '10:00', endTime: '18:00' },
    { userId: createdUsers[1].id, dayOfWeek: 'SUNDAY', startTime: '14:00', endTime: '18:00' },

    // Mike Johnson availability
    { userId: createdUsers[2].id, dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
    { userId: createdUsers[2].id, dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00' },
    { userId: createdUsers[2].id, dayOfWeek: 'SATURDAY', startTime: '09:00', endTime: '15:00' },
    { userId: createdUsers[2].id, dayOfWeek: 'SUNDAY', startTime: '09:00', endTime: '15:00' },
  ]

  await Promise.all(
    availability.map(avail => prisma.availability.create({ data: avail }))
  )

  // Get user skills for creating swap requests
  const createdUserSkills = await prisma.userSkill.findMany({
    include: {
      user: true,
      skill: true
    }
  })

  // Create sample swap requests
  const swapRequests = [
    // John wants to learn Graphic Design from Jane, offering JavaScript
    {
      requesterId: createdUsers[0].id, // John
      receiverId: createdUsers[1].id,  // Jane
      skillOfferedId: createdUserSkills.find(us => us.userId === createdUsers[0].id && us.skill.name === 'JavaScript').id,
      skillWantedId: createdUserSkills.find(us => us.userId === createdUsers[1].id && us.skill.name === 'Graphic Design').id,
      status: 'PENDING',
      message: 'Hi Jane! I\'d love to learn graphic design from you. I can teach you JavaScript in return.'
    },
    // Jane wants to learn JavaScript from John, offering UI/UX Design
    {
      requesterId: createdUsers[1].id, // Jane
      receiverId: createdUsers[0].id,  // John
      skillOfferedId: createdUserSkills.find(us => us.userId === createdUsers[1].id && us.skill.name === 'UI/UX Design').id,
      skillWantedId: createdUserSkills.find(us => us.userId === createdUsers[0].id && us.skill.name === 'JavaScript').id,
      status: 'ACCEPTED',
      message: 'Hey John! I saw your JavaScript skills and would love to learn. I can help you with UI/UX design.'
    },
    // Mike wants to learn Python from someone, offering Digital Marketing
    {
      requesterId: createdUsers[2].id, // Mike
      receiverId: createdUsers[0].id,  // John (but John doesn't have Python)
      skillOfferedId: createdUserSkills.find(us => us.userId === createdUsers[2].id && us.skill.name === 'Digital Marketing').id,
      skillWantedId: createdUserSkills.find(us => us.userId === createdUsers[0].id && us.skill.name === 'JavaScript').id,
      status: 'REJECTED',
      message: 'Hi! I\'d like to learn from you. I can teach digital marketing in exchange.'
    },
    // Sarah wants to learn Piano from David, offering Spanish
    {
      requesterId: createdUsers[3].id, // Sarah
      receiverId: createdUsers[4].id,  // David
      skillOfferedId: createdUserSkills.find(us => us.userId === createdUsers[3].id && us.skill.name === 'Spanish').id,
      skillWantedId: createdUserSkills.find(us => us.userId === createdUsers[4].id && us.skill.name === 'Fitness Training').id,
      status: 'COMPLETED',
      message: 'I\'d love to learn fitness training from you! I can teach you Spanish.'
    },
    // David wants to learn Cooking from Sarah, offering Fitness Training
    {
      requesterId: createdUsers[4].id, // David
      receiverId: createdUsers[3].id,  // Sarah
      skillOfferedId: createdUserSkills.find(us => us.userId === createdUsers[4].id && us.skill.name === 'Fitness Training').id,
      skillWantedId: createdUserSkills.find(us => us.userId === createdUsers[3].id && us.skill.name === 'Cooking').id,
      status: 'PENDING',
      message: 'Hi Sarah! I\'d love to learn cooking from you. I can help you with fitness training.'
    }
  ]

  await Promise.all(
    swapRequests.map(swapRequest => prisma.swapRequest.create({ data: swapRequest }))
  )

  console.log('Database seeded successfully!')
  console.log('Sample users created:')
  console.log('- john.doe@example.com (password: password123)')
  console.log('- jane.smith@example.com (password: password123)')
  console.log('- mike.johnson@example.com (password: password123)')
  console.log('- sarah.wilson@example.com (password: password123)')
  console.log('- david.brown@example.com (password: password123)')
  console.log('Sample swap requests created for testing!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
