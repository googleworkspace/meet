"use client";

/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ChangeEventHandler,
  DetailedHTMLProps,
  DetailsHTMLAttributes,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";

type EditableProps = DetailedHTMLProps<
  DetailsHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value: string;
  reset: boolean;
  onValueChanged: (value: string) => void;
};

/**
 * Input element that displays as normal text when unfocused.
 */
export function InlineEditable({
  value,
  reset,
  className,
  onValueChanged,
  ...props
}: EditableProps) {
  const [currentValue, setCurrentValue] = useState(value ?? "");
  useEffect(() => {
    setCurrentValue(value ?? "");
  }, [value]);

  const update = (value: string) => {
    if (value) {
      onValueChanged(value);
    }
    setCurrentValue(reset ? "" : value);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    update(e.target.value);
  };

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;

    if (e.key === "Enter") {
      update(target.value);
      return;
    }

    if (e.key === "Escape") {
      setCurrentValue(reset ? "" : target.value);
      return;
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentValue(e.target.value);
  };

  const classes = `
        border-0 bg-transparent p-2 
        hover:bg-white dark:hover:bg-slate-800
        hover:cursor-pointer ${className}
    `;
  return (
    <input
      {...props}
      className={classes}
      type="text"
      value={currentValue}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      onBlur={handleBlur}
    ></input>
  );
}
