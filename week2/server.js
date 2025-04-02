import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
app.use(express.json());

const USERS_FILE = 'users.json';

// __dirname을 사용할 수 없으므로 직접 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET / - 정적 HTML 파일 반환
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'week2.html'));
});

// POST /api/signup - 사용자 정보 저장
app.post('/api/signup', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: '이미 존재하는 사용자입니다.' });
  }

  users.push({ username, password, email });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.status(201).json({ message: '회원가입 성공' });
});

// POST /api/login - 로그인 처리
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!fs.existsSync(USERS_FILE)) {
    return res.status(401).json({ message: '유저 데이터 없음' });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({ message: '로그인 성공' });
  } else {
    res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
  }
});

// GET /api/users - 사용자 목록 조회 (비밀번호 제외)
app.get('/api/users', (req, res) => {
  if (!fs.existsSync(USERS_FILE)) {
    return res.json([]);
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')).map(({ username, email }) => ({ username, email }));

  res.json(users);
});

// GET /api/os - OS 정보 반환
app.get('/api/os', (req, res) => {
  res.json({
    type: os.type(),
    hostname: os.hostname(),
    cpu_num: os.cpus().length,
    total_mem: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
  });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
