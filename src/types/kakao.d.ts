export {};

declare global {
  type KakaoWebLink = {
    mobileWebUrl: string;
    webUrl: string;
  };

  type KakaoFeedTemplate = {
    objectType: "feed";
    content: {
      title: string;
      description: string;
      imageUrl: string;
      link: KakaoWebLink;
    };
    buttons: Array<{
      title: string;
      link: KakaoWebLink;
    }>;
  };

  interface KakaoJavaScriptSdk {
    init: (javascriptKey: string) => void;
    isInitialized: () => boolean;
    Share: {
      sendDefault: (template: KakaoFeedTemplate) => void;
    };
  }

  interface Window {
    Kakao?: KakaoJavaScriptSdk;
  }
}
