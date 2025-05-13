# FoodSpot 🍽️

FoodSpot is a modern web application that helps restaurants create and manage their digital menus. The platform enables restaurants to generate QR codes for their tables, allowing customers to easily access the menu on their mobile devices. This digital transformation helps restaurants reduce costs, update menus in real-time, and provide a better customer experience.

## Key Features

- **Digital Menu Management**
  - Create and manage menu items with prices, descriptions, and images
  - Categorize items into sections (Appetizers, Main Course, Desserts, etc.)
  - Real-time menu updates
  - Special offers and daily specials management

- **QR Code System**
  - Generate unique QR codes for each table
  - Customizable QR code design with restaurant branding
  - Easy scanning and menu access for customers

- **Restaurant Dashboard**
  - Analytics and insights
  - Menu performance tracking
  - Customer feedback system
  - Order management (if integrated with POS)

- **Customer Experience**
  - Mobile-friendly menu interface
  - High-quality food images
  - Detailed item descriptions
  - Allergen information
  - Price transparency

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Headless UI
  - Heroicons
  - Lucide React
  - Framer Motion (for animations)
- **Backend**: Firebase
- **Notifications**: React Hot Toast
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/foodspot.git
cd foodspot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PRIVATE_FIREBASE_STORAGE_BUCKET=your_storage_id
NEXT_PRIVATE_SERVICE_ACCOUNT=service_account_json_in_one_line
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
foodspot/
├── src/              # Source files
│   ├── app/         # Next.js app directory
│   │   ├── admin/   # Restaurant dashboard
│   │   ├── menu/    # Public menu pages
│   │   └── qr/      # QR code generation
│   ├── components/  # React components
│   │   ├── admin/   # Admin dashboard components
│   │   ├── menu/    # Menu display components
│   │   └── shared/  # Shared UI components
│   └── lib/         # Utility functions and configurations
├── public/          # Static assets
└── ...config files
```

## Features

- Modern, responsive UI with smooth animations
- Real-time menu updates using Firebase
- Restaurant authentication and management
- QR code generation and management
- Digital menu creation and customization
- Analytics and insights dashboard
- Toast notifications for user feedback

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
