# Project Setup Guide

This guide outlines the steps to install, configure, and run the frontend client for the **Prepair** web application.

---

## Prerequisites

Ensure the following are installed on your local development environment:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (included with Node.js)

---

## 1. Install Dependencies

Navigate to the root directory of the frontend project and run:

```bash
npm install
```
This installs all required packages listed in `package.json`.

## 2. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```bash
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=preset
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqvbgqiex
NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/dqvbgqiex/image/upload
```
These variables are used for uploading images via Cloudinary.

## 3. Install UI Dependencies

Install the following additional dependencies used in the project:

```bash
npm install @radix-ui/react-dropdown-menu shadcn-ui clsx lucide-react
```

If shadcn-ui is not recognized, install it globally and initialise it with:

```bash
npm install -g shadcn-ui
npx shadcn-ui init
```

## 4. Start the Frontend Server
To run the application in development mode, use the following command:

```bash
npm run dev
```

By default, the frontend will be available at:  
http://localhost:3000
