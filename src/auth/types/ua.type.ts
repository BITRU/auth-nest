export type UserAgent = {
  httpVersion: string;
  ip: string;
  method: string;
  referer: string;
  url: string;
  ua: {
    ua: string;
    browser: string;
    engine: string;
    os: string;
    device: string;
    cpu: string;
  };
};
