# Meakutes-Khmer មគ្គុទេសក៍

**Meakutes-Khmer** is a web application developed to promote tourism in Cambodia, one of the oldest countries in Southeast Asia with a rich cultural heritage. Cambodia boasts a variety of tourist attractions, from historical resorts like the luxurious and awe-inspiring temples built by Khmer ancestors to innovative modern resorts, stunning mountain landscapes, diverse wildlife, and some of the most beautiful beaches in Asia. These attractions have the potential to draw both national and international visitors. However, the COVID-19 pandemic caused a significant decline in tourism, impacting local livelihoods.

To address this, we, the students of the Department of Information Technology Engineering (8th generation) at Lao Thomorn, under the guidance of our advisor, Ky Sok Lay, created this final-year project. Meakutes-Khmer aims to promote new and beautiful tourist sites across Cambodia, helping Cambodians and foreign visitors discover these areas. By doing so, we hope to benefit society, improve the livelihoods of people around these tourist sites, and contribute to the recovery of Cambodia’s tourism industry.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Features

- **Interactive Destination Listings**: Browse a curated list of 100 Cambodian tourist destinations with detailed information.
- **Search and Filter**: Easily find destinations by name, description, or province.
- **Sort Functionality**: Sort destinations by rating, reviews, name, or accessibility.
- **Star Rating System**: Rate destinations with an interactive 1-5 star system (ratings stored locally).
- **Pagination**: A "Load More" button to efficiently browse through destinations.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Technologies Used

- **React.js**: A JavaScript library for building a dynamic and interactive user interface.
- **Firebase**: Used for backend services, such as authentication, database management, and hosting (if applicable).
- **Tailwind CSS**: A utility-first CSS framework for creating a modern, responsive design.
- **React Router**: For managing navigation between pages (e.g., Home and Discover).
- **JavaScript (ES6+)**: The core language powering the app’s logic.
- **Node.js**: Required for the development environment to run the React app.
- **Github**: For controll tools
- **Cloudflare**: Hosting Web
---

## Setup Instructions

Follow these steps to set up **Meakutes-Khmer** on your local machine:

### Prerequisites

- **Node.js**: Version 14 or higher (download from [nodejs.org](https://nodejs.org/)).
- **Git**: To clone the repository (download from [git-scm.com](https://git-scm.com/)).
- **Firebase Account**: Required for backend services (if used). Set up a Firebase project at [firebase.google.com](https://firebase.google.com/).

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Mxrn-Cyber/meakutes-khmer-y4-project.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd meakutes-khmer-y4-project
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

   This will install all required packages, including React, Firebase, Tailwind CSS, and React Router.

4. **Set Up Firebase** (if applicable):

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable the services you need (e.g., Firestore for database, Authentication for user login).
   - Copy your Firebase configuration (API keys, project ID, etc.) from the Firebase Console.
   - Create a `.env` file in the root of your project and add your Firebase config:
     ```
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```
   - Ensure Firebase is initialized in your app (e.g., in `src/firebase.js`).

5. **Run the Development Server**:

   ```bash
   npm start
   ```

   or

   ```bash
   yarn start
   ```

   The app will open in your browser at `http://localhost:3000`.

---

## Usage

Once the app is running, you can:

- **Explore the Home Page**: View an introductory slideshow of Cambodian destinations.
- **Discover Destinations**: Navigate to the Discover page to browse, search, filter, and sort through 100 tourist sites.
- **Rate Destinations**: Use the star rating system to rate destinations (ratings are stored locally in this version).
- **Load More Destinations**: Click the "Load More" button on the Discover page to see additional listings.

---

## Contributing

We welcome contributions to **Meakutes-Khmer**! Here’s how you can get involved:

- **Report Issues**: Submit bugs or feature requests via the GitHub issue tracker.
- **Submit Pull Requests**: Fork the repository, make your changes, and submit a pull request for review.
- **Code Standards**: Ensure your code is clean, well-documented, and follows the project’s style guidelines.

For more details, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file (if available).

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Credits

- **Project Team**: Students of the Department of Information Technology Engineering (8th generation) at Lao Thomorn.
- **Advisor**: Ky Sok Lay

---
