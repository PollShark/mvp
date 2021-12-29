const mongoose = require("mongoose");
const surveySchema = mongoose.Schema(
  {
    surveyTitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    question: {
      type: Object,
      questionType: {
        type: String,
      },
      questionTypeText: {
        type: String,
      },
      questionText: {
        type: String,
      },
      option1: {
        type: String,
      },
      option2: {
        type: String,
      },
      option3: {
        type: String,
      },
      option4: {
        type: String,
      },
    },
    surveyExpiryDate: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    submitted_by: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        answer: {
          type: String,
        },
      },
    ],
    amount:{
      type:String,
      default:'0',
    }
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
