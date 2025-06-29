import './App.css';
import { Button, Field, HiveForm } from 'hiveform';

const App = () => {
  return (
    <div className="content">
      <h1>HiveForm Example</h1>
      <p>Testing HiveForm with automatic form generation.</p>

      {/* Example 1: Login Form */}
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>Login Form</h3>
        <HiveForm context="login">
          <Field name="email" />
          <Field name="password" />
          <Field name="confirmPassword" />
          <Field name="rememberMe" optional />
          <Field name="deviceName" optional />
        </HiveForm>
      </div>

      {/* Example 2: User Registration Form */}
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>User Registration Form</h3>
        <HiveForm context="userRegistration">
          <Field name="firstName" />
          <Field name="lastName" />
          <Field name="email" />
          <Field name="password" />
          <Field name="confirmPassword" />
          <Field name="age" optional />
        </HiveForm>
      </div>

      {/* Example 3: Anonymous Form (should generate index.tsx) */}
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>Anonymous Form</h3>
        <HiveForm>
          <Field name="message" />
          <Field name="category" optional />
        </HiveForm>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Button label="Primary Button" primary onClick={() => alert('Primary clicked!')} />
        <Button label="Secondary Button" onClick={() => alert('Secondary clicked!')} />
      </div>
    </div>
  );
};

export default App;
