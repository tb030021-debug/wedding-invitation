export const KAKAO_SDK_URL =
  "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js";

type KakaoShareOptions = {
  javascriptKey: string;
  siteUrl: string;
  title: string;
  description: string;
  imagePath: string;
};

function getKakaoSdk() {
  if (typeof window === "undefined" || !window.Kakao) {
    throw new Error("카카오톡 공유 기능을 불러오지 못했습니다.");
  }

  return window.Kakao;
}

export function initializeKakao(javascriptKey: string) {
  if (!javascriptKey) {
    throw new Error("카카오 JavaScript 키가 설정되지 않았습니다.");
  }

  const kakao = getKakaoSdk();

  if (!kakao.isInitialized()) {
    kakao.init(javascriptKey);
  }

  if (!kakao.isInitialized()) {
    throw new Error("카카오톡 공유 기능을 초기화하지 못했습니다.");
  }

  return kakao;
}

export function sendKakaoWeddingShare({
  javascriptKey,
  siteUrl,
  title,
  description,
  imagePath
}: KakaoShareOptions) {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");
  const imageUrl = new URL(imagePath, `${normalizedSiteUrl}/`).toString();
  const kakao = initializeKakao(javascriptKey);
  const link = {
    mobileWebUrl: normalizedSiteUrl,
    webUrl: normalizedSiteUrl
  };

  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title,
      description,
      imageUrl,
      link
    },
    buttons: [
      {
        title: "청첩장 보기",
        link
      }
    ]
  });
}
