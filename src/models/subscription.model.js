import mongoose from "mongoose";

const subscriptionschema = mongoose.Schema(
  {
    suscriber: {
      typeof: mongoose.Types.ObjectId,
      ref: "User",
    },
    channel: {
      typeof: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionschema);
