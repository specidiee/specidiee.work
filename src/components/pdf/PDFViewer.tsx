'use client';

import styles from './PDFViewer.module.css';

type Props = {
  pdfUrl: string;
};

export default function PDFViewer({ pdfUrl }: Props) {
  return (
    <div className={styles.root}>
      {/* Desktop: embedded iframe */}
      <iframe
        className={styles.frame}
        src={`${pdfUrl}#toolbar=0&navpanes=0`}
        title="PDF 문서"
      />

      {/* Mobile: open in new tab */}
      <a
        className={styles.mobileBtn}
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.mobileBtnIcon}>↗</span>
        PDF 열기
      </a>
    </div>
  );
}
