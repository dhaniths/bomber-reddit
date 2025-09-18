export default function handler(req, res){
  const body = req.body || {};
  const {user, score} = body;
  if(!user || typeof score !== 'number') return res.status(400).json({error:'invalid'});
  if(!global.leaderboard) global.leaderboard = [];
  global.leaderboard.push({user, score, ts: Date.now()});
  global.leaderboard = global.leaderboard.sort((a,b)=>b.score-a.score).slice(0,50);
  return res.json({status:'ok'});
}
