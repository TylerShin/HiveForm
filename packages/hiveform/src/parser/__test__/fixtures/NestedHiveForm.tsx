import { Field } from '../../../components/Field';
import { HiveForm } from '../../../components/HiveForm';

const NestedHiveForm = () => {
  return (
    <HiveForm context="outerForm">
      <Field name="outerField1" />
      <Field name="outerField2" context="outerForm" />

      <HiveForm context="innerForm">
        <Field name="innerField1" />
        <Field name="innerField2" context="innerForm" />
        <Field name="fieldForOuter" context="outerForm" />
      </HiveForm>

      <HiveForm>
        <Field name="anonymousField" />
        <Field name="explicitOuter" context="outerForm" />
      </HiveForm>
    </HiveForm>
  );
};

export default NestedHiveForm;
