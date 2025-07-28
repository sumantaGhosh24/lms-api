import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

import User from "./models/userModel";
import Category from "./models/categoryModel";
import Course from "./models/courseModel";
import Review from "./models/reviewModel";
import Order from "./models/orderModel";
import connectDB from "./lib/connectDB";

dotenv.config();

connectDB();

const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    console.log("Creating admin...");
    const admin = new User({
      email: faker.internet
        .email({firstName: "test", lastName: "admin"})
        .toLowerCase(),
      mobileNumber: faker.phone.number({style: "international"}),
      password: await bcrypt.hash("test@admin", 10),
      firstName: "test",
      lastName: "admin",
      username: faker.internet.username({firstName: "test", lastName: "admin"}),
      image: {
        public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
        url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
      },
      dob: faker.date
        .past({years: 30, refDate: "2000-01-01"})
        .toISOString()
        .split("T")[0],
      gender: faker.person.gender(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      addressline: faker.location.streetAddress(),
      status: "active",
      role: "admin",
    });
    await admin.save();
    console.log("Created admin.");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const user = new User({
        email: faker.internet.email({firstName, lastName}).toLowerCase(),
        mobileNumber: faker.phone.number({style: "international"}),
        password: await bcrypt.hash(firstName, 10),
        firstName: firstName,
        lastName: lastName,
        username: faker.internet.username({firstName, lastName}),
        image: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
        dob: faker.date
          .past({years: 30, refDate: "2000-01-01"})
          .toISOString()
          .split("T")[0],
        gender: faker.person.gender(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zip: faker.location.zipCode(),
        addressline: faker.location.streetAddress(),
        status: "active",
        role: "user",
      });
      users.push(await user.save());
    }
    console.log(`Seeded ${users.length} users.`);

    console.log("Seeding categories...");
    const categories = [];
    const categoryNames = [
      "Web Development",
      "Android Development",
      "Backend Development",
      "UI/UX",
      "DevOps",
      "Blockchain Development",
    ];
    for (let i = 0; i < 10; i++) {
      const category = new Category({
        name: categoryNames[i] || faker.lorem.word({length: {min: 5, max: 10}}),
        image: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
      });
      categories.push(await category.save());
    }
    console.log(`Seeded ${categories.length} categories.`);

    console.log("Seeding courses...");
    const courses = [];
    for (let i = 0; i < 100; i++) {
      const randomCategory = faker.helpers.arrayElement(categories);
      const course = new Course({
        owner: admin._id,
        title: faker.lorem.paragraph() + " Course",
        description: faker.lorem.paragraphs(2),
        content: faker.lorem.paragraphs(4),
        thumbnail: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        },
        category: randomCategory._id,
        price: faker.number.int({min: 1000, max: 10000}),
        chapters: Array.from({length: faker.number.int({min: 1, max: 5})}).map(
          () => ({
            title: faker.lorem.paragraph(),
            description: faker.lorem.paragraphs(2),
            content: faker.lorem.paragraphs(4),
            thumbnail: {
              public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
              url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
            },
            video: {
              public_id:
                "social-app-nextjs/8ccb1504-72bb-422c-bce1-249c97287396_y2eefg.mp4",
              url: "https://res.cloudinary.com/dzqgzsnoc/video/upload/v1734673644/social-app-nextjs/8ccb1504-72bb-422c-bce1-249c97287396_y2eefg.mp4",
            },
          })
        ),
      });
      courses.push(await course.save());
    }
    console.log(`Seeded ${courses.length} courses.`);

    console.log("Seeding reviews...");
    const reviews = [];
    for (let i = 0; i < 300; i++) {
      const randomCourse = faker.helpers.arrayElement(courses);
      const randomUser = faker.helpers.arrayElement(users);
      const review = new Review({
        course: randomCourse._id,
        user: randomUser._id,
        comment: faker.lorem.sentence(),
        rating: faker.number.int({min: 1, max: 5}),
      });
      reviews.push(await review.save());
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    console.log("Seeding orders...");
    const orders = [];
    for (let i = 0; i < 150; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomCourse = faker.helpers.arrayElement(courses);

      const order = new Order({
        user: randomUser._id,
        course: randomCourse._id,
        paymentResult: {
          id: faker.string.uuid(),
          status: faker.helpers.arrayElement(["paid", "pending", "failed"]),
          razorpay_order_id: faker.string.uuid(),
          razorpay_payment_id: faker.string.uuid(),
          razorpay_signature: faker.string.alphanumeric(32),
        },
        price: randomCourse.price,
        details: {
          complete: 0,
          completed: [],
        },
      });
      orders.push(await order.save());
    }
    console.log(`Seeded ${orders.length} orders.`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};

seedDB();
