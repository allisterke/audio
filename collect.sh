echo -n 'let material = "' 
while read -r word; do
    if [[ -z $word ]]; then
        continue;
    fi
    audio=($word $(bash extract.sh $word))
	for((i=2;i<${#audio[*]};i+=2)); do
		wget -r -nH -c "${audio[$i]}"
	done
    echo -n ${audio[*]} | sed 's/http:\/\/www.entts.com\///g' | tr ' ' ','
    echo -n ';'
done 
echo '";'

echo 'let list = material.split(";");' 

