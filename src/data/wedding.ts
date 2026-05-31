export type PersonContact = {
  label: string;
  name: string;
  phone: string;
};

export type AccountPerson = {
  relation: string;
  name: string;
  bank: string;
  accountNumber: string;
  kakaoPayUrl?: string;
};

export type AccountGroup = {
  title: string;
  people: AccountPerson[];
};

export type Accounts = {
  groom: AccountGroup;
  bride: AccountGroup;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export const weddingData = {
  groomName: "정재영",
  brideName: "안민주",
  weddingDate: "2026-11-08",
  weddingTime: "오후 1시 00분",
  venueName: "BMK컨벤션 아스틴홀 4F",
  venueAddress: "대전 중구 서문로 133",
  heroImage: "/images/hero.jpeg",
  introMessage: "서로의 계절이 되어 같은 길을 걷겠습니다.",
  invitationMessage:
    "저희 두 사람이 사랑과 믿음으로 한 가정을 이루려 합니다. \n귀한 걸음으로 함께해 주시면 더없는 기쁨으로 간직하겠습니다.",
  groomPhone: "010-2733-5177",
  bridePhone: "010-4456-7562",
  mapLinks: {
    naver:
      "https://naver.me/58NdrkXq",
    kakao:
      "https://kko.to/EevGlDOirI"
  },
  parents: [
    { label: "신랑 어머니", name: "배지수", phone: "010-3325-1157" },
    { label: "신부 아버지", name: "안원주", phone: "010-3579-7562" },
    { label: "신부 어머니", name: "윤수정", phone: "010-8829-7562" }
  ] satisfies PersonContact[],
  galleryImages: [
    { src: "/images/gallery/photo1.svg", alt: "웨딩 사진 1" },
    { src: "/images/gallery/photo2.svg", alt: "웨딩 사진 2" },
    { src: "/images/gallery/photo3.svg", alt: "웨딩 사진 3" },
    { src: "/images/gallery/photo4.svg", alt: "웨딩 사진 4" },
    { src: "/images/gallery/photo5.svg", alt: "웨딩 사진 5" },
    { src: "/images/gallery/photo6.svg", alt: "웨딩 사진 6" },
    { src: "/images/gallery/photo7.svg", alt: "웨딩 사진 7" },
    { src: "/images/gallery/photo8.svg", alt: "웨딩 사진 8" },
    { src: "/images/gallery/photo9.svg", alt: "웨딩 사진 9" },
    { src: "/images/gallery/photo10.svg", alt: "웨딩 사진 10" }
  ] satisfies GalleryImage[],
  accounts: {
    groom: {
      title: "신랑측",
      people: [
        {
          relation: "신랑",
          name: "정재영",
          bank: "농협",
          accountNumber: "302-0938-79-0101",
          kakaoPayUrl: "https://qr.kakaopay.com/FVVBTS85G"
        },
        {
          relation: "어머니",
          name: "배지수",
          bank: "하나은행",
          accountNumber: "355-910123-45607",
          kakaoPayUrl: ""
        }
      ]
    },
    bride: {
      title: "신부측",
      people: [
        {
          relation: "신부",
          name: "안민주",
          bank: "카카오뱅크",
          accountNumber: "3333-37-3275732",
          kakaoPayUrl: "https://qr.kakaopay.com/Ej8JyzqTm"
        },
        {
          relation: "아버지",
          name: "안원주",
          bank: "농협은행",
          accountNumber: "302-1234-5678-91",
          kakaoPayUrl: ""
        },
        {
          relation: "어머니",
          name: "윤수정",
          bank: "기업은행",
          accountNumber: "010-123456-04-015",
          kakaoPayUrl: ""
        }
      ]
    }
  } satisfies Accounts
};

export type WeddingData = typeof weddingData;
