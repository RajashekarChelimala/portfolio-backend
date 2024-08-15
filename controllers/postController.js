import Post from '../models/Post.js'; 
import mongoose from 'mongoose';

export const getAllPosts = async (req, res) => {
    const posts = await Post.find();
    if (!posts) return res.status(204).json({ 'message': 'No posts found.' });
    res.json(posts);
}

export const getPost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Post ID required.' });

    const post = await Post.findOne({ _id: req.params.id }).exec();
    if (!post) {
        return res.status(204).json({ "message": `No post matches ID ${req.params.id}.` });
    }
    res.json(post);
}

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const result = await Post.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ error: 'Post not found' });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const handleNewPost = async (req, res) => {
    try {
        // Destructure the request body
        console.log("controller::"+req.body);
        const { headline, content, image } = req.body;

        // Check if all required fields are present
        if (!headline) {
            return res.status(400).json({ error: 'Headline is required' });
        }else if (!content){
            return res.status(400).json({ error: 'Content is required'});
        }

        // Create a new post document
        const newPost = new Post({
            headline,
            content,
            image
        });

        // Save the post to the database
        const savedPost = await newPost.save();

        // Send a response with the created post
        res.status(201).json(savedPost);
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'ID parameter is required.' });
        }
    
        const post = await Post.findOne({ _id: req.body.id }).exec();
        if (!post) {
            return res.status(204).json({ "message": `No post matches ID ${req.body.id}.` });
        }
        if (req.body?.headline) post.headline = req.body.headline;
        if (req.body?.content) post.content = req.body.content;
        if (req.body?.image) post.image = req.body.image;
        const result = await post.save();
        res.json(result);
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: error.message });
    }
};
