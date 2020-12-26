import { ipcRenderer } from 'electron';
import React, {
  useRef, useEffect, forwardRef, useCallback,
} from 'react';
import styled from '@emotion/styled';

import useForkRef from '../hooks/useForkRef';

export type WebviewDomReadyEvent = Electron.Event & {
  target: Electron.WebviewTag;
};

export type Props = {
  show?: boolean;
  src: string;
  onDomReady?(event: WebviewDomReadyEvent): void;
};

type WebviewContainerProps = {
  show?: boolean;
};

const WebviewContainer = styled.div<WebviewContainerProps>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: #fff;
`;

export const Webview = forwardRef<Electron.WebviewTag, Props>(({
  show,
  src,
  onDomReady,
}: Props, ref) => {
  const innerRef = useRef<Electron.WebviewTag>();
  const webviewRef = useForkRef<Electron.WebviewTag>(ref, innerRef);

  useEffect(() => {
    innerRef.current.addEventListener('dom-ready', onDomReady);
    return () => innerRef.current.removeEventListener('dom-ready', onDomReady);
  }, [ref, onDomReady]);

  const handleExportPdf = useCallback(() => {
    const title = innerRef.current.getTitle();
    ipcRenderer.send('export-pdf', { title });
  }, [ipcRenderer, innerRef]);

  return (
    <WebviewContainer show={show}>
      <div className="ui inverted menu">
        <button
          type="button"
          className="item"
          onClick={handleExportPdf}
        >
          PDF로 내보내기
        </button>
      </div>
      <webview
        ref={webviewRef}
        src={src}
        style={{
          flex: 1,
        }}
      />
    </WebviewContainer>
  );
});

export default Webview;
