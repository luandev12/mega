import React from 'react';
import { useDispatch } from 'react-redux';
import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageUrl } from 'remove.bg';

import Style from './Style';

interface Props {
  canvas: any;
  display: string;
}

export default function Index({ canvas, display }: Props) {
  const dispatch = useDispatch();

  const handleRemveBg = async () => {
    const objects = canvas.getActiveObject();

    const type = objects.src.split('.')[5]?.split('?')[0] || 'png';

    removeBackgroundFromImageUrl({
      url: objects.src,
      apiKey: 'kvWWAyTp9WoYbRBXKXzxnHcu',
      size: 'auto',
      type: 'auto',
    })
      .then((result: RemoveBgResult) => {
        const base64img = result.base64img;
        const dataUrl = `data:image/${type};base64,${base64img}`;

        function b64toBlob(b64, onsuccess, onerror) {
          var img = new Image();
          img.onerror = onerror;
          img.onload = function onload() {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(onsuccess);
          };

          img.src = b64;
        }

        b64toBlob(
          dataUrl,
          blob => {
            var url = window.URL.createObjectURL(blob);
            console.log(url, 'url');
            const activeObj = canvas?.getActiveObject();

            activeObj.dynamicImage(url);
          },
          error => {},
        );
      })
      .catch((errors: Array<RemoveBgError>) => {
        console.log(JSON.stringify(errors));
      });
  };

  return (
    <Style>
      <div className="mb-3 ">
        {display !== 'none' && (
          <div className="remove-bg" onClick={handleRemveBg}>
            Remove Background
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between flex-wrap"></div>
    </Style>
  );
}
