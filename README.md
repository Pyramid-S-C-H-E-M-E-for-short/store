# 3D Printing Store

A modern e-commerce store built with React, TypeScript, and Vite for selling 3D printed products.

## Features

- **Product Catalog**: Browse all available 3D printed products
- **Product Search**: Search products by name, description, or other attributes
- **Individual Product Pages**: Detailed product views with 3D preview
- **Shopping Cart**: Add products to cart and manage quantities  
- **User Authentication**: Sign up, sign in, and user profiles
- **Responsive Design**: Works on desktop and mobile devices

## Search Functionality

The store includes a powerful search feature:

- **Search Bar**: Located in the navigation header, available on all pages
- **Search Results Page**: Displays matching products with filters and sorting
- **Real-time Search**: Searches through product names, descriptions, and metadata
- **API Integration**: Uses the `/products/search?q=query` endpoint

### Search API

The search functionality uses the endpoint:
```
GET /products/search?q={query}
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context
- **API**: REST API with search capabilities

## Development

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
