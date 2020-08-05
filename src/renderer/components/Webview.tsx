import React, { useRef, useEffect, forwardRef } from 'react';

import useForkRef from '../hooks/useForkRef';

import styles from './Webview.module.css';

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
      className={styles.viewer}
    />
  );
});

export default Webview;
