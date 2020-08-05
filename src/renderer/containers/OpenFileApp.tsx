import fs from 'fs';
import { ipcRenderer } from 'electron';
import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';
import createBlobURL from '../../lib/createBlobURL';

import Message from '../components/Message';
import GithubButton from '../components/GithubButton';
import Webview, { WebviewDomReadyEvent } from '../components/Webview';
import InputPassword from './InputPassword';

export const OpenFileApp: React.FC = () => {
  const webviewRef = useRef<Electron.WebviewTag>();
  const [loading, setLoading] = useState<boolean>(false);
  const [decrypted, setDecrypted] = useState<string>();

  const handleSubmit = useCallback((_event, passwd: string) => {
    setLoading(true);
    ipcRenderer.send('open-file', passwd);
  }, []);

  const handleDecryptedFile = useCallback((_event, data: string) => {
    const blob = createBlobURL(data);
    setDecrypted(blob);
  }, []);

  const handleWebviewDomReady = useCallback((event: WebviewDomReadyEvent) => {
    setLoading(false);

    // 메인 프로세서에 '급여명세서'파일이 열렸음을 알린다.
    ipcRenderer.send('open-paper', {
      title: event.target.getTitle(),
    });
  }, []);

  /**
   * '저장' 다이얼로그에서 저장 위치를 지정한 뒤에 `filePath`을 반환 받고
   * `fs`를 통해 PDF를 생성한 뒤에 파일을 해당 위치에 저장한다.
   */
  const handleWillExportPDfPath = useCallback((_, filePath: string) => {
    webviewRef.current.printToPDF({
      pageSize: 'A4',
    })
      .then((data) => fs.writeFileSync(filePath, data))
      .catch(() => {});
  }, [webviewRef]);

  const handleWillPrintPaper = useCallback(() => {
    webviewRef.current.print();
  }, [webviewRef]);

  useEffect(() => {
    ipcRenderer.on('decrypted-file', handleDecryptedFile);
    ipcRenderer.on('will-export-pdf-path', handleWillExportPDfPath);
    ipcRenderer.on('will-print-paper', handleWillPrintPaper);
    return () => {
      ipcRenderer.off('decrypted-file', handleDecryptedFile);
      ipcRenderer.off('will-export-pdf-path', handleWillExportPDfPath);
      ipcRenderer.off('will-print-paper', handleWillPrintPaper);
    };
  }, [ipcRenderer]);

  return (
    <>
      <div className="ui raised very padded text container segment piled">
        <h2 className="ui header">
          급여명세서 뷰어
        </h2>
        <InputPassword
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
      <Message />
      <GithubButton />
      <Webview
        src={decrypted}
        ref={webviewRef}
        onDomReady={handleWebviewDomReady}
      />
    </>
  );
};

export default OpenFileApp;
