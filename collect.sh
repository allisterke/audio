echo -n 'let material = "' 
while read -r word; do
    if [[ -z $word ]]; then
        continue;
    fi
    audio=($word $(bash extract.sh $word))
    echo -n ${audio[*]} | tr ' ' ','
    echo -n ';'
done 
echo '";'

echo 'let list = material.split(";");' 

