import React, { useRef, useEffect, forwardRef } from 'react';

import useForkRef from '../hooks/useForkRef';

export type WebviewDomReadyEvent = Electron.Event & {
  target: Electron.WebviewTag;
};

export type Props = {
  src: string;
  onDomReady?(event: WebviewDomReadyEvent): void;
};

export const Webview = forwardRef<Electron.WebviewTag, Props>(({
  src,
  onDomReady,
}: Props, ref) => {
  const innerRef = useRef<Electron.WebviewTag>();
  const webviewRef = useForkRef<Electron.WebviewTag>(ref, innerRef);

  useEffect(() => {
    innerRef.current.addEventListener('dom-ready', onDomReady);
    return () => innerRef.current.removeEventListener('dom-ready', onDomReady);
  }, [ref, onDomReady]);

  return (
    <webview
      ref={webviewRef}
      src={src}
      style={{
        display: src ? 'flex' : 'none',
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        width: '100%',
        height: '100%',
        background: '#fff',
      }}
    />
  );
});

export default Webview;
