const validator = require('validator');
function validateSignUpData(req){
    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName)
    {
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(emailId))
    {
            throw new Error("Invalid email");
    }
    else if(!validator.isStrongPassword(password))
    {
        throw new Error("Password is not strong enough");
    }
}
function vallidateProfileData(req){
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