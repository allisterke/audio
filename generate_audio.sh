#!/bin/bash

set -x
#(echo 'agitate'; echo 'disillusion') |
count=${1:-100}
cat ~/.fanyi_history | sort -R | head -n $count |
    bash collect.sh | 
    tee material.js |
    tr ';' '\n' | cat -n

bash fanyi.sh $(cat material.js keywords.js | node) > example.js
