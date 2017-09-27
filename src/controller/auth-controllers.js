
exports.login = function(req, res){
    var successLogin = req.query.re;
    res.redirect(successLogin);
}

exports.logout = function(req,res){
    req.logout();
    res.redirect('http://localhost:4000');
}

exports.userInfo = function(req,res){
    var user = req.user;
    res.status(200).send(user);
}