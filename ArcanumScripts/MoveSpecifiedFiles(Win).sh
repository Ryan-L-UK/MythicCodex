#!/bin/bash

input="DataOutputs/FileRelocationList.txt"
# Skip the first line of the input file
tail -n +2 "$input" |
# Skip the last line of the input file
head -n -1 |
while IFS= read -r line
do
  # Remove the first four characters and all occurrences of double quotes and commas from the line variable
  line=$(echo "${line}" | tr -d ',"')

  echo "-----------------------"
  echo "Moving: $line"
  mv "../Sources/Creatures/$line" "./DataOutputs/CreatureTag2/"
  echo "-----------------------"
done
