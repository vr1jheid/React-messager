import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";

interface Props {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label: string;
  value: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const PasswordInput = ({
  label,
  onChange,
  value,
  error = false,
  helperText = "",
  required = false,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormControl error={error} variant="outlined">
      <InputLabel> {label}</InputLabel>
      <OutlinedInput
        required={required}
        value={value}
        onChange={onChange}
        id="outlined-adornment-password"
        type={isVisible ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setIsVisible(!isVisible)}
              edge="end"
            >
              {isVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
      <FormHelperText> {helperText}</FormHelperText>
    </FormControl>
  );
};

export default PasswordInput;
