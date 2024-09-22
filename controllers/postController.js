import Post from "../models/Post.js";
import mongoose from "mongoose";
import Interaction from "../models/Interaction.js";

export const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  if (!posts) return res.status(204).json({ message: "No posts found." });
  res.json(posts);
};

export const getPost = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Post ID required." });

  const post = await Post.findOne({ _id: req.params.id }).exec();
  if (!post) {
    return res
      .status(204)
      .json({ message: `No post matches ID ${req.params.id}.` });
  }
  res.json(post);
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await Post.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleNewPost = async (req, res) => {
  try {
    // Destructure the request body
    console.log("controller::" + req.body);
    const { headline, content, image } = req.body;

    // Check if all required fields are present
    if (!headline) {
      return res.status(400).json({ error: "Headline is required" });
    } else if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Create a new post document
    const newPost = new Post({
      headline,
      content,
      image,
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
    if (!req?.body?._id) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const post = await Post.findOne({ _id: req.body._id }).exec();
    if (!post) {
      return res
        .status(204)
        .json({ message: `No post matches ID ${req.body._id}.` });
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

// Like a post
export const likePost = async (req, res) => {
    const { id } = req.params;
    const { visitorId } = req.body;
    const ipAddress = req.headers["x-forwarded-for"] || req.ip; // Get IP address
  
    try {
      // Find the post
      const post = await Post.findOne({ _id: id }).exec();
      if (!post) {
        return res.status(204).json({ message: `No post matches ID ${id}.` });
      }
  
      // Check if interaction already exists
      let interaction = await Interaction.findOne({ postId: id, visitorId });
  
      if (interaction) {
        // If the post was previously liked
        if (interaction.liked) {
          // Unliking the post
          interaction.liked = false; // Mark as unliked
          post.likes -= 1; // Decrease likes count
          await interaction.save(); // Save interaction changes
          await post.save(); // Save post changes
          return res.status(201).json({ message: "Post unliked successfully." });
        } else {
          // Liking the post for the first time after unliking
          interaction.liked = true; // Mark as liked
          post.likes += 1; // Increase likes count
          await interaction.save(); // Save interaction changes
          await post.save(); // Save post changes
          return res.status(201).json({ message: "Post liked successfully." });
        }
      } else {
        // Creating a new interaction for liking
        interaction = new Interaction({
          postId: id,
          visitorId,
          liked: true,
          engaged: true,
          ipAddress,
        });
        await interaction.save();
        post.likes += 1; // Increase likes count
        post.engagementCount += 1; // Increment engagement count only for the first like
        await post.save();
        return res.status(201).json({ message: "Post liked successfully." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  
  
    

// Engage with a post
export const engagePost = async (req, res) => {
  const { id } = req.params;
  const { visitorId } = req.body;
  const ipAddress = req.headers["x-forwarded-for"] || req.ip;

  try {
    // Check if interaction already exists
    let interaction = await Interaction.findOne({ postId: id, visitorId });

    if (!interaction) {
      // Create a new interaction for engagement
      interaction = new Interaction({
        postId: id,
        visitorId,
        engaged: true,
        ipAddress,
      });

      await interaction.save();

      const post = await Post.findOne({ _id: id }).exec();
      if (!post) {
        return res
          .status(204)
          .json({ message: `No post matches ID ${req.body._id}.` });
      }
      post.engagementCount = post.engagementCount + 1;
      await post.save();
    }
    return res.status(201).json({ message: "Post engaged successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get interactions for a post
export const getPostInteractions = async (req, res) => {
  const { id } = req.params;

  try {
    const interactions = await Post.find({ postId: id });
    res.json(interactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
