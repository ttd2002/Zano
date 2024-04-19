import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

const GenderCheckbox = ({ onChange, selectedGender }) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        row
        aria-label="gender"
        name="gender"
        value={selectedGender}
        onChange={onChange}
      >
        <FormControlLabel
          value="male"
          control={<Radio />}
          label="Male"
        />
        <FormControlLabel
          value="female"
          control={<Radio />}
          label="Female"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default GenderCheckbox;
