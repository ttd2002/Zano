import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import { UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
};

// ----------------------------------------------------------------------
export function RHFUploadAvatar({ name,onChange, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar
          onChange={onChange}
            accept={{
              'image/*': [],
            }}
            error={!!error}
            file={field.value}
            {...other}
          />

          {/* {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )} */}
        </div>
      )}
    />
  );
}

