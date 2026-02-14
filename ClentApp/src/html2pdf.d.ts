declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: string };
    pagebreak?: any;
  }

  interface Html2Pdf {
    from: (element: HTMLElement | string) => Html2Pdf;
    set: (options: Html2PdfOptions) => Html2Pdf;
    save: () => void;
    outputPdf?: () => any;
  }

  const html2pdf: () => Html2Pdf;
  export = html2pdf;
}
