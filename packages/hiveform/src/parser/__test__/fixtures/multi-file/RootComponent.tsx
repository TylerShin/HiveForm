import { Field } from '../../../../components/Field';
import { HiveForm } from '../../../../components/HiveForm';
import { AddressFields } from './AddressFields';
import { UserFields } from './UserFields';

const RootComponent = () => {
  return (
    <HiveForm context="multiFileForm">
      <UserFields />
      <AddressFields />
      <Field name="consent" />
    </HiveForm>
  );
};

export default RootComponent;
