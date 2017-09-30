#!/bin/bash

tar cJf audio-$(date +%F-%T | tr ':' '-').txz index.html material.js iterate.js example.js style.css
