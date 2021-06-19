import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';

import { Button } from '@components/ui/Button';
import Close from '@icons/Close.svg';

import s from './MediaInput.module.sass';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type MediaInputProps = Omit<InputProps, 'value' | 'type' | 'onChange'> & {
  label?: string
  value?: File | string
  error?: string
  success?: boolean
  onChange: (file?: File) => void
};
export enum MediaType {
  Unknown,
  Image,
}
export type MediaPreviewInfo = {
  type: MediaType
  url: string
};

export const MediaInput: React.FC<MediaInputProps> = ({
  label,
  value,
  error,
  success = false,
  disabled,
  onChange,
  className,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaPreviewInfo, setMediaPreviewInfo] = useState<MediaPreviewInfo>();

  const compoundClassname = cx(
    s.root,
    { [s.success]: success },
    { [s.error]: !!error },
    { [s.disabled]: disabled },
    className,
  );

  useEffect(
    () => {
      if (value) {
        if (typeof value === 'string') {
          setMediaPreviewInfo({
            type: MediaType.Image,
            url: value,
          });
        } else {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            ({ target }) => {
              const previewUrl = target?.result;
              if (typeof previewUrl === 'string') {
                let type: MediaType;
                if (value.type.startsWith('image/')) {
                  type = MediaType.Image;
                } else {
                  type = MediaType.Unknown;
                }

                setMediaPreviewInfo({
                  type,
                  url: previewUrl,
                });
              } else {
                throw new Error('Received non string result from file reader');
              }
            },
          );
          reader.readAsDataURL(value);
        }
      } else {
        setMediaPreviewInfo(undefined);
      }
    },
    [value],
  );

  const onInputChange: InputProps['onChange'] = (e) => {
    onChange(
      e.target.files?.length ? e.target.files[0] : undefined,
    );
    e.preventDefault();
  };

  return (
    <div className={compoundClassname}>
      {label && (
        <span className={cx(s.labelText)}>{label}</span>
      )}
      <div className={s.label}>
        {
          mediaPreviewInfo?.type
          && (
            <>
              <Button
                theme="clean"
                className={s.trash}
                onClick={() => !disabled && onChange(undefined)}
              >
                <Close className={s.trashIcon} />
              </Button>
              <div className={s.fileWrapper}>
                {
                  mediaPreviewInfo?.type === MediaType.Image
                  && (
                    <img
                      className={s.imagePreview}
                      src={mediaPreviewInfo.url}
                      alt="DONUTEZ"
                    />
                  )
                }
              </div>
            </>
          )
        }
        {!mediaPreviewInfo?.type && (
          <>
            <p className={s.description}>PNG, JPG. Max 30mb.</p>
            <Button
              className={s.button}
              onClick={() => !disabled && inputRef.current?.click()}
              theme="secondary"
              disabled={disabled}
            >
              Choose file
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          className={s.input}
          type="file"
          onChange={onInputChange}
          accept="image/jpeg,image/png"
          disabled={disabled}
          {...inputProps}
        />
      </div>
      <div className={s.errorContainer}>
        {error && (
          <div className={cx(s.errorText)}>{error}</div>
        )}
      </div>
    </div>
  );
};
