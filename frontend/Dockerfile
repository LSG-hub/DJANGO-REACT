# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to handle React compatibility
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Create .env file for frontend
RUN echo "VITE_API_URL=http://localhost:8000" > .env

# Expose port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]