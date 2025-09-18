/* Local server for testing only */
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
let leaderboard = [];
app.post('/api/score',(req,res)=>{
  const {user, score} = req.body || {};
  if(!user || typeof score !== 'number') return res.status(400).json({error:'invalid'});
  leaderboard.push({user, score, ts: Date.now()});
  leaderboard = leaderboard.sort((a,b)=>b.score-b.score?b.score-a.score:0).slice(0,50);
  res.json({status:'ok'});
});
app.get('/api/leaderboard',(req,res)=> res.json({leaderboard}));
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server listening',port));
