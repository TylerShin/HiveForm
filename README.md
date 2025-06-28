# 🚀 HiveForm

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

> **A bottom-up atomic form library for React with intelligent auto-generation and performance optimization**

HiveForm is a next-generation React form library that automatically discovers and generates form schemas from your component tree, providing type-safe validation, granular state management, and optimal rendering performance.

## ✨ Features

### 🧩 **Atomic & Bottom-Up Architecture**
- Build forms by composing atomic field components
- Context-driven form discovery and auto-generation
- Seamless integration across file boundaries

### 🎯 **Intelligent Auto-Generation**
- Automatically discovers fields within form contexts
- Generates type-safe form schemas at build time
- Zero configuration for basic use cases

### 🛡️ **Type-Safe Validation**
- Built-in support for popular validators (Zod, Yup, Joi)
- Field-level and form-level validation
- TypeScript-first with complete type inference

### ⚡ **Performance Optimized**
- Granular re-rendering (only changed fields update)
- Built-in memoization for field components
- Selective state subscriptions

### 🎮 **Advanced State Management**
- Track `dirty`, `touched`, `pristine` states
- Field-level error handling
- Form-level aggregated states

## 🏗️ Architecture

```
packages/
├── hiveform/              # Core library
│   ├── src/
│   │   ├── components/    # Atomic form components
│   │   ├── hooks/         # Form state management
│   │   ├── context/       # Form context providers
│   │   ├── validators/    # Validation integrations
│   │   └── types/         # TypeScript definitions
│   └── dist/              # Built library
│
apps/
└── example-app/           # Demo application
    └── src/
        ├── forms/         # Example form implementations
        └── components/    # Demo components
```

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.2.17
- **React** >= 18.0.0
- **TypeScript** >= 5.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hive-form.git
cd hive-form

# Install dependencies
bun install

# Start development
bun dev
```

This will:
1. Build the `hiveform` library in watch mode
2. Start the example app at `http://localhost:3000`
3. Enable hot-reload for both library and app

## 💡 Usage Example

### Basic Form Setup

```tsx
import { FormProvider, useFormContext } from 'hiveform';

// 1. Define your form context
function UserRegistrationForm() {
  return (
    <FormProvider name="userRegistration">
      <UserNameField />
      <EmailField />
      <PasswordField />
      <SubmitButton />
    </FormProvider>
  );
}

// 2. Create atomic field components
function UserNameField() {
  const { field, fieldState } = useFormContext('username');
  
  return (
    <div>
      <input
        {...field}
        placeholder="Username"
        className={fieldState.error ? 'error' : ''}
      />
      {fieldState.error && <span>{fieldState.error.message}</span>}
    </div>
  );
}

// 3. HiveForm automatically generates the form schema!
// Generated type: { username: string; email: string; password: string }
```

### With Validation

```tsx
import { z } from 'zod';
import { withValidation } from 'hiveform';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function ValidatedForm() {
  return (
    <FormProvider 
      name="userRegistration" 
      validation={withValidation(userSchema)}
    >
      {/* Your fields here */}
    </FormProvider>
  );
}
```

## 🛠️ Development

### Project Structure

This is a **Turborepo** monorepo with the following packages:

- **`packages/hiveform`**: The core library built with **rslib**
- **`apps/example-app`**: Demo application built with **rsbuild**

### Available Scripts

```bash
# Development (starts both library and app)
bun dev

# Build all packages
bun build

# Preview production build
bun preview

# Run tests
bun test

# Lint and format with Biome
bun lint              # Check linting issues
bun lint:fix          # Fix linting issues
bun format            # Check formatting
bun format:fix        # Fix formatting
bun check             # Check both linting and formatting
bun check:fix         # Fix both linting and formatting
```

### Development Workflow

1. **Library Development**: Edit files in `packages/hiveform/src/`
2. **Auto-rebuild**: Changes trigger automatic rebuild via `rslib --watch`
3. **Hot Reload**: Example app automatically reflects library changes
4. **Type Safety**: Full TypeScript support with instant feedback

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Monorepo setup with Turborepo
- [x] Core library structure
- [x] Basic component architecture
- [x] Development workflow

### Phase 2: Core Features 🚧
- [ ] Form context provider
- [ ] Field discovery system
- [ ] Auto-generation pipeline
- [ ] Basic validation integration

### Phase 3: Advanced Features 📋
- [ ] Zod/Yup/Joi validation adapters
- [ ] State management (dirty, touched, pristine)
- [ ] Performance optimizations
- [ ] Field-level memoization

### Phase 4: Developer Experience 📋
- [ ] Build-time code generation
- [ ] TypeScript plugin
- [ ] DevTools integration
- [ ] Comprehensive documentation

## 🤝 Contributing
Welcome.

### Commit Convention

We use semantic commit messages:

```
feat: add new form validation feature
fix: resolve field re-rendering issue
docs: update API documentation
refactor: optimize form state management
test: add validation test cases
```



