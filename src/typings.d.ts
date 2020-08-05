interface WebviewAttributes<T> extends React.IframeHTMLAttributes<T> {
  onDomReady?(): void;
}

declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<WebviewAttributes<Electron.WebviewTag>, Electron.WebviewTag>;
  }
}

declare module '*.module.css' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
}
