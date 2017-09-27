process.stdin.setEncoding('utf8');

let chunks = [];

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    chunks.push(chunk);
  }
});

process.stdin.on('end', () => {
  //process.stdout.write(escape(chunks.join('')));
  console.log(escape(chunks.join('')));
});
