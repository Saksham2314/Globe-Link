import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

export const createChat = async (req, res) => {
  try {
    const { participantId, journeyId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ message: 'Please provide participant ID' });
    }
    
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] }
    });
    
    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, participantId],
        journey: journeyId || null,
        messages: []
      });
    }
    
    res.status(201).json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
      .populate('participants', 'name profileImage')
      .populate('journey', 'title startLocation endLocation')
      .populate({
        path: 'messages',
        options: { limit: 1, sort: { createdAt: -1 } },
        populate: { path: 'sender', select: 'name' }
      })
      .sort('-updatedAt');
    
    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name profileImage email')
      .populate('journey', 'title startLocation endLocation')
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: 'name profileImage' }
      });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (!chat.participants.find(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }
    
    // Mark messages as read
    await Message.updateMany(
      { chat: req.params.id, sender: { $ne: req.user.id }, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Please provide message content' });
    }
    
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to send message in this chat' });
    }
    
    const message = await Message.create({
      chat: req.params.id,
      sender: req.user.id,
      content
    });
    
    chat.messages.push(message._id);
    chat.updatedAt = Date.now();
    await chat.save();
    
    const populatedMessage = await message.populate('sender', 'name profileImage');
    
    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
