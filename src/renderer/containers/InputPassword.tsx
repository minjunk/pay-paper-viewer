import { ipcRenderer } from 'electron';
import React, {
  useRef, useEffect, useCallback, useState,
} from 'react';
import cx from 'classnames';

import Button from '../components/Button';

/* eslint-disable jsx-a11y/label-has-associated-control */

const SAVE_PASSWORD_KEY = 'save-password';

function getlocalStoragePassword() {
  try {
    return localStorage.getItem(SAVE_PASSWORD_KEY) || '';
  } catch (err) {
    console.error(err);
    return '';
  }
}

function setlocalStoragePassword(password: string) {
  try {
    if (password) {
      localStorage.setItem(SAVE_PASSWORD_KEY, password);
    } else {
      localStorage.removeItem(SAVE_PASSWORD_KEY);
    }
  } catch (err) {
    //
    console.error(err);
  }
}

export type Props = {
  loading: boolean;
  onSubmit(event: React.FormEvent<HTMLFormElement>, password: string): void;
};

export const InputPassword: React.FC<Props> = ({
  loading,
  onSubmit,
}: Props) => {
  const savedPassword = getlocalStoragePassword();
  const inputRef = useRef<HTMLInputElement>();
  const [savePassword, setSavePassword] = useState(!!savedPassword);
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    // 저장된 비밀번호가 있다면 저장된 비밀번호를 불러온다.
    if (inputRef.current) {
      inputRef.current.value = savedPassword;
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    // '비밀번호 저장' 체크박스를 풀 때 다시 비밀번호 입력을 받을 수 있도록 준비
    if (savedPassword && !savePassword && inputRef.current) {
      inputRef.current.readOnly = false;
      inputRef.current.value = '';
      inputRef.current.focus();

      // 저장된 비밀번호 제거
      setlocalStoragePassword('');
    }
  }, [savePassword, inputRef]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputRef.current) {
      const { value } = inputRef.current;
      setInputError(!value);
      if (value.length < 8) {
        inputRef.current.select();
      } else {
        onSubmit(event, value);

        // 비밀번호 저장
        if (savePassword) {
          setlocalStoragePassword(value);
        }
      }
    }
  }, [inputRef, ipcRenderer, savePassword]);

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
          readOnly={!!savedPassword}
          placeholder="생년월일 8자리 (19000101)"
        />
      </div>
      <div className="inline field">
        <div className="ui checkbox">
          <input
            id="checkbox"
            type="checkbox"
            checked={savePassword}
            onChange={(event) => setSavePassword(event.target.checked)}
          />
          <label htmlFor="checkbox">생년월일 저장</label>
        </div>
      </div>
      <Button type="submit">
        파일 열기
      </Button>
    </form>
  );
};

export default InputPassword;