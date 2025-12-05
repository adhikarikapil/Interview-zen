import React from "react";

import {
  FormControl,
  //   FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file" | "select";
  options?: string[];
}

const FormField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  options = [],
}: FormFieldProps<T>) => {
  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="label">{label}</FormLabel>
            <FormControl>
              {type === "select" ? (
                <select {...field} className="input">
                  <option value="" disabled>
                    Select {label}
                  </option>

                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  {...field}
                  placeholder={placeholder}
                  type={type}
                  className="input"
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormField;
