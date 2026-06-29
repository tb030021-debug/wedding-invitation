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
  thumbnailSrc: string;
  alt: string;
};

export const weddingData = {
  siteUrl: "https://wedding-invitation-ochre-mu.vercel.app",
  groomName: "정재영",
  brideName: "안민주",
  weddingDate: "2026-11-08",
  weddingTime: "오후 1시 00분",
  weddingTime24: "13:00",
  weddingDurationMinutes: 120,
  venueName: "BMK컨벤션 아스틴홀 4F",
  venueAddress: "대전 중구 서문로 133",
  venueDirectionsImage: "/images/bmk-directions.jpg",
  parking: {
    floors: "지하 1층 · 지하 2층",
    capacity: "총 600대 수용 가능"
  },
  heroImage: "/images/hero.jpeg",
  shareImage: "/images/gallery/photo1.jpeg",
  music: {
    title: "기념일",
    artist: "한동근",
    youtubeVideoId: "ykw880hg3WY"
  },
  endingMessage:
    "소중한 걸음으로 저희의 시작을 함께해 주셔서 감사합니다.\n보내주신 마음 오래도록 간직하며 예쁘게 살아가겠습니다.",
  introMessage: "서로의 계절이 되어\n같은 길을 걷겠습니다.",
  invitationMessage:
    "저희 두 사람이 사랑과 믿음으로\n한 가정을 이루려 합니다.\n귀한 걸음으로 함께해 주시면\n더없는 기쁨으로 간직하겠습니다.",
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
    {
      src: "/images/gallery/photo1.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo1.jpeg",
      alt: "정원에서 세이브 더 데이트를 든 웨딩 사진"
    },
    {
      src: "/images/gallery/photo2.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo2.jpeg",
      alt: "햇살 아래 나란히 선 신랑 신부"
    },
    {
      src: "/images/gallery/photo3.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo3.jpeg",
      alt: "손을 잡고 걷는 신랑 신부의 흑백 사진"
    },
    {
      src: "/images/gallery/photo4.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo4.jpeg",
      alt: "창가에 선 신랑 신부"
    },
    {
      src: "/images/gallery/photo5.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo5.jpeg",
      alt: "정문 앞에서 미소 짓는 신랑 신부"
    },
    {
      src: "/images/gallery/photo6.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo6.jpeg",
      alt: "꽃과 함께 앉아 있는 신부"
    },
    {
      src: "/images/gallery/photo7.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo7.jpeg",
      alt: "소파에 나란히 앉은 신랑 신부"
    },
    {
      src: "/images/gallery/photo8.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo8.jpeg",
      alt: "함께 미소 짓는 신랑 신부의 흑백 사진"
    },
    {
      src: "/images/gallery/photo9.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo9.jpeg",
      alt: "꽃 장식 앞에서 마주 보는 신랑 신부"
    },
    {
      src: "/images/gallery/photo10.jpeg",
      thumbnailSrc: "/images/gallery/thumbs/photo10.jpeg",
      alt: "드레스와 턱시도를 입고 앉은 신랑 신부"
    }
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
          bank: "농협",
          accountNumber: "150-121-56-023179",
          kakaoPayUrl: "https://qr.kakaopay.com/FZyAg8Axn"
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
