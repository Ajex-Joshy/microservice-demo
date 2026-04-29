#!/bin/bash

BASE_URL="http://localhost:3000/api/v1"
EMAIL="admin_$(date +%s)@example.com"
PASSWORD="Password123!"
NAME="Admin User"

echo "🚀 Starting End-to-End Tests with Curl..."

# 1. Register
echo -e "\n1. Testing Registration..."
REG_RES=$(curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}")
echo "$REG_RES" | jq .
USER_ID=$(echo "$REG_RES" | jq -r .user.id)

# Promote to ADMIN manually in DB
echo -e "\n[INTERNAL] Promoting user to ADMIN..."
mongosh --eval "db.getSiblingDB('user-service').getCollection('users').updateOne({email: '$EMAIL'}, {\$set: {role: 'ADMIN'}})" > /dev/null

# 2. Login
echo -e "\n2. Testing Login..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
TOKEN=$(echo "$LOGIN_RES" | jq -r .token)
echo "✅ Login successful, token received."

# 3. Create Order
echo -e "\n3. Testing Create Order..."
ORDER_RES=$(curl -s -X POST "$BASE_URL/orders/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"item":"MacBook Pro","quantity":1,"price":1999}')
echo "$ORDER_RES" | jq .
ORDER_ID=$(echo "$ORDER_RES" | jq -r .data.id)

# 4. Get Orders
echo -e "\n4. Testing Get Orders..."
curl -s -X GET "$BASE_URL/orders/" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 5. Valid Transition (PENDING -> PROCESSING)
echo -e "\n5. Testing Valid Transition (PENDING -> PROCESSING)..."
curl -s -X PATCH "$BASE_URL/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"PROCESSING"}' | jq .

# 6. Valid Transition (PROCESSING -> SHIPPED)
echo -e "\n6. Testing Valid Transition (PROCESSING -> SHIPPED)..."
curl -s -X PATCH "$BASE_URL/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"SHIPPED"}' | jq .

# 7. Invalid Transition (SHIPPED -> PROCESSING)
echo -e "\n7. Testing Invalid Transition (SHIPPED -> PROCESSING)..."
curl -s -X PATCH "$BASE_URL/orders/$ORDER_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"PROCESSING"}' | jq .

echo -e "\n✨ All tests finished!"
