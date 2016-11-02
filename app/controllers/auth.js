module.exports = function (db, utils) {
  return {
    authOK: function (req, res) {
      /*console.log("Estoy en el Auth OK");
      console.log(req.body);
      console.log("User: ", process.env.USER_ID);
      console.log("Pass: ", process.env.USER_KEY)
      */
      if(req.body.username == process.env.USER_ID){
        console.log("Paso el usr");
        if(req.body.password == process.env.USER_KEY){
          console.log("Paso la pass");
          res.status(200).json({success: "Usuario Autorizado"});
        }else{
          res.status(401).json({error: "Password Incorrecta"});
        }
      }else{
        res.status(401).json({error: "Usuario Incorrecta"});
      }
    }
  }
}
