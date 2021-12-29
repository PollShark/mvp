var express = require("express");
const {
    createSurvey,
    getSurveys,
    getTakeSurveys,
    takeSurvey,
    submitSurvey,
} = require("../controllers/surveyController");
const auth = require('../middlewares/auth');
var router = express.Router();


router.post('/surveys',auth,createSurvey)
router.get('/surveys',auth,getSurveys)
router.get('/take_survey/:id',auth,takeSurvey)
router.get('/take_surveys',auth,getTakeSurveys)
router.post('/submit_survey',auth,submitSurvey)

module.exports = router;

