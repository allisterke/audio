#!/bin/bash

#(echo 'agitate'; echo 'disillusion') |
cat ~/.fanyi_history | sort -R | head -n 100 |
    bash collect.sh | 
    tee material.js |
    tr ';' '\n' | cat -n

