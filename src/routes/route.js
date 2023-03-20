const express = require('express');
const router = express.Router();
const authorMiddleware = require("../middleware/authorMiddleware.js");
const authorController = require("../controller/authorController.js");
const blogController = require("../controller/blogController.js");

//<-------------This API used for Create Author---------------->//
router.post("/authors",authorController.createAuthor);
//<--------------This API used for Log in Author------------------>// 
router.post("/login",authorController.login);
//<--------------------This API used for Create Blogs-------------->//
router.post("/blogs",authorMiddleware.authenticate,blogController.createBlog);
//<----------------This API used for Fetch Blogs of Logged in Author----------->//
router.get("/blogs",authorMiddleware.authenticate,blogController.getBlogsData);
//<----------------This API used for Update Blogs of Logged in Author---------->//
router.put("/blogs/:blogId",authorMiddleware.authenticate,authorMiddleware.authorize,blogController.updateBlog);
//<----------------These APIs used for Deleting Blogs--------->//
router.delete("/blogs/:blogId",authorMiddleware.authenticate,authorMiddleware.authorize,blogController.deleteBlog);
//<----------------These APIs used for Deleting Blogs by query of Logged in Author--------->//
router.delete("/blogs",authorMiddleware.authenticate,authorMiddleware.authorize,blogController.deleteBlogQuery);


module.exports=router;