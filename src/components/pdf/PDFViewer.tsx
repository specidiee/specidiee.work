'use client';

import styles from './PDFViewer.module.css';

type Props = {
  pdfUrl: string;
};

export default function PDFViewer({ pdfUrl }: Props) {
  return (
    <iframe
      className={styles.frame}
      src={`${pdfUrl}#toolbar=0&navpanes=0`}
      title="PDF 문서"
    />
  );
}
