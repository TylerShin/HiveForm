
import { HiveForm } from '../../../components/HiveForm';
import { Field } from '../../../Field';

export function TestComponentForParser() {
  return (
    <div>
      <h1>Parser Test</h1>
      <HiveForm context="user-profile">
        <Field name="username" />
        <Field name="email" />
        <div>
          <Field name="nested.field" />
        </div>
      </HiveForm>
      <HiveForm context="another-form">
        <Field name="address" />
      </HiveForm>
    </div>
  );
}
