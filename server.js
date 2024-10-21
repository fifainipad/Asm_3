require('dotenv').config(); // Import dotenv
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000; // Lấy PORT từ .env hoặc dùng 4000 mặc định

// Kết nối với MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Middleware
app.use(bodyParser.json());

// Khởi tạo Schema và Model cho sinh viên
const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentCode: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
});

const Student = mongoose.model('Student', studentSchema);

// API Endpoint R1: Trả về thông tin cá nhân
app.get('/info', (req, res) => {
  res.json({
    data: { fullName: 'Nguyen Van A', studentCode: 'QNUO1234' },
  });
});

// POST: Tạo sinh viên mới
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET: Lấy tất cả sinh viên
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET: Lấy sinh viên theo ID
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// PUT: Cập nhật thông tin sinh viên
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE: Xóa sinh viên
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Khởi chạy server
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
