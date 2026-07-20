import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

const blogs = [
  {
    title: "10 Simple Tips for a Healthy Lifestyle",
    description: "Small daily habits can make a big difference in your overall health and wellness.",
    content:
      "A healthy lifestyle starts with simple steps such as drinking enough water, sleeping well, eating balanced meals, and staying active. Regular health checkups and stress management are also important for long-term wellness.",
    category: "Health Tips",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
    author: "Healthcare Team",
    readTime: "5 min read",
  },
  {
    title: "Understanding Diabetes and Its Warning Signs",
    description: "Learn about common diabetes symptoms and why early medical advice is important.",
    content:
      "Diabetes is a condition that affects how the body manages blood sugar. Common signs may include frequent thirst, frequent urination, tiredness, and slow healing wounds. This information is for general awareness only and does not replace medical advice.",
    category: "Disease Information",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800",
    author: "Dr. Sarah Khan",
    readTime: "7 min read",
  },
  {
    title: "Why Regular Exercise Supports Better Health",
    description: "Exercise helps improve heart health, strength, mood, and energy levels.",
    content:
      "Regular physical activity can support cardiovascular health, improve flexibility, strengthen muscles, and reduce stress. Even walking for 20 to 30 minutes daily can be beneficial for many people.",
    category: "Fitness",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    author: "Health & Fitness Team",
    readTime: "4 min read",
  },
  {
    title: "Nutrition Basics for Everyday Wellness",
    description: "A balanced diet gives your body the nutrients it needs to function well.",
    content:
      "Good nutrition includes fruits, vegetables, whole grains, proteins, and healthy fats. Try to reduce excessive sugar, processed foods, and sugary drinks. Always consult a qualified healthcare professional for personal diet advice.",
    category: "Nutrition",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    author: "Nutrition Team",
    readTime: "6 min read",
  },
  {
    title: "Mental Health Matters: Managing Daily Stress",
    description: "Stress management is an important part of overall healthcare.",
    content:
      "Mental health is as important as physical health. Deep breathing, talking to someone you trust, maintaining a routine, and getting enough rest can help manage daily stress. If stress feels overwhelming, seek professional help.",
    category: "Mental Health",
    image:
      "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
    author: "Wellness Team",
    readTime: "5 min read",
  },
];

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Blog.deleteMany();
    await Blog.insertMany(blogs);

    console.log("Blog data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Blog seed failed:", error.message);
    process.exit(1);
  }
};

seedBlogs();