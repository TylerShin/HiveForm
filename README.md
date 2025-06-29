<h1 align="center">HiveForm</h1>

<p align="center">
  <strong>Build mighty forms, one cell at a time.</strong>
  <br/>
  A next-generation React library that revolutionizes form development with a bottom-up, atomic design and build-time code generation.
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://reactjs.org/" target="_blank"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://turbo.build/" target="_blank"><img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo"></a>
  <a href="https://bun.sh/" target="_blank"><img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun"></a>
</p>

---

## 🐝 What is HiveForm?

HiveForm is a React form library born from a simple vision: **"Assemble robust forms from tiny, individual cells, just like a beehive."** 
We break away from tedious, manual form setup by leveraging Abstract Syntax Tree (AST) analysis at build-time. This allows HiveForm to automatically generate boilerplate code, freeing you to focus on what truly matters: building great user experiences.

### 🎯 The Problem We Solve

Traditional form development is plagued by common frustrations:
- **Manual Boilerplate**: Repetitive code for every form.
- **Lack of Type Safety**: Form-related errors that only appear at runtime.
- **Poor Performance**: Unnecessary re-renders of the entire form when a single field changes.
- **Complex Maintenance**: The headache of updating multiple files for one small change in the form's structure.

### ✨ Our Core Values

- **Automated Form Generation**: Generate code at build-time through AST analysis.
- **Atomic Design**: Compose complex forms from small, reusable field components.
- **Optimized Performance**: Ensure peak performance with selective, field-level re-rendering.
- **Total Type Safety**: Seamlessly integrate with TypeScript and Zod for end-to-end type safety.

---

## 🌟 Key Features

<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <br/>
      <strong>🧩 Atomic & Bottom-Up Architecture</strong>
      <p align="left">Build forms by composing individual <code>&lt;Field&gt;</code> components within <code>&lt;HiveForm&gt;</code> containers. You focus on the small parts; HiveForm handles the big picture.</p>
    </td>
    <td align="center" valign="top" width="50%">
      <br/>
      <strong>🎯 Intelligent Code Generation</strong>
      <p align="left">At build time, HiveForm analyzes fields inside your <code>&lt;HiveForm&gt;</code> components to automatically generate type-safe form schemas, types, and configurations.</p>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <br/>
      <strong>⚡️ Performance-Optimized</strong>
      <p align="left">Only the fields that change are re-rendered. We prevent unnecessary renders from the start using built-in memoization and subscription-based state management.</p>
    </td>
    <td align="center" valign="top" width="50%">
      <br/>
      <strong>🛡️ Powerful Type Safety & Validation</strong>
      <p align="left">Enjoy first-class support for popular validation libraries like Zod, Yup, and Joi. Our auto-generated types enhance the development experience and eliminate bugs.</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

HiveForm features a unique architecture that combines the power of build-time analysis with a flexible runtime.

```
┌────────── Build Time ──────────┐        ┌────────── Runtime ───────────┐
│                                │        │                            │
│   [ts-morph] AST Parser        │        │   [React] Atomic Components  │
│   - Detects HiveForm scope     │───▶    │   - HiveForm, Field        │
│   - Extracts field props       │        │   - Auto-generated types   │
│   - Analyzes context attr      │        │                            │
│                                │        │                            │
└───────────────┬──────────────┘        └─────────────┬────────────┘
                │                                      │
                ▼                                      ▼
┌──────── Code Generation ───────┐        ┌─────── RSBuild Plugin ───────┐
│                                │        │                            │
│   - Generates TypeScript types │        │   [onBeforeBuild] Production │
│   - Generates Zod schemas      │        │   [onDevCompileDone] Dev Mode│
│   - Generates default values   │        │   - File watching          │
│   - Generates form configs     │        │   - Real-time updates      │
│                                │        │                            │
└────────────────────────────────┘        └────────────────────────────┘
```

### Key Components

- **🔍 AST Parser**: Uses `ts-morph` to analyze your source code and find `HiveForm` components
- **⚡ RSBuild Plugin**: Integrates with your build process for seamless code generation
- **🧬 Code Generator**: Creates type-safe form definitions with Zod validation
- **🔄 Real-time Updates**: Automatically regenerates forms when you modify fields in development

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/TylerShin/hive-form.git
cd hive-form

# Install dependencies
bun install
```

### Run Development Mode

```bash
# Build the library and run the example app
bun dev
```

This command starts the `packages/hiveform` library in watch mode and serves the `apps/example-app` on `http://localhost:3000`. Any changes to the library code will be hot-reloaded in the demo app.

---

## 💡 Usage Example

### 1. Setup the RSBuild Plugin

First, add the HiveForm plugin to your RSBuild configuration.

```ts
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { hiveFormPlugin } from 'hiveform/plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    hiveFormPlugin({
      debug: true, // Enable debug logging during development
    }),
  ],
});
```

