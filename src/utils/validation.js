const validator = require('validator');
function validateSignUpData(req,res){
    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName)
    {
        res.status(400).send("First name and last name are required");
    }
    else if(!validator.isEmail(emailId))
    {
            res.status(400).send("Invalid email");
    }
    else if(!validator.isStrongPassword(password))
    {
        res.status(400).send("Password is not strong enough");
    }
}
function vallidateProfileData(req,res){
    const userData=req.body;
    const ALLOWED_UPDATES = [
      //api level validation
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdatesAllowed = Object.keys(userData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    // if (!isUpdatesAllowed) {
    //   throw new Error("updates are not allowed");
    // }
    // if (userData?.skills.length > 10)
    //   throw new Error("skills should be less than 10");
    // else if(!validator.isURL(userData?.photoUrl))
    //   throw new Error("Invalid Photo URL");
    // else if(userData?.about.length > 200)
    //   throw new Error("About section should be less than 200 characters");
    return isUpdatesAllowed;
}
module.exports={
    validateSignUpData,
    vallidateProfileData
};