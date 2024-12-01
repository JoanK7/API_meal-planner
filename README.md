**Recipe Finder**

Recipe Finder is a web application that allows users to search for recipes by ingredients or recipe names. The application retrieves recipe data from the Spoonacular API and presents it in an easy-to-understand format, complete with recipe titles, images, and links to full instructions.

**Features**

Search for recipes by name or ingredients.
- Displays a list of matching recipes with images and links to instructions.
- User-friendly interface with clear input fields and organized results.
- Error handling for invalid input or API downtime.
- Part 1: Local Implementation
- Technologies Used
- HTML: For structuring the application.
- CSS: For styling the application interface.
- JavaScript: For handling user interactions and API requests.
- Spoonacular API: Used for fetching recipe data.

**How to Run Locally**

**Clone the Repository:**
git clone https://github.com/yourusername/API_meal-planner.git

cd API_meal-planner

**Setup API Key:**
Obtain an API key from Spoonacular.
Replace the placeholder key in script.js:
const API_KEY = 'your_api_key';

**Open the Application:**
Open the index.html file in any modern web browser.

**Test the Features:**
Enter a recipe name or ingredients (e.g., "pasta" or "tomato, cheese") and click Search.
Results will display recipes with titles, images, and links to full instructions.

**Part 2: Deployment**
The application was deployed to two web servers (Web01 and Web02) with a load balancer (Lb01) to ensure scalability and reliability.

**Deployment Steps**
1. Setup Web Servers (Web01 and Web02)
Install Nginx if not installed:

sudo apt update
sudo apt install nginx

Upload Project Files: Copy index.html, styles.css, and script.js to /var/www/html on each server, or manually create the files:

scp index.html styles.css script.js username@Web01-IP:/var/www/html/

scp index.html styles.css script.js username@Web02-IP:/var/www/html/

Configure Nginx: Update the Nginx configuration to point to the project directory:

server {
    listen 80;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
Restart Nginx:
sudo systemctl restart nginx

**2. Configure the Load Balancer (Lb01)**
Install Nginx if not installed:

sudo apt update
sudo apt install nginx
Setup Load Balancing: Configure Nginx to distribute traffic between Web01 and Web02:

upstream backend {
    server Web01-IP;
    server Web02-IP;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Restart Nginx:
sudo systemctl restart nginx

**3. Testing the Deployment**
Access the load balancer's IP or domain (e.g., http://Lb01-IP) in a browser.
Verify that traffic is distributed between the two servers by monitoring the logs:

sudo tail -f /var/log/nginx/access.log

**APIs Used**
- Spoonacular API: https://spoonacular.com/food-api
- Endpoints Used: /recipes/complexSearch
- Purpose: Retrieve recipes based on user-provided search terms or ingredients.
- Documentation: [API Documentation](https://spoonacular.com/food-api/docs)

**Challenges and Solutions**

Challenge: API Key Security
Issue: Protecting the API key in a frontend-only application.
Solution: Implemented obfuscation for the key to mitigate direct exposure.

Challenge: Load Balancer Configuration
Issue: Ensuring traffic is evenly distributed between Web01 and Web02.
Solution: Configured Nginx with the upstream directive to handle load balancing effectively.

Online link to the recipe finder: https://www.joank7.tech/
Demo video: https://youtu.be/jKU4UgCjKVs
