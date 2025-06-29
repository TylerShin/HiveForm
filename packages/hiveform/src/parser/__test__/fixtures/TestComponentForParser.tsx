import { Field } from '../../../components/Field';
import { HiveForm } from '../../../components/HiveForm';

const NestedComponent = () => (
  <div>
    <Field name="nested.field" />
  </div>
);

const TestComponentForParser = () => {
  return (
    <>
      <HiveForm context="userProfile">
        <Field name="username" />
        <Field name="email" />
        <NestedComponent />
      </HiveForm>
      <HiveForm>
        <Field name="address" />
      </HiveForm>
      <HiveForm>
        <Field name="phoneNumber" />
      </HiveForm>
    </>
  );
};

export default TestComponentForParser;
