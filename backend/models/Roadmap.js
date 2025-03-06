import mongoose from 'mongoose';
const { Schema } = mongoose;

const roadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  goal: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['academic', 'long-term', 'personality', 'additional'], 
    required: true 
  },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  dailyTasks: [{
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
  }],
  chatbotHistory: [{
    request: { type: String, required: true },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Roadmap', roadmapSchema);