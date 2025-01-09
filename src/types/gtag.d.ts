interface Window {
  gtag: (
    command: string,
    params: string,
    options?: {
      page_path?: string;
      [key: string]: any;
    },
  ) => void;
  dataLayer: any[];
}
