require("dotenv").config()

const express = require('express');
const cors = require('cors');
const htaccess = require('express-htaccess-middleware');

const app = express()
app.use(cors());


app.use(htaccess({
    file: __dirname + '/.htaccess'
  }));


require('./models/index')
const {isAuthorize} = require('./middleware/auth')

app.use(express.json());

app.use(express.static('public'))

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'./public/image'))

    },


    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)

    }
})

const filefilter = (req,file,cb)=>{
    (file.mimetype == 'image/jpeg'  ||file.mimetype == 'image/png'  )?
    cb(null,true):cb(null,false)
}
    
 const upload = multer({storage :storage,
    filefilter:filefilter})




 var userContoller = require('./controller/userController')
 var admin_controller = require('./controller/adminController')
 var game_controller = require('./controller/gameController')




app.post('/addUsers', userContoller.addUser)
app.get('/mail-verification', userContoller.verifyEmail)

app.put('/updateUser',isAuthorize, userContoller.updateUser)
app.put('/logoutUser',isAuthorize, userContoller.logoutUser)
app.get('/loginUser', userContoller.loginUser)
app.post('/uploadProfileImage',isAuthorize,upload.single('image'), userContoller.uploadProfileImage)
app.put('/changePassword',isAuthorize, userContoller.changePassword)
app.post('/kycComplete', isAuthorize, upload.fields([{ name: 'adhar_card_front', maxCount: 1 }, { name: 'adhar_card_back', maxCount: 1 }, { name: 'pan_card_front', maxCount: 1 }, { name: 'pan_card_back', maxCount: 1 }, { name: 'selfie', maxCount: 1 }]), userContoller.kycComplete);
app.put('/updateKYC/:kycId', isAuthorize, upload.fields([{ name: 'adhar_card_front', maxCount: 1 }, { name: 'adhar_card_back', maxCount: 1 }, { name: 'pan_card_front', maxCount: 1 }, { name: 'pan_card_back', maxCount: 1 }, { name: 'selfie', maxCount: 1 }]), userContoller.updateKYC);
app.get('/getSports', userContoller.getSports)
app.get('/getSportsByID/:sportId', userContoller.getSportsByID)
app.get('/getSportsByID/:sportId', userContoller.getSportsByID)
app.get('/getMatchBysportsID/:sportId', isAuthorize, userContoller.getMatchBysportsID)
app.get('/getContestName/:matchId', userContoller.getContestName)
app.get('/getContestName/:matchId', userContoller.getContestName)
app.get('/getContestNamebyiD/:contest_id', userContoller.getContestNamebyiD)

app.get('/getContestInformationFromcontentName/:contestName', userContoller.getContestInformationFromcontentName)
app.get('/getContest/:contestDetailId', userContoller.getContestinformation)

app.post('/postWallet',isAuthorize, userContoller.postWallet)
app.get('/getWallet',isAuthorize, userContoller.getWallet)
app.get('/getContestPrizes/:contestDetailId', userContoller.getContestPrizes)
app.post('/checkEntryAndBalance/:contestId',isAuthorize, userContoller.checkEntryAndBalance)
app.post('/createTeamByUsers/:contestDetailId',isAuthorize, userContoller.createTeamByUsers)
app.get('/getTeamById/:UserTeam_id',isAuthorize, userContoller.getTeamById)
app.patch('/updateTeamById/:UserTeam_id',isAuthorize, userContoller.updateTeamById)
app.post('/send-otp',userContoller. sendOTP);
app.get('/check-otp/:id',userContoller. verifyOTP);






















//admin router
app.post('/KYCStatus', admin_controller.KYCStatus)
app.put('/KYCStatusChange', admin_controller.UpdateKYCStatus)
app.post('/addSports',upload.single('sportIcon'), admin_controller.addSports)
app.get('/getSports', admin_controller.getSports)
app.get('/getSportsByID/:sportId', admin_controller.getSportsByID)
app.patch('/updateSports/:sportId', upload.single('sportIcon'),admin_controller.updateSports)
app.delete('/deleteSports/:sportId', admin_controller.deleteSports)
app.get('/saveupcomingMatches', admin_controller.fetchAndSaveupcomingMatches)
app.post('/postContestName/:matchId', admin_controller.postContestName)
app.patch('/updateContestName/:contest_id', admin_controller.updateContestName)
app.delete('/deleteContestName/:contest_id', admin_controller.deleteContestName)
app.get('/getContestName/:matchId', admin_controller.getContestName)
app.get('/getContestNamebyiD/:contest_id', admin_controller.getContestNamebyiD)
app.post('/createContest/:contest_id', admin_controller.createContestinformation)
app.get('/getContest/:contestDetailId', admin_controller.getContestinformation)
app.get('/getContestInformationFromcontentName/:contestName', admin_controller.getContestInformationFromcontentName)
app.patch('/updateContestinformation/:contestDetailId', admin_controller.updateContestinformation)
app.delete('/deleteContestinformation/:contestDetailId', admin_controller.deleteContestinformation)
app.post('/postDistributionRule', admin_controller.postDistributionRule)
app.patch('/updateDistributionRule/:distributionRuleId', admin_controller.updateDistributionRule)
app.delete('/deleteDistributionRule/:distributionRuleId', admin_controller.deleteDistributionRule)
app.get('/getDistributionRule/:contestDetailId', admin_controller.getDistributionRule)
app.get('/getPlayer/:matchID', game_controller.postPlayer)
app.get('/getAllPlayersByRole/:matchID', game_controller.getAllPlayersByRole)



app.get('/', (req, res) => {
    res.send(' hello world')
})


    const port = 6000
app.listen(port, () => {
    console.log('app will running on port 6000 ');
})
