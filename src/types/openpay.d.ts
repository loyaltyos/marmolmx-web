type OpenPayTokenResponse = {
  data: {
    id: string;
  };
};

type OpenPayErrorResponse = {
  data?: {
    description?: string;
    error_code?: number;
  };
  message?: string;
};

interface Window {
  OpenPay?: {
    setId: (merchantId: string) => void;
    setApiKey: (publicKey: string) => void;
    setSandboxMode: (isSandbox: boolean) => void;
    token: {
      create: (
        card: {
          card_number: string;
          holder_name: string;
          expiration_month: string;
          expiration_year: string;
          cvv2: string;
        },
        onSuccess: (response: OpenPayTokenResponse) => void,
        onError: (response: OpenPayErrorResponse) => void,
      ) => void;
    };
    deviceData?: {
      setup: (formId: string, hiddenFieldName: string) => string;
    };
  };
}
