import * as React from 'react';
import { Input } from 'antd';

import Style from './Style';

const RenderField = (item: any, formik: any) => {
  const nameField = formik.values[`${item.name}`] || '';
  const nameFieldRequired = formik.values[`${item.name}=required`] || '';

  const values = { ...formik.values };
  values[`${item.name}=required`] = nameFieldRequired;
  values[`${item.name}`] = nameField;
  values[`${item.name}=active`] = true;
  formik.values = values;

  switch (item.tag) {
    case 'text':
      return (
        <div className="row">
          <div className="col-3">{item.placeholder}</div>
          <div className="col-9">
            <Input
              placeholder={item.placeholder}
              onChange={(event: any) => {
                const { value } = event.target;

                formik.setFieldValue(item.name, value);
                item?.onChange && item?.onChange({ name: item.name, value });
              }}
            />
          </div>
        </div>
      );
    case 'password':
      return (
        <div className="row">
          <div className="col-3">{item.placeholder}</div>
          <div className="col-9">
            <Input.Password
              placeholder={item.placeholder}
              onChange={(event: any) => {
                const { value } = event.target;

                formik.setFieldValue(item.name, value);
                item?.onChange && item?.onChange({ name: item.name, value });
              }}
            />
          </div>
        </div>
      );
    case 'input':
      const { maxLength, label, required, placeholder, length } = item;

      return (
        <div>
          <div>
            <label htmlFor="" className="text-label">
              {label}
              {maxLength > 0 ? `(${length}|${maxLength})` : ''}
              {required && '*'}
              {item.status && !nameField && required && (
                <span
                  style={{
                    color: item.colorRequirePreview && item.colorRequirePreview,
                  }}
                  className="label-required"
                >
                  {item?.messageRequirePreview ? item?.messageRequirePreview : 'REQUIRED'}
                </span>
              )}
            </label>
            {item.textarea ? (
              <textarea
                id="textarea-husble"
                name={label}
                rows={item.maxLines}
                cols={50}
                onKeyPress={(event: any) => {
                  const { value, selectionStart } = event.target;
                  const lines = value.split('\n');
                  const currentLine = value.substr(0, selectionStart).split('\n').length;

                  if (event.key === 'Enter') {
                    if (lines.length >= item.maxLines) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  } else {
                    if (lines[currentLine - 1].length >= item.maxChars) {
                      event.preventDefault();
                      event.stopPropagation();
                    } else {
                      formik.setFieldValue(item.name, value);
                      item?.onChange && item?.onChange({ name: item.name, value });
                    }
                  }
                }}
              ></textarea>
            ) : (
              <input
                type="text"
                className=""
                id="text-husble"
                value={nameField}
                name={label}
                placeholder={placeholder}
                onChange={e => {
                  const { value } = e.target;
                  if (maxLength === 0 || value.length <= maxLength) {
                    formik.setFieldValue(item.name, value);
                    item?.onChange && item?.onChange({ name: item.name, value });
                  }
                }}
              />
            )}
          </div>
          {item.help && (
            <div style={{ marginTop: '10px' }} className="help-text">
              {item.help}
            </div>
          )}
        </div>
      );

    case 'checkbox':
      return (
        <div>
          <div className="" style={{ display: 'flex', margin: '0 5px' }}>
            <div
              className=""
              style={{
                minWidth: '20px',
                height: '20px',
                marginTop: '-10px',
                marginLeft: '5px',
              }}
            >
              <input
                id={item.name}
                type="checkbox"
                className=""
                value={nameField}
                name={item.name}
                placeholder={item.placeholder}
                onChange={() => {
                  const value = nameField === 1 ? true : 1;
                  formik.setFieldValue(item.name, value);
                  item?.onChange && item?.onChange({ name: item.name, value });
                }}
              />
            </div>
            <label
              style={{
                paddingLeft: '10px',
                cursor: 'pointer',
              }}
              htmlFor={item.name}
              className="text-label"
            >
              {item.label}
              {item.required && '*'}
              {item.status && !nameFieldRequired && item.required && (
                <span
                  style={{
                    color: item.colorRequirePreview && item.colorRequirePreview,
                  }}
                  className="label-required"
                >
                  {item?.messageRequirePreview ? item?.messageRequirePreview : 'REQUIRED'}
                </span>
              )}
            </label>
          </div>
          {item.help && (
            <div
              style={{
                margin: '0 10px',
              }}
              className="help-text"
            >
              {item.help}
            </div>
          )}
        </div>
      );

    case 'select':
      const defaulValue = item.placeholder || 'Choose an Option';
      const { option, onChange } = item;

      return (
        <>
          <label className="text-label" htmlFor={item.id}>
            {item.label} {item.required && '*'}
            {item.status && !nameField && item.required && (
              <span
                style={{
                  color: item.colorRequirePreview && item.colorRequirePreview,
                }}
                className="label-required"
              >
                {item?.messageRequirePreview ? item?.messageRequirePreview : 'REQUIRED'}
              </span>
            )}
          </label>
          <div className="select-form">
            <select
              className="select-item"
              id={item.id}
              onChange={(e: any) => {
                const { value } = e.target;

                formik.setFieldValue(item.name, e.target.value);
                item?.onChange && item?.onChange({ name: item.name, value });
              }}
            >
              <option selected disabled value="0">
                {defaulValue}
              </option>
              {option.values?.map((i: any, index: number) => (
                <option key={index} value={i.id}>
                  {i.value}
                </option>
              ))}
            </select>
            <span className="focus"></span>
          </div>
          {item.help && (
            <div style={{ marginTop: '10px' }} className="help-text">
              {item.help}
            </div>
          )}
        </>
      );

    case 'upload':
      return (
        <div style={{ margin: '5px 8px' }}>
          <label className="text-label">
            {item.status && !nameField && item.required && <span className="label-required"></span>}
          </label>
          <div className="" style={{ display: 'flex' }}>
            <label
              className={`upload-image ${item.loading ? 'btn--loading' : ''}`}
              style={{
                cursor: 'pointer',
                border: '2px dashed #f5f5f5',
                padding: '8px 12px',
                borderRadius: '2px',
                color: 'rgb(255, 255, 255)',
                textAlign: 'center',
                width: '100%',
                height: '80px',
                lineHeight: '60px',
                background: 'rgba(255,255,255,0.05)',
              }}
              htmlFor={item.name}
            >
              {item.placeholder}
            </label>
          </div>
          <input
            hidden
            type="file"
            id={item.name}
            accept="image/*"
            onChange={(event: any) => {
              const urlBlob = URL.createObjectURL(
                new Blob([event.target.files[0]], {
                  type: event.target.files[0].type,
                }),
              );
              item?.onChange({ files: event.target.files, url: urlBlob });
            }}
          />
        </div>
      );
    default:
      return null;
  }
};

const RenderForm = (item: any, formik: any): any => {
  return <Style>{RenderField(item, formik)}</Style>;
};

export default RenderForm;
