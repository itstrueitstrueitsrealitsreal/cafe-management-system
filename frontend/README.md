# Vite & NextUI Template

This is a template for creating applications using Vite and NextUI (v2).

[Try it on CodeSandbox](https://githubbox.com/nextui-org/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [NextUI](https://nextui.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## Features

- **Cafe Management**: View, create, edit, and delete cafes.
- **Employee Management**: Manage employees associated with specific cafes.
- **API Integration**: Communicates with the backend API for data operations.

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/itstrueitstrueitsrealitsreal/cafe-management-system.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

If you want to run the development server without Docker, run the following command:

```bash
npm run dev
```

If you want to run the development server using Docker, do the following:

1. Build the Docker image:

   ```sh
   docker build -t cafe-management-backend .
   ```

2. Run the Docker container:

   ```sh
   docker run -d -p 3000:3000 --env-file .env cafe-management-backend
   ```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/nextui-org/vite-template/blob/main/LICENSE).
