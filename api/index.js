const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb://127.0.0.1:27017/linkedin')
    .then(() => console.log('db conect'))
    .catch((err) => console.log("db conection failed: ", err))

app.listen(port, () => {
    console.log("Server is running on port", port);
})

const User = require('./models/user');
const Post = require('./models/post');



app.post('/register', async (req, res) => {


    try {
        const { name, email,
            password, profileImage } = req.body;

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });
        console.log(existingUser);
        if (existingUser) {
            console.log('Email already registered!');
            return res.status(400).json({
                errCode: 0,
                message: 'Email already registered!'
            })
        }

        const newUser = new User({
            name, email, password, profileImage
        });

        newUser.verificationToken = crypto.randomBytes(20).toString('hex');

        await newUser.save();
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        return res.status(200).json({
            message: 'Register successful. Please check your mail for verification!',
            errCode: 0
        })

    } catch (error) {
        console.log('Error register user', error);
        return res.status(500).json({
            message: 'Error register user',
            errCode: -1
        })
    }
})


const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vietvamvo03@gmail.com',
            pass: 'rjdu nbcv lbch xxxa'
        }
    });

    const mailOptions = {
        from: 'linkedin@gmail.com',
        to: email,
        suject: 'Email Verfication',
        text: `please click the following link to verify your email:  http://localhost:3000/verify/${verificationToken}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.log('Erro sending the verfication email');
    }
}

app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(404).json({ message: 'Invalid verfication token' })
        }
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ message: 'Email verfied successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Email verfication failed' })
    }
})


const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
}
const secretKey = generateSecretKey();

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        const token = jwt.sign({ userId: user._id }, secretKey)

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Login failed' })
    }
})


app.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        res.status(200).json({ user })

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile' })
    }
})

app.get('/users/:userId', async (req, res) => {
    try {
        const loggedInUserId = req.params.userId;

        const loggedInUser = await User.findById(loggedInUserId).populate('connections', '_id')
        if (!loggedInUser) {
            return res.status(400).json({ message: 'User not found' })
        }

        const connectedUserIds = loggedInUser.connections.map(
            (connection) => connection._id
        )

        const users = await User.find({
            _id: { $ne: loggedInUserId, $nin: connectedUserIds }
        });
        res.status(200).json(users)

    } catch (error) {
        console.log('Error retrieving users');
        res.status(500).json({ message: 'Error retrieving users' })
    }
})

app.post('/connection-request', async (req, res) => {
    try {
        const { currentUserId, selectedUserId } = req.body;
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { connectionRequest: currentUserId }
        })
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentConnectionRequest: selectedUserId }

        })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating connection request' })
    }
})

//show all connection resquwst
app.get('/connection-request/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById((userId)).
            populate('connectionRequest', 'name email profileImage').lean();

        const connectionRequest = user.connectionRequest;
        // console.log(connectionRequest);
        res.status(200).json(connectionRequest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server Error' })
    }
})

//accept request

app.post('/connection-request/accept', async (req, res) => {
    try {
        const { senderId, recepientId } = req.body;

        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.connections.push(recepientId);
        recepient.connections.push(senderId)

        recepient.connectionRequest = recepient.connectionRequest
            .filter((request) => request.toString() !== senderId.toString())

        sender.sentConnectionRequest = sender.sentConnectionRequest
            .filter((request) => request.toString() !== recepientId.toString())

        await sender.save();
        await recepient.save();
        res.status(200).json({ message: "Freind request accepted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server Error' })

    }
})


// fetch all the connections

app.get('/connections/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("connections", "name profileImage createdAt").exec();
        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ connections: user.connections });
    } catch (error) {
        console.log('error fetch connections', error);
        res.status(500).json({ message: "Error fetching the connections" })
    }
})


//create a post

app.post('/create', async (req, res) => {
    try {
        const { description, imageUrl, userId } = req.body;
        const newPost = new Post({
            description: description,
            imageUrl: imageUrl,
            user: userId
        })

        await newPost.save();
        res.status(200).json({ message: 'Post create successfully', post: newPost })

    } catch (error) {
        console.log('error creating post', error);
        res.status(500).json({ message: 'Error creating the post' });
    }
})

//get all posts

app.get('/all', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name profileImage');

        res.status(200).json({ posts });
    } catch (error) {
        console.log('error fetching all the posts', error);
        res.status(500).json({ message: 'Error fetching all the posts' })
    }
})

//like

app.post('/like/:postId/:userId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: 'Post not found' });
        }

        //ktra neu ng dung da like post
        const existingLike = post?.likes.find((like) => like.user.toString() === userId);

        if (existingLike) {
            post.likes = post.likes.filter((like) => like.user.toString() !== userId)
        } else {
            post.likes.push({ user: userId })
        }
        await post.save();

        res.status(200).json({ message: 'Post like/unlike successfull', post })


    } catch (error) {
        console.log('error likeing a post', error);
        res.status(500).json({ message: 'Error liking the post' })
    }
})

//update user descrip

app.put('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { userDescription } = req.body;

        await User.findByIdAndUpdate(userId, { userDescription });

        res.status(200).json({ message: 'User profile update successfully' })
    } catch (error) {
        console.log("Error updating user Profile", error);
        res.status(500).json({ message: 'Error updating user profile' })
    }
})

//logout 
app.post('/logout', async (req, res) => {
    try {
        res.clearCookie('authToken'); // Xóa token từ cookie (nếu bạn lưu trữ token trong cookie)
        res.status(200).send('Đã đăng xuất thành công');
    } catch (error) {
        console.log("Error logout");
        res.status(500).json({ message: 'Error logout' })
    }
});