### 2. Define Your Form with Atomic Fields

Create your form using the `HiveForm` container and individual `Field` components.

```tsx
// src/components/LoginForm.tsx
import { HiveForm, Field } from 'hiveform';

function LoginForm() {
  return (
    <HiveForm context="login">
      <Field name="email" />
      <Field name="password" />
      <Field name="rememberMe" optional />
    </HiveForm>
  );
}

export default LoginForm;
```

### 3. Build and Get Auto-Generated Code

When you build your project, HiveForm automatically generates type-safe form definitions:

```bash
bun run build
# ✅ HiveForm: Generated src/form/login.tsx (3 fields)
```

The generated file includes everything you need:

```ts
// Auto-generated file: src/form/login.tsx
/**
 * ⚠️  WARNING: AUTO-GENERATED FILE
 * 
 * This file was automatically generated by 🐝 HiveForm.
 * DO NOT EDIT this file manually as your changes will be overwritten.
 * 
 * Generated at: 2025-06-29T09:09:22.011Z
 * 
 * To modify this form:
 * 1. Update your HiveForm component and Field components in your source code
 * 2. The form will be automatically regenerated on next build/save
 * 
 * Learn more: https://github.com/TylerShin/hive-form
 */

import { z } from 'zod';

export type LoginForm = {
  email: string;
  password: string;
  rememberMe?: string; // Optional fields are automatically detected
};

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.string().optional()
});

export const loginDefaultValues = {
  email: '',
  password: '',
  rememberMe: ''
};

export const loginConfig = {
  type: {} as LoginForm,
  schema: loginSchema,
  defaultValues: loginDefaultValues,
  fields: [
    { "name": "email", "optional": false },
    { "name": "password", "optional": false },
    { "name": "rememberMe", "optional": true }
  ]
};
```

### 4. Use the Generated Types in Your Form Logic

Now you can import and use the auto-generated types and schemas:

```tsx
// src/components/LoginForm.tsx
import { HiveForm, Field } from 'hiveform';
import { loginSchema, loginDefaultValues, type LoginForm } from '../form/login';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Form data:', data);
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <HiveForm context="login">
        <Field name="email" />
        <Field name="password" />
        <Field name="rememberMe" optional />
      </HiveForm>
      <button type="submit">Login</button>
    </form>
  );
}
```

### 5. Real-time Development Experience

In development mode, HiveForm automatically regenerates forms when you modify fields:

```bash
bun run dev
# 🎯 HiveForm: Updated 1 form contexts (1 files changed) in 15ms
# ✅ HiveForm: Updated src/form/login.tsx (4 fields)
```

Add a new field and it's instantly available:

```tsx
<HiveForm context="login">
  <Field name="email" />
  <Field name="password" />
  <Field name="rememberMe" optional />
  <Field name="twoFactorCode" optional /> {/* 👈 New field added */}
</HiveForm>
```

The form file is automatically updated with the new field type and schema!

---

## 🛠️ Development

### Project Structure

This is a **Turborepo** monorepo.

- **`packages/hiveform`**: The core library, built with **rslib**.
- **`apps/example-app`**: A demo application, built with **rsbuild**.

### Key Scripts

```bash
bun dev          # Run dev mode (library + app)
bun build        # Build all packages
bun test         # Run tests
bun check        # Lint and format with Biome
bun check:fix    # Auto-fix all lint and format issues
```

---

## 🗺️ Roadmap

- [✅] **Phase 1: Foundation (Weeks 1-4)**
  - [x] Monorepo setup (Bun + Rslib)
  - [x] Core type and interface design
  - [x] Implement basic `Field` and `HiveForm` components
  - [x] RSBuild plugin integration
- [✅] **Phase 2: Atomic System (Weeks 5-8)**
  - [x] Implement Field component with name/optional props
  - [x] HiveForm container with context support
  - [x] Build-time and real-time code generation
  - [x] Auto-generated warning comments
- [✅] **Phase 3: Build-Time Analysis (Weeks 9-12)**
  - [x] Implement ts-morph based AST parser
  - [x] Auto-detect `HiveForm` scope and context
  - [x] Extract and analyze field information
  - [x] Auto-generate TypeScript type definitions
  - [x] Auto-generate Zod schemas and default values
- [🚧] **Phase 4: Enhanced Features (Weeks 13-16)**
  - [ ] Advanced field types (select, checkbox, radio, etc.)
  - [ ] Custom validation rules integration
  - [ ] Form state management (dirty, touched, errors)
  - [ ] Performance optimizations and memoization
  - [ ] Comprehensive documentation and examples

---

## 🤝 Contributing

Contributions are welcome! Please feel free to create an issue or submit a pull request. We follow the Semantic Commit Convention for commit messages.

```
feat: Add new validation feature
fix: Resolve field re-rendering issue
docs: Update API documentation
refactor: Optimize form state management
```


