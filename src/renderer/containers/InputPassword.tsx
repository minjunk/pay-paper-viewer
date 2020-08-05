import { ipcRenderer } from 'electron';
import React, {
  useRef, useEffect, useCallback, useState,
} from 'react';
import cx from 'classnames';

import Button from '../components/Button';

/* eslint-disable jsx-a11y/label-has-associated-control */

export type Props = {
  loading: boolean;
  onSubmit(event: React.FormEvent<HTMLFormElement>, password: string): void;
};

export const InputPassword: React.FC<Props> = ({
  loading,
  onSubmit,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>();
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputRef.current) {
      const { value } = inputRef.current;
      setInputError(!value);
      if (value.length < 8) {
        inputRef.current.select();
      } else {
        onSubmit(event, value);
      }
    }
  }, [inputRef, ipcRenderer]);

  return (
    <form
      id="form"
      method="POST"
      encType="multipart/form-data"
      className={cx('ui form', loading && 'loading')}
      onSubmit={handleSubmit}
    >
      <div className={cx('field', inputError && 'error')}>
        <label htmlFor="password">생년월일</label>
        <input
          ref={inputRef}
          id="password"
          type="password"
          name="password"
          maxLength={8}
          placeholder="생년월일 8자리 (19000101)"
        />
      </div>
      <Button type="submit">
        파일 열기
      </Button>
    </form>
  );
};

export default InputPassword;
