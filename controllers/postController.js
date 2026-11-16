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
    req.io.emit("deletePost", id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleNewPost = async (req, res) => {
  try {
    const { headline, content, image } = req.body;

    if (!headline || !headline.trim()) {
      return res.status(400).json({ error: "Headline is required" });
    } else if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const newPost = new Post({
      headline: headline.trim(),
      content: content.trim(),
      image: image && image.trim() !== "" ? image.trim() : undefined,
    });

    const savedPost = await newPost.save();
    if (req.io) req.io.emit("newPost", savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = req.body?._id || req.body?.id;
    if (!id) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const post = await Post.findById(id).exec();
    if (!post) {
      return res.status(404).json({ message: `No post matches ID ${id}.` });
    }
    if (req.body?.headline !== undefined) post.headline = req.body.headline.trim();
    if (req.body?.content !== undefined) post.content = req.body.content.trim();
    if (req.body?.image !== undefined) {
      post.image = req.body.image && req.body.image.trim() !== "" ? req.body.image.trim() : undefined;
    }
    const result = await post.save();
    if (req.io) req.io.emit("updatePost", result);
    res.json(result);
  } catch (error) {
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
          post.likes = Math.max(0, (post.likes || 1) - 1); // Decrease likes count safely
          await interaction.save(); // Save interaction changes
          await post.save(); // Save post changes
          return res.status(200).json({ message: "Post unliked successfully.", liked: false, likes: post.likes });
        } else {
          // Liking the post for the first time after unliking
          interaction.liked = true; // Mark as liked
          post.likes = (post.likes || 0) + 1; // Increase likes count
          await interaction.save(); // Save interaction changes
          await post.save(); // Save post changes
          return res.status(200).json({ message: "Post liked successfully.", liked: true, likes: post.likes });
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
        post.likes = (post.likes || 0) + 1; // Increase likes count
        post.engagementCount = (post.engagementCount || 0) + 1; // Increment engagement count only for the first like
        await post.save();
        return res.status(200).json({ message: "Post liked successfully.", liked: true, likes: post.likes });
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
