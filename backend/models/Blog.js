import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Health Tips",
        "Disease Information",
        "Nutrition",
        "Mental Health",
        "Fitness",
        "Wellness",
      ],
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: "Healthcare Team",
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);