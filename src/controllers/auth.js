exports.register = (req, res, next) => {
   // request
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;

   // dummy response
   const result = {
      message: "Register Success",
      data: {
         uniq_id: 1,
         name: name,
         email: email,
      },
   };
   res.status(201).json(result);
};
