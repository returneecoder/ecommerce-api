const User = require("../models/Users");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {createTokenUser,attachCookiesToResponse,checkPermissions} = require('../utils')

const getAllUsers = async (req, res) => {
  //console.log(req.user)
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};



/* single user */

const getSingleUser = async (req, res) => {
  console.log("in get single user");
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError(`No user found with the id of ${req.params.id}`, 404);
  }
  checkPermissions(req.user,user._id)
  res.status(StatusCodes.OK).json({ user });
};

/* show current user */
const showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};


/*  update user */

const updateUser = async (req, res) => {
  const {email,name} = req.body
  if(!email || !name){
    throw new CustomError.BadRequestError('Please Provide all values')
  }
  const user = await User.findOneAndUpdate({_id:req.user.userId},{email,name},
    {new:true,runValidators:true})
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
};

/* update password */ 

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("passwords cannot be empty");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  user.password = newPassword
  await user.save();
  res.status(StatusCodes.OK).json({msg:"Success ! Password Updated"})
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
