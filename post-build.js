const fs = require('fs');
const archiver = require('archiver');

function zipFolder(sourceDir, outputPath) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () =>
    console.log(`\n压缩完成，大小：${archive.pointer()}字节\n\n`),
  );
  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(sourceDir, false);
  archive.finalize();
}

zipFolder('./dist/calendar.crx', './dist/calendar.crx.zip');
