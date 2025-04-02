const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
// const FILE_PATH = path.join(__dirname, 'week1.html');
const FILE_PATH = path.join(__dirname, 'week1.html');
const HOSTNAME = 'localhost';
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }

      // OS 정보 가져오기
      const osInfo = {
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
      };

      // HTML의 {{type}}, {{platform}} 같은 부분을 실제 OS 값으로 치환
      let modifiedHtml = data
        .replace('{{type}}', osInfo.type)
        .replace('{{hostname}}', osInfo.platform)
        .replace('{{cpu_num}}', osInfo.arch)
        .replace('{{total_mem}}', osInfo.release);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(modifiedHtml);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
  console.log(`OS Type: ${os.type()}`);
  console.log(`OS Platform: ${os.platform()}`);
  console.log(`OS Architecture: ${os.arch()}`);
  console.log(`OS Release: ${os.release()}`);
});
