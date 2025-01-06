#!/bin/bash
npm install

branch_name_string="$(openssl rand -hex 12 | tr -d '[:digit:]' | head -c 16)"

person_name=$1

branch_name="BRANCH-$person_name-$branch_name_string"

git checkout -b $branch_name

git push --set-upstream origin $branch_name

npm start &

server_pid=$!

# Run tests and capture output
output=$(npm run test | grep "Total tests")

results=$(echo "$output")

# Split the output by commas into an array
IFS=',' read -ra values <<< "$results"

# Assign array elements to variables
total_tests=${values[0]}
passed_tests=${values[1]}
failed_tests=${values[2]}
passed_ratio=${values[3]}
failed_ratio=${values[4]}

echo "$total_tests"
echo "$passed_tests"
echo "$failed_tests"
echo "$passed_ratio"
echo "$failed_ratio"

kill -9 "$server_pid"

git add .
git commit -m "Total tests: $total_tests - Passed tests: $passed_tests - Failed tests: $failed_tests - Passed ratio: $passed_ratio - Failed ratio: $failed_ratio"

git push -f

git checkout main

git branch -D $branch_name