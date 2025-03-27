import mongoose from 'mongoose';
const { Schema } = mongoose;

const roadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }, // New: From your code
  category: { 
    type: String, 
    enum: ['academic', 'long-term', 'personality', 'additional'], 
    required: true 
  },
  totalDays: { type: Number, required: true }, // Renamed duration to match your format
  startDate: { type: Date, required: true },
  dailyTasks: [{
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    title: { type: String, required: true }, // New: Task title
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
  }],
  chatbotHistory: [{
    request: {
      action: { type: String, required: true },
      data: { type: Object, required: false, default: {} } 
    },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Roadmap', roadmapSchema);