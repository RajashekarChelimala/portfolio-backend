import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    headline: {
      type: String,
      required: [true, "Headline is required"],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || v.trim() === "") return true; // Optional image URL
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    likes: { type: Number, default: 0 },
    engagementCount: { type: Number, default: 0 },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Post", postSchema);
