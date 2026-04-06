const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/alumni_platform');
    
    // Clear existing data
    await Student.deleteMany({});
    await User.deleteMany({});

    // Sample students data
    const students = [
      {
        rollNo: '22eg105p58',
        yearOfJoining: 2022,
        department: 'EG',
        sequence: '105',
        section: 'P',
        number: 58,
        collegeEmail: '22eg105p58@anurag.edu.in',
        name: 'Varshith',
        personalEmail: 'varlavarshith2004@gmail.com',
        yearOfGraduation: 2026,
        isVerified: false
      },
      {
        rollNo: '22eg105a01',
        yearOfJoining: 2022,
        department: 'EG',
        sequence: '105',
        section: 'A',
        number: 1,
        collegeEmail: '22eg105a01@anurag.edu.in',
        name: 'John Doe',
        personalEmail: 'john.doe@gmail.com',
        yearOfGraduation: 2026,
        isVerified: false
      },
      {
        rollNo: '22eg105b15',
        yearOfJoining: 2022,
        department: 'EG',
        sequence: '105',
        section: 'B',
        number: 15,
        collegeEmail: '22eg105b15@anurag.edu.in',
        name: 'Jane Smith',
        personalEmail: 'jane.smith@gmail.com',
        yearOfGraduation: 2026,
        isVerified: false
      },
      {
        rollNo: '22eg105p33',
        yearOfJoining: 2022,
        department: 'EG',
        sequence: '105',
        section: 'P',
        number: 33,
        collegeEmail: '22eg105p33@anurag.edu.in',
        name: 'Sample Student',
        personalEmail: 'student@gmail.com',
        yearOfGraduation: 2026,
        isVerified: false
      },
      {
        rollNo: '21cs201a05',
        yearOfJoining: 2021,
        department: 'CS',
        sequence: '201',
        section: 'A',
        number: 5,
        collegeEmail: '21cs201a05@anurag.edu.in',
        name: 'Alice Johnson',
        personalEmail: 'alice.johnson@gmail.com',
        yearOfGraduation: 2025,
        isVerified: false
      },
      {
        rollNo: '20me301b12',
        yearOfJoining: 2020,
        department: 'ME',
        sequence: '301',
        section: 'B',
        number: 12,
        collegeEmail: '20me301b12@anurag.edu.in',
        name: 'Bob Wilson',
        personalEmail: 'bob.wilson@gmail.com',
        yearOfGraduation: 2024,
        isVerified: false
      },
      {
        rollNo: '19ec401c08',
        yearOfJoining: 2019,
        department: 'EC',
        sequence: '401',
        section: 'C',
        number: 8,
        collegeEmail: '19ec401c08@anurag.edu.in',
        name: 'Carol Brown',
        personalEmail: 'carol.brown@gmail.com',
        yearOfGraduation: 2023,
        isVerified: false
      }
    ];

    await Student.insertMany(students);
    console.log('Students seeded successfully');

    // Create an admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      rollNo: '19ec401c08',
      collegeEmail: '19ec401c08@anurag.edu.in',
      personalEmail: 'carol.brown@gmail.com',
      name: 'Carol Brown',
      department: 'EC',
      yearOfJoining: 2019,
      yearOfGraduation: 2023,
      section: 'C',
      number: 8,
      currentCity: 'Hyderabad',
      currentCompany: 'Tech Corp',
      passwordHash: adminPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Admin credentials: rollNo: 19ec401c08, password: admin123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();