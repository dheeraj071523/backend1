const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

// this is wrong thing
// const asyncHandler = (fn) = async (req,res,next)
// .then(await fn(req,res,next))
// .catch((error) => {
//    res.status(error.code || 500).json({
//     success: false,
//     message: error.message,
//    })
// })

export { asyncHandler };

// this is right thing
// const asyncHandler = (fn) = async (req,res,next) =>{
//   try{
//     await fn(req,res,next)

//   }catch(error){
//     res.status(error.code || 500).json({
//         success: false,
//         message: error.message,
//     })
//   }
// }
