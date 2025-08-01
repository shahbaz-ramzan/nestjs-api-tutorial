#!/bin/bash

echo "🧪 Testing Auth Endpoints..."
echo ""

echo "📝 Testing signup with new user..."
curl --location --request POST 'http://[::1]:6000/auth/signup' \
--form 'email="newuser@example.com"' \
--form 'password="securepassword123"'

echo ""
echo ""
echo "⚠️  Testing signup with duplicate email (should fail)..."
curl --location --request POST 'http://[::1]:6000/auth/signup' \
--form 'email="newuser@example.com"' \
--form 'password="anotherpassword"'

echo ""
echo ""
echo "🔐 Testing signin..."
curl --location --request POST 'http://[::1]:6000/auth/signin'

echo ""
echo ""
echo "✅ Test completed!"