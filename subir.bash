#!/bin/bash 

npm test 

if [[ $? -eq 0 ]]; then
	git push
fi
