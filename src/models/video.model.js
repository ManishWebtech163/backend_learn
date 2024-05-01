import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    videoFile: String,
    duration: Number,
    views: {
      default: 0,
      type: Number,
    },
    owner: {
      type: Schmea.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Video = mongoose.model("Video", videoSchema);
