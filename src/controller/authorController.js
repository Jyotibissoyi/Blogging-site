const authorModel = require("../models/authorModel.js");
const jwt = require("jsonwebtoken");

//<-------------This API used for Create Authors---------------->//
const createAuthor = async function (req, res) {
    try {

        let author = req.body;
        //let email = req.body.email;
        //let password = req.body.password;
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        let {fname,lname,email,password,title} = author;
        //let lname = req.body.lname;
        //fname
        var validatename = function (name) {
            var re = /[a-zA-Z]{3,}/;
            return re.test(name)
        };

        let CheckFname = validatename(fname);
        let Checklname = validatename(lname);
        if (CheckFname == false || Checklname == false) {
            return res.status(400).send({ status: false, msg: "name should be string" })
        }

        if (!author.fname) return res.status(400).send({ msg: " First name is required " });
        if (!author.lname) return res.status(400).send({ msg: " Last name is required " });
        if (!author.email) return res.status(400).send({ msg: " email is required " });
        if (!author.password) return res.status(400).send({ msg: " password is required " });



        let emailId = await authorModel.findOne({ email: email })
        if (emailId !== null) return res.status(400).send({ msg: "Emailid already present" })



        //Email id Validation
        var validateEmail = function (email) {
            var re = /[a-zA-Z_1-90]{3,}@[A-za-z]{3,}[.]{1}[a-zA-Z]{2,}/;
            return re.test(email)
        };

        let Check = validateEmail(email);
        if (Check == false) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        // Password Id Validation
        var validatepassword = function (password) {
            var re = /[A-Za-z1-90]{4,}[@#$%]{1,}/;
            //Minimum 1 Upper add, Minimum 3 Lower Case,Mininum 1 specia; Symbol like (@#$%),mininum 1 number
            return re.test(password)
        };

        let Checkpassword = validatepassword(password);
        if (Checkpassword == false) {
            return res.status(400).send({ status: false, msg: "Password is not valid" })
        }

        let titleEnum = ['Mr', 'Mrs', 'Miss']
        if (!titleEnum.includes(title)) {
            return res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
        }

        let authorCreated = await authorModel.create(author)


        return res.status(201).send({ data: authorCreated })

    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}


//<--------------This API used for Log in Author------------------>// 
const login = async function (req, res) {
    try {
        let {email,password,author }= req.body
        //let password = req.body.password;
        //let author = req.body;

        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }
        if (email.trim().length == 0 || password.trim().length == 0) {
            return res.status(400).send({ status: false, msg: "please provide login details" });
        }

        if (!email) return res.status(400).send({ msg: " email is required " })
        if (!password) return res.status(400).send({ msg: "  password is required " })


        let loggedAuthor = await authorModel.findOne({ email: email, password: password })
        if (!loggedAuthor) return res.status(400).send({ msg: "Email or Password is Incorrect!" })

        let token = jwt.sign(
            {
                authorId: loggedAuthor._id.toString(),
                batch: "lithium",
                project: "Blog-Project"
            },
            "Secret-Key-lithium", { expiresIn: '12h' }
        )

        return res.status(201).send({ msg: "User logged in successfully!", loggedAuthor, token })
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}





module.exports.createAuthor = createAuthor;
module.exports.login = login
