
while read -r line; do
    if [[ -z $line ]]; then
        continue;
    fi
    echo $line
    curl -s http://www.entts.com/post/ -d "content=$line&accent=en&speed=0" |
        grep -P -o '".*?\.mp3"' | tr -d '"'
done < <(
node <<EOF
try {
let result=$(curl -s "http://www.iciba.com/index.php?a=getWordMean&c=search&list=1%2C2%2C3%2C4%2C5%2C8%2C9%2C10%2C12%2C13%2C14%2C15%2C18%2C21%2C22%2C24%2C3003%2C3004%2C3005&word=$1");

let ex = [result.baesInfo.word_name]; 
if(result.collins && result.collins[0]) {
    let entry = result.collins[0].entry;
    for(let i = 0; i < entry.length; ++ i) {
        for(let j = 0; j < entry[i].example.length; ++ j) {
            ex.push(entry[i].example[j].ex);
        }
    }
}

if(ex.length == 1 && result.sentence) {
    let sentence = result.sentence;
    for(let i = 0; i < sentence.length; ++ i) {
        ex.push(sentence[i].Network_en);
    }
}

for(let i = 0; i < ex.length; ++ i) {
    console.log(escape(ex[i]));
}
} catch(e) {}
EOF
)
