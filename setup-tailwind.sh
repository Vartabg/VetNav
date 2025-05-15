#!/bin/bash

# Create Tailwind CSS configuration
echo "Creating Tailwind configuration..."
cat > tailwind.config.js << 'TAILWIND'
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
TAILWIND
echo "Tailwind configuration created!"

# Create PostCSS configuration
echo "Creating PostCSS configuration..."
cat > postcss.config.js << 'POSTCSS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS
echo "PostCSS configuration created!"

# Update the CSS file to include Tailwind directives
echo "Updating CSS file with Tailwind directives..."
cat > src/styles/globals.css << 'GLOBALCSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
GLOBALCSS
echo "CSS file updated with Tailwind directives!"
