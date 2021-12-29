const expressAsyncHandler = require("express-async-handler");
const { findById, updateOne, findByIdAndUpdate } = require("../models/survey");
const Survey = require("../models/survey");
const createSurvey = expressAsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { questionText, questionType } = req.body.question;
  try {
    let newSurvey = {
      surveyTitle: req.body.surveyTitle,
      description: req.body.description,
      question: {
        questionType,
        questionText,
      },
      amount:req.body.amount,
      surveyExpiryDate: req.body.surveyExpiryDate,
      owner: req.user._id,
    };
    if (req.body.question.questionType == 1) {
      newSurvey = {
        ...newSurvey,
        question: {
          ...newSurvey.question,
          questionTypeText: "MCQ",
          option1: req.body.question.option1,
          option2: req.body.question.option2,
          option3: req.body.question.option3,
          option4: req.body.question.option4,
        },
      };
    } else {
      newSurvey = {
        ...newSurvey,
        question: {
          ...newSurvey.question,
          questionTypeText: questionType == 2 ? "True/False" : "Short Answer",
        },
      };
    }
    const survey = new Survey(newSurvey);
    await survey.save();
    res.send({
      message: `You have succesfully created ${req.body.surveyTitle}`,
      survey,
    });
  } catch (error) {
    console.log("error: ", error);
    res.send({
      message: "something went wrong",
    });
  }
});
const getSurveys = expressAsyncHandler(async (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>>>');
  try {
    await req.user
      .populate({
        path: "surveys",
        // match,
        options: {
          // limit: parseInt(req.query.limit),
          // skip: parseInt(req.query.skip),
          // sort,
        },
      })
      // .execPopulate();
      console.log('req.user.surveys: ', req.user.surveys);
    return res.send({
      surveys:req.user.surveys,
    });
  } catch (e) {
    console.log('e: ', e);
    return res.status(500).send(e);
  }
});
const getTakeSurveys = expressAsyncHandler(async (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>>>');
  try {
    let surveys = await Survey.find({ owner: { $ne: req.user._id } })
      .populate("owner")
      .select(["-submitted_by"]);
    // console.log('surveys: ', surveys);
      console.log('req.user.surveys: ', req.user.surveys);
    return res.send({
      surveys,
    });
  } catch (e) {
    console.log('e: ', e);
    return res.status(500).send(e);
  }
});
const submitSurvey = expressAsyncHandler(async (req, res, next) => {
  try {
    const { survey_id, answer} = req.body
    console.log('answer: ==================>>>>>>>>>>>>>>>', answer);
    const updatedSurvey = await Survey.findByIdAndUpdate(
      survey_id,
      { $push: { submitted_by: { user: req.user.id, answer:answer } } },
      { safe: true, upsert: true }
      );
      console.log('updatedSurvey: ', updatedSurvey);
    return res.status(200).send();
  } catch (e) {
    console.log('e: ', e);
    return res.status(500).send(e);
  }
});
const takeSurvey = expressAsyncHandler(async (req, res, next) => {
  console.log('req: ', req.params.id);
  console.log('>>>>>>>>>>>>>>>>>>');
  try {
    let survey = await Survey.findById(req.params.id).select(['-submitted_by']);
    let isAlreadyTaken = await Survey.find({ "submitted_by": { 
      $elemMatch: { user: req.user._id } 
    } , _id:req.params.id})
    console.log('isAlreadyTaken: ', isAlreadyTaken);
    let answer='';
    if (
      isAlreadyTaken &&
      Array.isArray(isAlreadyTaken) &&
      isAlreadyTaken.length > 0 
    ) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      answer = isAlreadyTaken[0].submitted_by[0].answer;
      console.log('isAlreadyTaken[0].submitted_by[0]: ', isAlreadyTaken[0].submitted_by[0]);
      console.log('answer: ', answer);
    }
    if(survey){
      let surveyJson;
      if(survey.question.questionType==1){
        //MCQ
        surveyJson = {
          elements: [{
            name:'question1',
            type: "radiogroup",
            title: survey.question.questionText,
            isRequired: true,
            choices:[
              survey.question.option1,
              survey.question.option2,
              survey.question.option3,
              survey.question.option4,
            ]
          }]
        };
      }else if(survey.question.questionType==2){
        surveyJson = {
          elements: [{
            name:'question1',
            title: survey.question.questionText,
            type: "radiogroup",
            isRequired: true,
            choices:[
              'Yes',
              'No'
            ],
          }]
        };
      }else{
        surveyJson = {
          elements: [{
            name:'question1',
            title: survey.question.questionText,
            type: "text"
          }]
        };
      }
      return res.send({
        isAlreadyTaken: isAlreadyTaken.length>0,
        answer,
        survey,
        surveyJson
      })
    }else{
      return res.status(404).send({
        message:'Survey not found'
      })
    }
  } catch (e) {
    console.log('e: ', e);
    return res.status(500).send(e);
  }
});
module.exports = {
  createSurvey,
  getSurveys,
  getTakeSurveys,
  takeSurvey,
  submitSurvey
};
