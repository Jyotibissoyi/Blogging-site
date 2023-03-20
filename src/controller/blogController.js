`   const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require('mongoose');

//<--------------------This API used for Create Blogs-------------->
const createBlog = async (req, res) => {

    try {
        let Blog = req.body

        if (Object.keys(Blog).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        if (!Blog.title) return res.status(400).send({ msg: " title is required " }) 
        if (!Blog.body) return res.status(400).send({ msg: "body is required " })
        if (!Blog.authorId) return res.status(400).send({ msg: " authorId is required " })
        if (!Blog.category) return res.status(400).send({ msg: " category is require" })

 
        let authorCreated = await blogModel.create(Blog)
 

        return res.status(201).send({ data: authorCreated })

       
    } catch (error) {
       return res.status(500).send({ msg: error.message })
    }
}

//<----------------This API used for Fetch Blogs of Logged in Author----------->//
const getBlogsData = async (req, res) => {
    try {
        let id = req.query.authorId;//
        if (!id) return res.status(400).send({ status: false, msg: "id is required" })

        let isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })

        let data = await blogModel.find({ authorId: id, isDeleted: false, isPublished:true })
        
        if (data.length == 0) {
            return res.status(404).send({ status: false, msg: "No data Found" });
        }
       return res.status(200).send({ msg: data })

    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

//<----------------This API used for Update Blogs of Logged in Author---------->//
const updateBlog = async function (req, res) {
    try {
        let inputId = req.params.blogId
    
        if (!inputId) return res.status(400).send({ status: false, msg: "blog id required" })
        let isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })

        let author = req.body
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let isDeleted=req.body.isDeleted
        let isPublished=req.body.isPublished
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        let date = Date.now()


        let data = await blogModel.findOne({ _id: inputId })

        if (!(data.authorId == req.body.authorId)) {
            return res.status(400).send({ msg: "you are not real user" })

        }

        let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(400).send({ msg: "Blog already deleted" })

        let blogs = await blogModel.findOneAndUpdate({ _id: inputId },
            {
                $set: { title: title, body: body,isDeleted:isDeleted,isPublished:isPublished, isPublished: true, publishedAt: date },
                $push: { tags: tags, subcategory: subcategory }
            },
            { new: true })


        if (!blogs) return res.status(404).send({ msg: "no blog found" })
        return res.status(200).send({ msg: blogs })
    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

//<----------------These APIs used for Deleting Blogs--------->//
const deleteBlog = async function (req, res) {
    try {

        let inputId = req.params.blogId

        let isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ msg: "enter valid objectID" })

        let date = Date.now()

        let data1 = await blogModel.findOne({ _id: inputId })

        if (!(data1.authorId == req.body.authorId)) {
            return res.status(400).send({ msg: "you are not real user" })

        }

        let alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(400).send({ msg: "Blog already deleted" })

        let data = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { isDeleted: true, deletedAt: date } },
            { new: true })

        if (!data) return res.status(404).send({ msg: "no data found" })

      return  res.status(200).send({ status: true, msg: data })

    }
    catch (error) {
       return res.status(500).send({ msg: error.message })
    }
}

//<----------------These APIs used for Deleting Blogs by query of Logged in Author--------->//
const deleteBlogQuery = async (req, res) => {
    try {

        const queryParams = req.query;  //category, authorid, tag name, subcategory name
        if (Object.keys(queryParams).length == 0)
            return res.status(400).send({ status: false, msg: "Please enter some data in the body" });



        const blog = await blogModel.find({ $and: [queryParams, { isDeleted: true }, { isPublished: false }] });


        if (Object.keys(blog).length !== 0)
            return res.status(404).send({ msg: "Document is already Deleted " })

        const updatedBlog = await blogModel.updateMany(queryParams,
            { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } },
            { new: true });
        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogsData = getBlogsData
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogQuery = deleteBlogQuery;








