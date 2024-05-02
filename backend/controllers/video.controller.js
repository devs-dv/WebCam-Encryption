const Media = require('../models/video.model')

exports.postVideo = async (req, res) => {
  try {
    const { video } = req.body;
    const newMedia = new Media({ video });
    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};


exports.postPicture = async (req, res) => {
  try {
    const { picture } = req.body;
    const newMedia = new Media({ picture });
    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};
