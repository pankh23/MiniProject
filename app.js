const express=require('express')
const app=express()
const userModel=require('./models/user')
const postModel=require('./models/post')
const CookieParser = require('cookie-parser')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/miniproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(CookieParser())


app.get('/', (req, res)=>{

    res.render('index')
})

app.get('/login', (req, res)=>{

    res.render('login')
})

app.post('/post', isLoggedIn, async (req, res)=>{

    let user=await userModel.findOne({email: req.user.email})

    let {content}=req.body

    let post=await postModel.create({
        user: user._id,
        content: content
    })

    user.posts.push(post._id)
    await user.save()
    res.redirect('/profile')
})

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email})
            .populate({
                path: 'posts',
                options: { sort: { 'createdAt': -1 } } // Sort posts by newest first
            });
        
        if (!user) {
            return res.redirect('/login');
        }

        res.render('profile', {user});
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findById(req.params.id);
        
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Get the current user's ID from the database
        const currentUser = await userModel.findOne({ email: req.user.email });
        if (!currentUser) {
            return res.status(404).send("User not found");
        }

        const userIdStr = currentUser._id.toString();
        const likeIndex = post.likes.findIndex(id => id.toString() === userIdStr);
        
        if (likeIndex === -1) {
            // Add like
            post.likes.push(currentUser._id);
        } else {
            // Remove like
            post.likes.splice(likeIndex, 1);
        }
        
        await post.save();
        res.redirect("/profile");
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    
    let post = await postModel.findOne({_id: req.params.id}).populate('user'); 

    res.render('edit', {post})
        
});

app.post('/update/:id', isLoggedIn, async (req, res) => {
    
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content})
    res.redirect('/profile')
        
});

app.post('/register', async (req, res)=>{

    let{email, name, username, password, age}=req.body
    
    let user=await userModel.findOne({email})

    if(user) return res.status(500).send("User already exists")

    
    bcrypt.genSalt(10, (err, salt)=>{
        
        bcrypt.hash(password, salt, async (err, hash)=>{

            let user=await userModel.create({
                username,
                email, 
                age,
                name,
                password: hash
            })

            let token=jwt.sign({email: email, userid: user._id}, 'pankh')
            res.cookie('token', token)
            res.send("registered")
        })
        
    })
})

app.post('/login', async (req, res)=>{

    let{email, password}=req.body
    
    let user=await userModel.findOne({email})

    if(!user) return res.status(500).send("Something went wrong")

    
    bcrypt.compare(password, user.password, function(err, result){

        if(result) {
            
            let token=jwt.sign({email: email, userid: user._id}, 'pankh')
            res.cookie('token', token)
            return res.redirect('/profile')
            
        }
        else {res.redirect('/login')}
    })
})

app.get('/logout', (req, res)=>{

    res.cookie('token', '')
    res.redirect('/login')
})

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) { 
        return res.redirect('/login');
    }

    try {
        let data = jwt.verify(token, "pankh");
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).send("Invalid token, please log in again");
    }
}

app.listen(3000)