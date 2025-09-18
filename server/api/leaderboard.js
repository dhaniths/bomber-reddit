export default function handler(req, res){
  if(!global.leaderboard) global.leaderboard = [];
  return res.json({leaderboard: global.leaderboard});
}
