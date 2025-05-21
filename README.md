# Smart Autonomous Truck Management Platform

A full-stack, AI-powered platform to manage and simulate autonomous shipping trucks. This system provides real-time fleet tracking, delivery and maintenance scheduling, live CARLA-based simulations, and intelligent object detection using YOLO.

Built with a modular microservices architecture and deployed on AWS, the platform bridges real-world fleet logistics with simulation and machine learning, providing a powerful tool for both operators and researchers.

---

## Tech Stack

**Frontend:**
- React.js (TypeScript)
- Leaflet.js for map interactions
- WebSockets / MJPEG for live updates

**Backend:**
- Flask (Python REST APIs)
- MongoDB Atlas (NoSQL DB)
- CARLA Simulator for virtual trucks
- YOLOv5 for object detection
- Docker, AWS EC2, Auto Scaling

**DevOps:**
- AWS (EC2, VPC, ALB, NAT Gateway)
- Docker + Elastic Container Registry (ECR)
- CloudWatch for monitoring
- JWT for authentication, bcrypt for secure passwords

---

## 🚀 How to Run the Project

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-truck-platform.git
cd smart-truck-platform

### 2. Run the Project
npm install
npm run dev
Make sure .env.production or .env exists with API base URL:VITE_API_BASE_URL=http://localhost:

RUN BACKEND
cd backend
pip install -r requirements.txt   # install dependencies
python app.py                     # run Flask API
Ensure you have a .env file inside /backend with:
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret
PORT=5011
