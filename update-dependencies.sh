#!/bin/bash

# Check if package.json exists
if [ ! -f "package.json" ]; then
  # Create a basic package.json if it doesn't exist
  cat > package.json << 'PACKAGEJSON'
{
  "name": "vetnav",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.25",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
PACKAGEJSON
fi

# Update the package.json with new dependencies
jq '.dependencies += {
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.5.29",
  "tailwindcss": "^3.3.2",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.23",
  "classnames": "^2.3.2",
  "react-icons": "^4.8.0"
}' package.json > package.json.tmp && mv package.json.tmp package.json

echo "Package dependencies updated! To install them, run:"
echo "npm install"
echo ""
echo "Your project now includes:"
echo "- jspdf & jspdf-autotable: PDF generation"
echo "- tailwindcss, autoprefixer & postcss: Styling"
echo "- classnames: Conditional class names"
echo "- react-icons: Icon library"
