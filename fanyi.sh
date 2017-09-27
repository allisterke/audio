
echo 'let fanyi = {};'

while [[ $# -ne 0 ]]; do
    data=$(fanyi $1 | node fanyi.js)
    echo "fanyi['$1'] = '$data';"
    shift
done
