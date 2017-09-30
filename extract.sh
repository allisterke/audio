
(echo $1; fanyi $1 | sed -n -r 's/^[[:space:]]+[[:digit:]]+[[:space:]]+(.*)$/\1/p' | uniq) |
while read -r line; do
    if [[ -z $line ]]; then
        continue;
    fi
    line=$(echo -n "$line" | node escape.js)
	echo "$line"
    curl -s http://www.entts.com/post/ -d "content=$line&accent=en&speed=0" |
        grep -P -o '".*?\.mp3"' | tr -d '"'
done
